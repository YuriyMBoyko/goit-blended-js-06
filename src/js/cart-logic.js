import { loadCartItemsFromStorage, saveCartItemsToStorage } from './storage.js';

const refs = {
  spanNavCart: document.querySelector('span[data-cart-count]'),
}

document.addEventListener('DOMContentLoaded', () => {
  const items = loadCartItems() || [];
  renderCartItemsCount(items.reduce((sum, item) => sum + item.quantity, 0));
});

function renderCartItemsCount(count) {
  refs.spanNavCart.textContent = count;
}

export function isProductInCart(productId) {
  if (!productId) return false;

  const items = loadCartItems() || [];
  return items.some(({ id }) => id === parseInt(productId));
}

export function addProductToCart(productId, quantity, price) {
  if ((productId) && (quantity > 0) && (price)) {
    const items = loadCartItems() || [];
    const item = items.find(({ id }) => id === productId)
    if (item) {
      item.quantity = parseInt(quantity);
    } else {
      items.push(newProductCartItem(productId, parseInt(quantity), parseFloat(price)));
    }
    saveCartItems(items);
  }
}

export function removeProductFromCart(productId) {
  if (productId) {
    const items = loadCartItems() || [];
    if (items.some(({ id }) => id === productId)) {
      saveCartItems(items.filter(({ id }) => id !== parseInt(productId)));
    }
  }
}

function loadCartItems() {
  return loadCartItemsFromStorage();
}

function saveCartItems(items) {
  saveCartItemsToStorage(items);
  renderCartItemsCount((items || []).reduce((sum, item) => sum + item.quantity, 0));
}

function newProductCartItem(id, quantity = 1, price = 0) {
  return { id, quantity, price };
}