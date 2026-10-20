type Options = {
  now?: () => number;
  freshMs?: number;
  maxAgeMs?: number;
  timeoutMs?: number;
  warn?: (message: string) => void;
};

// Instance-local only: cold instances fail closed without a complete snapshot.
export function createSitemapCache<T>(load: () => Promise<T>, options: Options = {}) {
  const {
    now = Date.now,
    freshMs = 60_000,
    maxAgeMs = 300_000,
    timeoutMs = 8_000,
    warn = (message: string) => console.warn(message),
  } = options;
  let snapshot: { value: T; startedAt: number } | undefined;
  let pending: Promise<T> | undefined;

  return async (): Promise<T> => {
    if (snapshot && now() - snapshot.startedAt < freshMs) return snapshot.value;
    if (pending) return pending;
    const startedAt = now();
    pending = (async () => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        const value = await Promise.race([
          Promise.resolve().then(load),
          new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error('Sitemap CMS timeout')), timeoutMs);
          }),
        ]);
        snapshot = { value, startedAt };
        return value;
      } catch {
        // Never log CMS payloads, tokens, or personal data.
        if (snapshot && now() - snapshot.startedAt < maxAgeMs) {
          warn('[Sitemap] CMS unavailable; using bounded complete snapshot');
          return snapshot.value;
        }
        warn('[Sitemap] CMS unavailable; no valid complete snapshot');
        throw new Error('Complete sitemap temporarily unavailable');
      } finally {
        if (timer) clearTimeout(timer);
      }
    })();
    try {
      return await pending;
    } finally {
      pending = undefined;
    }
  };
}
