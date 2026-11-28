// Keep archived dashboard templates compatible with the current shared contact bar.
export function fourChannelContactHtml(html:string){
  return html.replace(/<a\b[^>]*class="[^"]*\bcontact-phone\b[^"]*"[^>]*>[\s\S]*?<\/a>/g,'')
    .replace(/(<a\b[^>]*class="[^"]*\bcontact-line\b[^"]*"[^>]*>\s*<strong>)[\s\S]*?(<\/strong>)/g,'$1LINE$2');
}
