import { showError } from './helpers.js';
//import { MESSAGES } from './constants.js';

const STORAGE_KEYS = {
  CART: 'blended-js6-cart',
  WISHLIST: 'blended-js6-wishlist',
}

function loadFromLocalStorage(key, emptyData = '') {
  const savedData = localStorage.getItem(key);

  let data = emptyData;

  if ((savedData) && (typeof data === 'string')) {
    try {
      data = JSON.parse(savedData);
    } catch (error) {
      data = empty;
//      showError(ERROR_LOADING_DATA_FROM_LOCAL_STORAGE + '<br><br>' + error, true);
    }
  }

  return data;
}

function saveIntoLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadWishlistItemsFromStorage() {
  const items = loadFromLocalStorage(STORAGE_KEYS.WISHLIST);
  return (items && Array.isArray(items)) ? items : [];
}

export function saveWishlistItemsToStorage(wishlistItems) {
  if (wishlistItems && Array.isArray(wishlistItems)) {
    saveIntoLocalStorage(STORAGE_KEYS.WISHLIST, wishlistItems);
  }
}

export function loadCartItemsFromStorage() {
  const items = loadFromLocalStorage(STORAGE_KEYS.CART);
  return (items && Array.isArray(items)) ? items : [];
}

export function saveCartItemsToStorage(cartItems) {
  if(cartItems && Array.isArray(cartItems)) {
    saveIntoLocalStorage(STORAGE_KEYS.CART, cartItems)
  }
}