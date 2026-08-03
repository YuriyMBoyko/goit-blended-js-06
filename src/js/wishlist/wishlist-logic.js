import refs from './wishlist-refs.js';
import { renderEmptyWishlist } from './wishlist-render.js';
import { renderProducts } from '../products/products-render.js';
import { loadWishlistItemsFromStorage, saveWishlistItemsToStorage } from '../storage.js';
import { fetchProductById, PRODUCTS_PER_PAGE } from '../products/products-api.js';
import { initProductModal } from '../modal.js';
import { CSS_CLASSES } from '../constants.js';
import { MESSAGES } from '../string-consts.js';
import { showLoader, hideLoader, showLoadMoreBtn, hideLoadMoreBtn, showNotFound, hideNotFound, showError, showInfo, sleep } from '../helpers.js';

let wishlistItemsCount = 0;

document.addEventListener('DOMContentLoaded', () => {
  const items = getWishlistArray();
  renderWishlistItemsCount(items.length);

  renderEmptyWishlist();
  loadWishlistProducts();
  initProductModal(refs.divWishlistProducts);
});

refs.btnWishlistShowMore?.addEventListener('click', loadWishlistProducts);

function renderWishlistItemsCount(count) {
  if (refs.spanNavWishlist) {
    refs.spanNavWishlist.textContent = count;
  }
}

export function isProductInWishlist(productId) {
  if (!productId) return false;

  const items = getWishlistArray();
  return items.some(item => item === parseInt(productId)); // includes(productId);
}

export function addProductToWishlist(productId) {
  if (productId) {
    const items = getWishlistArray();
    if (!items.includes(productId)) {
      items.push(productId);
      setWishlistArray(items);

      if (refs.divWishlistProducts && ((wishlistItemsCount - refs.divWishlistProducts.childElementCount) === 1)) {
        loadWishlistProduct(productId);
      }
    }
  }
}

export function removeProductFromWishlist(productId) {
  if (productId) {
    const items = getWishlistArray();
    if (items.includes(productId)) {
      setWishlistArray(items.filter(item => String(item).toLowerCase() !== String(productId).toLowerCase()));

      if (refs.divWishlistProducts) {
        const itemsToDelete = refs.divWishlistProducts.querySelectorAll(`.${CSS_CLASSES.CLASS_PRODUCTS_ITEM}[data-id="${productId}"]`);
        itemsToDelete.forEach(item => refs.divWishlistProducts.removeChild(item));
      }
    }
  }
}

function getWishlistArray() {
  return loadWishlistItemsFromStorage();
}

function setWishlistArray(items) {
  saveWishlistItemsToStorage(items);
  renderWishlistItemsCount(items.length);
  wishlistItemsCount = items.length;
}

async function loadWishlistProducts() {
  if (!refs.divWishlistProducts) return;

  hideLoadMoreBtn(refs.btnWishlistShowMore);
  showLoader(refs.spanWishlistLoader);
  try {
    await sleep(1000);
    const products = getWishlistArray();
    if (!(products && Array.isArray(products))) return;

    wishlistItemsCount = products.length;
    if (products.length === 0) {
      showNotFound(refs.divWishlistNotFound);
    } else {
      hideNotFound(refs.divWishlistNotFound);
      
      const shownItemsCount = refs.divWishlistProducts.childElementCount;
      wishlistItemsCount = products.length;

      const promises = [];
      let promisesToLoad = (shownItemsCount % PRODUCTS_PER_PAGE);
      promisesToLoad = PRODUCTS_PER_PAGE + ((promisesToLoad !== 0) ? PRODUCTS_PER_PAGE - promisesToLoad : 0);
      products.forEach((productId, index) => {
        if ((index >= shownItemsCount) && (index < wishlistItemsCount) && (promises.length < promisesToLoad)) {
          promises.push(fetchProductById(productId));
        }
      });

/*
      const promises = products.map(productId => {
        return fetchProductById(productId);
      });
*/
      if (promises.length > 0) {
        Promise.allSettled(promises)
          .then(data => {
            const products = [];
            data.forEach(item => {
              if (item.status === 'fulfilled') {
                products.push(item.value);
              }
            })
            renderProducts(products, refs.divWishlistProducts, true);

            const shownItemsCount = refs.divWishlistProducts.childElementCount;
            if (shownItemsCount < wishlistItemsCount) {
              showLoadMoreBtn(refs.btnWishlistShowMore);
            } else {
              showInfo(MESSAGES.INFO_END_OF_WISHLIST);
            }
          });
      }
    }
  } finally {
    hideLoader(refs.spanWishlistLoader);
  }
} 

async function loadWishlistProduct(productId) {
   if (!refs.divWishlistProducts) return;

   const product = await fetchProductById(productId);
   if (product) {
     renderProducts([product], refs.divWishlistProducts, true);
   }
}
