import refs from './wishlist-refs.js';
//import { CSS_CLASSES } from '../constants.js';

export function renderEmptyWishlist() {
  if (refs.divWishlistProducts) {
    refs.divWishlistProducts.innerHTML = '';
  }
}
/*
export function showWishlistNotFound() {
  renderEmptyWishlist();
  refs.divWishlistNotFound?.classList.add(CSS_CLASSES.CLASS_NOT_FOUND_VISIBLE);
}

export function hideWishlistNotFound() {
  refs.divWishlistNotFound?.classList.remove(CSS_CLASSES.CLASS_NOT_FOUND_VISIBLE);
}
*/