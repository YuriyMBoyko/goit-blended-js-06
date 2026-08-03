import refs from './refs.js';

window.addEventListener('scroll', () => {
  const SCROLL_TOP_BUTTON_ACTIVE_CALSS = 'scroll-top-btn--visible';

  window.scrollY > 50 //window.innerHeight
    ? refs.scrollTopBtn?.classList.add(SCROLL_TOP_BUTTON_ACTIVE_CALSS)
    : refs.scrollTopBtn?.classList.remove(SCROLL_TOP_BUTTON_ACTIVE_CALSS);
})

refs.scrollTopBtn?.addEventListener('click', scrollWindow);

function scrollWindow() {
  if (window.scrollY !== 0) {
    setTimeout(() => {
      window.scrollTo(0, window.scrollY - 50);
      scrollWindow();
    }, 10);
  }
}
