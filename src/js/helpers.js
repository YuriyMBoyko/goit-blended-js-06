import iziToast from "izitoast";
import 'izitoast/dist/css/iziToast.min.css';
//import { isLightTheme, isDarkTheme} from './theme/theme-logic.js';
import refs from './refs.js';
import { CSS_CLASSES } from "./constants.js";
/*
const themeLightClass = 'light';
const themeDarkClass = 'dark';
*/
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

export function showLoader(tag) {
  tag?.classList.add(CSS_CLASSES.CLASS_IS_VISIBLE);
  tag?.classList.add(CSS_CLASSES.CLASS_IS_LOADING);
//  tag?.classList.remove(CSS_CLASSES.CLASS_IS_HIDDEN);
/*
  refs.loadMoreBtn?.classList.add(CSS_CLASSES.CLASS_IS_LOADING);
  refs.loadMoreBtn?.classList.remove(CSS_CLASSES.CLASS_IS_HIDDEN);
*/
}

export function hideLoader(tag) {
  tag?.classList.remove(CSS_CLASSES.CLASS_IS_VISIBLE);
  tag?.classList.remove(CSS_CLASSES.CLASS_IS_LOADING);
//  tag?.classList.add(CSS_CLASSES.CLASS_IS_HIDDEN);
/*
  refs.loadMoreBtn?.classList.remove(CSS_CLASSES.CLASS_IS_LOADING);
//  refs.loadMoreBtn?.classList.add(CSS_CLASSES.CLASS_IS_HIDDEN);
*/
}

export function showLoadMoreBtn(btn) {
  btn?.classList.add(CSS_CLASSES.CLASS_IS_VISIBLE);
//  btn?.classList.add(CSS_CLASSES.CLASS_IS_LOADING);
  btn?.classList.remove(CSS_CLASSES.CLASS_IS_HIDDEN);
}

export function hideLoadMoreBtn(btn) {
  btn?.classList.remove(CSS_CLASSES.CLASS_IS_VISIBLE);
  btn?.classList.remove(CSS_CLASSES.CLASS_IS_LOADING);
  btn?.classList.add(CSS_CLASSES.CLASS_IS_HIDDEN);
}

export function showNotFound(tag) {
  tag?.classList.add(CSS_CLASSES.CLASS_NOT_FOUND_VISIBLE);
}

export function hideNotFound(tag) {
  tag?.classList.remove(CSS_CLASSES.CLASS_NOT_FOUND_VISIBLE);
}
