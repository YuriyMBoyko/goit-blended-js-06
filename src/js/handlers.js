import refs from './refs.js';

window.addEventListener('scroll', () => {
  const scrollTopBtnActiveClass = 'scroll-top-btn--visible';

  window.scrollY > 50 //window.innerHeight
    ? refs.scrollTopBtn?.classList.add(scrollTopBtnActiveClass)
    : refs.scrollTopBtn?.classList.remove(scrollTopBtnActiveClass);
})

function scrollWindow() {
  if (window.scrollY !== 0) {
    setTimeout(() => {
      window.scrollTo(0, window.scrollY - 50);
      scrollWindow();
    }, 10);
  }
}

refs.scrollTopBtn?.addEventListener('click', scrollWindow);