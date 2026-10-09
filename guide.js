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
// Keep collapsed troubleshooting and optional instructions readable in print.
let previouslyOpen = [];
window.addEventListener('beforeprint', () => {
  previouslyOpen = [...document.querySelectorAll('details')].map(el => [el, el.open]);
  for (const [el] of previouslyOpen) el.open = true;
});
window.addEventListener('afterprint', () => {
  for (const [el, open] of previouslyOpen) el.open = open;
});
