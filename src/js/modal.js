import { fetchProductById } from './products/products-api.js';
import { showError, showInfo } from './helpers.js';
import { CAPTIONS, MESSAGES } from './string-consts.js';
import { isProductInWishlist, addProductToWishlist, removeProductFromWishlist } from './wishlist-logic.js';
import { isProductInCart, addProductToCart, removeProductFromCart } from './cart-logic.js';

const refs = {
  modalDiv: document.querySelector('div.modal'),
  modalCloseBtn: document.querySelector('.modal__close-btn'),
  modalCartBtn: document.querySelector('.modal-product__btn--cart'),
  modalWishlistBtn: document.querySelector('.modal-product__btn--wishlist'),
  modalProductDiv: document.querySelector('div.modal-product'),
}

const MODAL_IS_OPENED_CLASS = 'modal--is-open';

let currentProductId = '';
let currentProductPrice = '';

function isModalOpened() {
  return refs.modalDiv && refs.modalDiv.classList.contains(MODAL_IS_OPENED_CLASS);
}

function bindModalEvents() {
  refs.modalCloseBtn?.addEventListener('click', closeProductModal);

  refs.modalDiv?.addEventListener('click', modalBackdropClick);
  
  document.addEventListener('keydown', modalKeyDown);

  refs.modalWishlistBtn?.addEventListener('click', modalWishListBtnClick);
  refs.modalCartBtn?.addEventListener('click', modalCartBtnClick);
}

function unbindModalEvents() {
  refs.modalCloseBtn?.removeEventListener('click', closeProductModal);

  refs.modalDiv?.removeEventListener('click', modalBackdropClick);
  
  document.removeEventListener('keydown', modalKeyDown);

  refs.modalWishlistBtn?.removeEventListener('click', modalWishListBtnClick);
  refs.modalCartBtn?.removeEventListener('click', modalCartBtnClick);
}

function modalBackdropClick(event) {
  if (event.target === refs.modalDiv) {
    closeProductModal();
  }
}

function modalKeyDown(event) {
  if (event.key === 'Escape' && isModalOpened()) {
    closeProductModal();
  }
}

function showBackdrop() {
  if (refs.modalDiv) {
    refs.modalDiv.classList.add(MODAL_IS_OPENED_CLASS);
    bindModalEvents();
  }
}

function hideBackdrop() {
  if (refs.modalDiv) {
    refs.modalDiv.classList.remove(MODAL_IS_OPENED_CLASS);
    unbindModalEvents();
  }
}

function showLoader(isVisible) {
  const loader = refs.modalDiv?.querySelector('.modal__loader');
  if (!loader) return;

  loader.classList.toggle('is-visible', isVisible);
  loader.setAttribute('aria-hidden', String(!isVisible));
}

export async function openProductModal(productId) {
  showBackdrop();
  fillProductModal(productId);
  updateWishlistCaption(isProductInWishlist(productId));
  updateCartCaption(isProductInCart(productId));
}

export function closeProductModal() {
  currentProductId = '';
  currentProductPrice = '';
  refs.modalProductDiv.innerHTML = '';
  hideBackdrop();
}

async function fillProductModal(productId) {
  showLoader(true);
  try {
    const product = await fetchProductById(productId);
    if (!product) {
      closeProductModal();
      return;
    }
    currentProductId = product.id;
    currentProductPrice = product.price;
    renderProductModal(product);

  } catch (error ) {
    closeProductModal();
    showError(MESSAGES.ERROR_LOADING_PRODUCTS + '<br><br>' + error, true);
  } finally {
    showLoader(false);
  }
}

function renderProductModal(product) {
  refs.modalProductDiv.innerHTML = createProductModalMarkup(product);
}

function createProductModalMarkup(product) {
  return !product ? '' 
    : `
      <img class="modal-product__img" src="${product.images[0]}" alt="${product.thumbnail}" />
      <div class="modal-product__content">
        <p class="modal-product__title">${product.title}</p>
        <ul class="modal-product__tags">${product.tags.map((tag) => {return tag}).join(', ')}</ul>
        <p class="modal-product__description">${product.description}</p>
        <p class="modal-product__shipping-information">Shipping: ${product.shippingInformation}</p>
        <p class="modal-product__return-policy">Return Policy: ${product.returnPolicy}</p>
        <p class="modal-product__price">Price: $${product.price}</p>
        <button class="modal-product__buy-btn" type="button">Buy</button>
      </div>`;
}

function updateWishlistCaption(isInList) {
  refs.modalWishlistBtn.textContent = isInList ? CAPTIONS.WISHLIST_REMOVE : CAPTIONS.WISHLIST_ADD;
}

function updateCartCaption(isInList) {
  refs.modalCartBtn.textContent = isInList ? CAPTIONS.CART_REMOVE : CAPTIONS.CART_ADD;
}

function modalWishListBtnClick(event) {
  if (currentProductId === '') return;

  const isInList = isProductInWishlist(currentProductId);
  if (isInList) {
    removeProductFromWishlist(currentProductId);
  } else {
    addProductToWishlist(currentProductId);
  }
  updateWishlistCaption(!isInList);
}

function modalCartBtnClick(event) {
  if (currentProductId === '') return;

  const isInCart = isProductInCart(currentProductId);
  if (isInCart) {
    removeProductFromCart(currentProductId);
  } else {
    addProductToCart(currentProductId, 1, currentProductPrice);
  }
  updateCartCaption(!isInCart);
}
