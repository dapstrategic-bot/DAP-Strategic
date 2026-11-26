const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync('lib/page-resume-analytics.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function harness({ hidden = false, gtag = false } = {}) {
  let now = 1000;
  let timerId = 0;
  const timers = new Map();
  const listeners = new Map();
  const calls = [];
  const document = {
    visibilityState: hidden ? 'hidden' : 'visible',
    title: 'DAP page',
    addEventListener: (name, fn) => listeners.set(`document:${name}`, fn),
    removeEventListener: (name) => listeners.delete(`document:${name}`),
  };
  const window = {
    location: { href: 'https://www.dap.co.th/products/tonrob-2570?utm_source=test', pathname: '/products/tonrob-2570' },
    addEventListener: (name, fn) => listeners.set(`window:${name}`, fn),
    removeEventListener: (name) => listeners.delete(`window:${name}`),
    ...(gtag ? { gtag: (...args) => calls.push(args) } : {}),
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, window, document, Date: { now: () => now },
    setTimeout: (fn) => { timers.set(++timerId, fn); return timerId; },
    clearTimeout: (id) => timers.delete(id),
  });
  return {
    ...exports, window, document, calls, listeners,
    advance: (ms) => { now += ms; },
    visibility: (state) => {
      document.visibilityState = state;
      listeners.get('document:visibilitychange')?.();
    },
    popstate: () => listeners.get('window:popstate')?.(),
    flush: () => { for (const [id, fn] of timers) { timers.delete(id); fn(); } },
    commands: () => window.dataLayer?.map((args) => Array.from(args)) || calls,
  };
}

let h = harness();
let stop = h.installPageResumeTracking();
h.visibility('visible'); h.flush();
assert.equal(h.commands().length, 0, 'initial load stays automatic');
h.visibility('hidden'); h.advance(h.GA_SESSION_TIMEOUT_MS - 1);
h.visibility('visible'); h.flush();
assert.equal(h.commands().length, 0, 'short tab switches add no pageview');
h.visibility('hidden'); h.advance(h.GA_SESSION_TIMEOUT_MS);
assert.equal(h.commands().length, 0, 'hidden tabs emit no events');
h.visibility('visible'); h.flush();
assert.equal(h.commands().length, 1, 'long-hidden same-page return emits once');
let [command, name, params] = h.commands()[0];
assert.equal(command, 'event'); assert.equal(name, 'page_view');
assert.equal(params.page_location, h.window.location.href, 'full URL and campaign query retained');
assert.equal(params.page_title, 'DAP page');
assert.equal(params.send_to, 'G-F7YFJ2S9YL');
assert.equal(params.page_view_reason, 'resume_after_inactivity');
h.visibility('visible'); h.visibility('visible'); h.flush();
assert.equal(h.commands().length, 1, 'repeat visibility notifications cannot duplicate');
h.visibility('hidden'); h.advance(h.GA_SESSION_TIMEOUT_MS);
h.visibility('visible');
h.window.location.href = 'https://www.dap.co.th/services';
h.flush();
assert.equal(h.commands().length, 1, 'navigation has one automatic owner, no fallback');
h.visibility('hidden'); h.advance(h.GA_SESSION_TIMEOUT_MS);
h.visibility('visible'); h.popstate(); h.flush();
assert.equal(h.commands().length, 1, 'back/forward cancels pending resume');
h.visibility('hidden'); h.advance(h.GA_SESSION_TIMEOUT_MS);
h.visibility('visible'); stop(); h.flush();
assert.equal(h.commands().length, 1, 'unmount cancels pending work');
assert.equal(h.listeners.size, 0, 'unmount removes listeners');

h = harness({ hidden: true, gtag: true });
stop = h.installPageResumeTracking();
h.advance(h.GA_SESSION_TIMEOUT_MS);
h.visibility('hidden'); // duplicate hidden notification must not reset clock
h.visibility('visible'); h.flush();
assert.equal(h.calls.length, 1, 'background-opened tab and existing gtag supported');
assert.equal(h.window.dataLayer, undefined, 'gtag and queue are mutually exclusive');
h.visibility('hidden'); h.advance(h.GA_SESSION_TIMEOUT_MS);
h.window.location.pathname = '/en/services';
h.window.location.href = 'https://www.dap.co.th/en/services';
h.visibility('visible'); h.flush();
assert.equal(h.calls.length, 1, 'URL changed while hidden uses automatic tracking');
stop();

h = harness();
stop = h.installPageResumeTracking(); stop();
stop = h.installPageResumeTracking();
h.visibility('hidden'); h.advance(h.GA_SESSION_TIMEOUT_MS);
h.visibility('visible'); h.flush();
assert.equal(h.commands().length, 1, 'Strict Mode setup/cleanup does not duplicate');
stop();

const component = fs.readFileSync('components/shared/AnalyticsPageView.tsx', 'utf8');
assert.equal(component.includes("window.gtag('event', 'page_view'"), false, 'no parallel GA4 route sender');
assert.ok(component.includes("window.fbq('track', 'PageView')"), 'Meta route tracking preserved');
console.log('PASS: initial load, SPA ownership, short/long hidden return, queued/existing gtag, URL/query, repeated events, navigation, cleanup and Strict Mode');
