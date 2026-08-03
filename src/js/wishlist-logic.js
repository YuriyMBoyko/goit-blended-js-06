import { loadWishlistItemsFromStorage, saveWishlistItemsToStorage } from './storage.js';

const refs = {
  spanNavWishlist: document.querySelector('span[data-wishlist-count]'),
}

document.addEventListener('DOMContentLoaded', () => {
  const items = loadWishlistItems();
  renderWishlistItemsCount(items.length);
});

function renderWishlistItemsCount(count) {
  refs.spanNavWishlist.textContent = count;
}

export function isProductInWishlist(productId) {
  if (!productId) return false;

  const items = loadWishlistItems();
  return items.includes(productId);
}

export function addProductToWishlist(item) {
  if (item) {
    const items = loadWishlistItems();
    if (!items.includes(item)) {
      items.push(item);
    }
    saveWishlistItems(items);
  }
}

export function removeProductFromWishlist(item) {
  if (item) {
    const items = loadWishlistItems();
    if (items.includes(item)) {
      saveWishlistItems(items.filter(element => String(element).toLowerCase() !== String(item).toLowerCase()));
    }
  }
}

function loadWishlistItems() {
  return loadWishlistItemsFromStorage();
}

function saveWishlistItems(items) {
  saveWishlistItemsToStorage(items);
  renderWishlistItemsCount(items.length);
}
