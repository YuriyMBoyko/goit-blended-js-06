import { fetchProductById } from './products/products-api.js';
import { createProductModalMarkup } from './products/products-render.js';
import { showError, showInfo } from './helpers.js';
import { errorLoadingProducts } from './string-consts.js';

const refs = {
  modalDiv: document.querySelector('div.modal'),
  modalCloseBtn: document.querySelector('.modal__close-btn'),
  modalCartBtn: document.querySelector('.modal-product__btn--cart'),
  modalWishlistBtn: document.querySelector('.modal-product__btn--wishlist'),
  modalProductDiv: document.querySelector('div.modal-product'),
}

const modalIsOpenClass = 'modal--is-open';

function isModalOpened() {
  return refs.modalDiv && refs.modalDiv.classList.contains(modalIsOpenClass);
}

function bindModalEvents() {
  refs.modalCloseBtn?.addEventListener('click', closeProductModal);

  refs.modalDiv?.addEventListener('click', modalBackdropClick);
  
  document.addEventListener('keydown', modalKeyDown);
}

function unbindModalEvents() {
  refs.modalCloseBtn?.removeEventListener('click', closeProductModal);

  refs.modalDiv?.removeEventListener('click', modalBackdropClick);
  
  document.removeEventListener('keydown', modalKeyDown);
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
    refs.modalDiv.classList.add(modalIsOpenClass);
    bindModalEvents();
  }
}

function hideBackdrop() {
  if (refs.modalDiv) {
    refs.modalDiv.classList.remove(modalIsOpenClass);
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
  renderProduct(productId);
}

export function closeProductModal() {
  hideBackdrop();
}

async function renderProduct(productId) {
  showLoader(true);
  try {
    const product = await fetchProductById(productId);
    refs.modalProductDiv.innerHTML = createProductModalMarkup(product);

//    refs.modalCloseBtn?.focus();
  } catch (error ) {
    closeProductModal();
    showError(errorLoadingProducts + '<br><br>' + error, true);
  } finally {
    showLoader(false);
  }
}
