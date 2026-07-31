import iziToast from "izitoast";
import 'izitoast/dist/css/iziToast.min.css';
//import { isLightTheme, isDarkTheme} from './theme/theme-logic.js';
import refs from './refs.js';

const themeLightClass = 'light';
const themeDarkClass = 'dark';

export function showError(message, isMessageHtml = false) {
//  iziToast.error({ message, position: 'bottomRight', maxWidth: 400, close: true, messageHtml: isMessageHtml, theme: isLightTheme() ? themeLightClass : themeDarkClass });
  iziToast.error({ message, position: 'bottomRight', maxWidth: 400, close: true, messageHtml: isMessageHtml });
}

export function showInfo(message, isMessageHtml = false) {
//  iziToast.info({ message, position: 'bottomRight', maxWidth: 400, close: true, messageHtml: isMessageHtml, theme: isLightTheme() ? themeLightClass : themeDarkClass });
  iziToast.info({ message, position: 'bottomRight', maxWidth: 400, close: true, messageHtml: isMessageHtml });
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/*
const scrollTopBtnActiveClass = 'scroll-top-btn--active';

export function showScrollTopBtn() {
  refs.scrollTopBtn?.classList.add(scrollTopBtnActiveClass);
}

export function hideScrollTopBtn() {
  refs.scrollTopBtn?.classList.remove(scrollTopBtnActiveClass);
}
*/