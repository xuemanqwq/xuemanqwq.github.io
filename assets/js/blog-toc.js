(function () {
  const root = document.documentElement;
  const toc = document.querySelector('.blog-toc');
  const list = toc && toc.querySelector('.blog-toc__list');
  if (!toc || !list) return;

  let observer;

  function renderToc() {
    if (observer) observer.disconnect();
    list.replaceChildren();

    const language = root.classList.contains('site-lang-en') ? 'en' : 'zh';
    const article = document.querySelector('.blog-post__content.lang-panel--' + language)
      || document.querySelector('.blog-post__content');
    const headings = article ? Array.from(article.querySelectorAll('h2, h3')) : [];
    toc.hidden = headings.length === 0;
    if (!headings.length) return;

    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = 'blog-section-' + (index + 1);

      const item = document.createElement('li');
      item.className = 'blog-toc__item' + (heading.tagName === 'H3' ? ' blog-toc__item--nested' : '');

      const link = document.createElement('a');
      link.className = 'blog-toc__link';
      link.href = '#' + heading.id;
      link.textContent = heading.textContent.trim();
      item.appendChild(link);
      list.appendChild(item);
    });

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          list.querySelectorAll('.blog-toc__link').forEach((link) => {
            link.classList.toggle('is-active', link.hash === '#' + entry.target.id);
          });
        });
      }, { rootMargin: '-12% 0px -72% 0px' });
      headings.forEach((heading) => observer.observe(heading));
    }
  }

  renderToc();
  new MutationObserver(renderToc).observe(root, { attributes: true, attributeFilter: ['class'] });
})();
