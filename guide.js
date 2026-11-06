// A reading guide: all instructions and links also work without JavaScript.
const menuLinks = [...document.querySelectorAll('.sidebar nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
if ('IntersectionObserver' in window) {
  const activeSections = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) activeSections.add(entry.target.id);
      else activeSections.delete(entry.target.id);
    }
    const active = sections.find(section => activeSections.has(section.id));
    if (!active) return;
    for (const link of menuLinks) {
      if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }, {rootMargin: '-135px 0px -45% 0px', threshold: 0});
  for (const section of sections) observer.observe(section);
}
// Footer "指南適用 build N · 更新於 日期" tracks the latest published release so
// it never goes stale again; the static values in the HTML are the no-JS
// fallback. version.json is updated automatically by release.py publish.
fetch('version.json', {cache: 'no-store'}).then(response => response.json()).then(data => {
  const release = data && Array.isArray(data.releases) ? data.releases[0] : null;
  if (!release) return;
  const buildEl = document.getElementById('guide-build');
  if (buildEl && release.build != null) buildEl.textContent = release.build;
  const dateEl = document.getElementById('guide-date');
  if (dateEl && typeof release.date === 'string') {
    dateEl.textContent = release.date.replaceAll('-', ' / ');
  }
}).catch(() => {});

// Keep collapsed troubleshooting and optional instructions readable in print.
let previouslyOpen = [];
window.addEventListener('beforeprint', () => {
  previouslyOpen = [...document.querySelectorAll('details')].map(el => [el, el.open]);
  for (const [el] of previouslyOpen) el.open = true;
});
window.addEventListener('afterprint', () => {
  for (const [el, open] of previouslyOpen) el.open = open;
});
