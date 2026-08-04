import refs from './cart-refs.js';

export function renderEmptyCart() {
  if (refs.divCartProducts) {
    refs.divCartProducts.innerHTML = '';
  }
}
