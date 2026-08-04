import refs from './cart-refs.js';
import { renderEmptyCart } from './cart-render.js';
import { renderProducts } from '../products/products-render.js';
import { loadCartItemsFromStorage, saveCartItemsToStorage } from '../storage.js';
import { fetchProductById, PRODUCTS_PER_PAGE } from '../products/products-api.js';
import { initProductModal } from '../modal.js';
import { CSS_CLASSES, MESSAGES } from '../constants.js';
import { showLoader, hideLoader, showLoadMoreBtn, hideLoadMoreBtn, showNotFound, hideNotFound, showError, showInfo, sleep } from '../helpers.js';

document.addEventListener('DOMContentLoaded', () => {
  const items = getCartItemsArray();
  renderCartItemsCount(items.reduce((sum, item) => sum + item.quantity, 0));

  renderEmptyCart();
  loadCartProducts();
  initProductModal(refs.divCartProducts);
});

refs.btnCartBuy?.addEventListener('click', (event) => {
  showInfo(MESSAGES.INFO_PRODUCTS_PURCHASED);
  clearCart();

  setTimeout(() => {
    window.location.href = './';
  }, 3000);
});

function renderCartItemsCount(count) {
  refs.spanNavCart.textContent = count;
}

export function isProductInCart(productId) {
  if (!productId) return false;

  const items = getCartItemsArray();
  return items.some(({ id }) => id === parseInt(productId));
}

export function addProductToCart(productId, quantity, price) {
  if ((productId) && (quantity > 0) && (price)) {
    const items = getCartItemsArray();
    const item = items.find(({ id }) => id === productId)
    if (item) {
      item.quantity = parseInt(quantity);
    } else {
      items.push(newProductCartItem(productId, parseInt(quantity), parseFloat(price)));

      loadCartProduct(productId);
    }
    setCartItemsArray(items);
  }
}

export function removeProductFromCart(productId) {
  if (productId) {
    const items = getCartItemsArray();
    if (items.some(({ id }) => id === productId)) {
      setCartItemsArray(items.filter(({ id }) => id !== parseInt(productId)));

      if (refs.divCartProducts) {
        const itemsToDelete = refs.divCartProducts.querySelectorAll(`.${CSS_CLASSES.CLASS_PRODUCTS_ITEM}[data-id="${productId}"]`);
        itemsToDelete.forEach(item => refs.divCartProducts.removeChild(item));
      }
    }
  }
}

export function clearCart() {
  setCartItemsArray([]);
  renderEmptyCart();
}

export function updateCartSummaryData(cartArray) {
  if (refs.spanCartDataCount) {
    refs.spanCartDataCount.textContent = cartArray
      .reduce((sum, { quantity }) => sum + quantity, 0)
      .toFixed(2);
  }

  if (refs.spanCartDataPrice) {
    refs.spanCartDataPrice.textContent = '$' + cartArray
      .reduce((sum, { price, quantity }) => sum + price * quantity, 0)
      .toFixed(2);
  }
}

function getCartItemsArray() {
  return loadCartItemsFromStorage();
}

function setCartItemsArray(cartArray) {
  saveCartItemsToStorage(cartArray);
  renderCartItemsCount((cartArray || []).reduce((sum, item) => sum + item.quantity, 0));

  updateCartSummaryData(cartArray);
}

function newProductCartItem(id, quantity = 1, price = 0) {
  return { id, quantity, price };
}

async function loadCartProducts() {
  if (!refs.divCartProducts) return;

  updateCartSummaryData([]);
  showLoader(refs.spanCartLoader);
  try {
    await sleep(1000);
    const cartArray = getCartItemsArray();
    if (!(cartArray && Array.isArray(cartArray))) return;

    if (cartArray.length === 0) {
      showNotFound(refs.divCartNotFound);
    } else {
      hideNotFound(refs.divCartNotFound);

      const promises = cartArray.map(product => {
        return fetchProductById(product.id);
      });

      if (promises.length > 0) {
        Promise.allSettled(promises)
          .then(data => {
            const products = [];
            data.forEach(item => {
              if (item.status === 'fulfilled') {
                products.push(item.value);
              }
            })
            renderProducts(products, refs.divCartProducts, true);
            updateCartSummaryData(cartArray);
          });
      }
    }
  } finally {
    hideLoader(refs.spanCartLoader);
  }
} 

async function loadCartProduct(productId) {
   if (!refs.divCartProducts) return;

   const product = await fetchProductById(productId);
   if (product) {
     renderProducts([product], refs.divCartProducts, true);
   }
}
