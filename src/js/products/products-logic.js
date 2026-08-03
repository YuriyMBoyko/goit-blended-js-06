import refs from './products-refs.js';
import { allCategoryName } from './products-consts.js';
import { fetchCategories, fetchProductsByCategory, fetchProductsByQuery, productsPerPage } from './products-api.js';
import { clearProducts, renderCategories, renderProducts } from './products-render.js';
import { showError, showInfo, sleep } from '../helpers.js';
import { MESSAGES } from '../string-consts.js';
//import { ERROR_LOADING_CATEGOREIS, ERROR_LOADING_PRODUCTS, ERROR_CHANGING_CATEGORY, INFO_NO_PRODUCTS_FOUND, INFO_END_OF_PRODUCTS_LIST, INFO_NO_PRODUCT_INFO } from '../string-consts.js';
import { openProductModal } from '../modal.js';

let currentCategory = '';
let currentPage = 1;
let currentQuery;
let isLoading = false;
let clickedCategoryName = '';

document.addEventListener('DOMContentLoaded', initCategories);
refs.categoriesList.addEventListener('click', handleCategoryClick);
refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);

function initProductModal() {
  if (!refs.productsList) return;

  refs.productsList.addEventListener('click', event => {
    const clicked = event.target.closest('.products__item');
    if (clicked) {
      const productId = clicked.dataset.id;
      if (!productId) {
        showInfo(MESSAGES.INFO_NO_PRODUCT_INFO);
        return;
      }
      openProductModal(productId);
    }
  });
}

const categoriesBtnClass = 'categories__btn';
const categoriesBtnIsActiveClass = 'categories__btn--active';

async function initCategories() {
  showLoader();
  try {
    await sleep(1000);
    var categories = await fetchCategories();
    categories = [allCategoryName, ...categories];
    renderCategories(categories);

    const firstBtn = refs.categoriesList.querySelector(`.${categoriesBtnClass}`);
    if (firstBtn) firstBtn.classList.add(categoriesBtnIsActiveClass);

    clickedCategoryName = firstBtn?.dataset.categoryName;
    await getProductsByCategory(clickedCategoryName || '', 1);

    initProductModal();
  } catch (error) {
    console.log(error);
    
    showError(MESSAGES.ERROR_LOADING_CATEGOREIS + '<br><br>' + error);
  } finally {
    hideLoader();
//    hideLoadMoreBtn();
  }
}

async function handleCategoryClick(event) {
  const clicked = event.target;  
  if ((!clicked) || (!clicked.classList.contains(`${categoriesBtnClass}`)) || clicked.classList.contains(categoriesBtnIsActiveClass)) return;

  document.querySelector(`.${categoriesBtnClass}.${categoriesBtnIsActiveClass}`)?.classList.remove(categoriesBtnIsActiveClass);

  clicked.classList.add(categoriesBtnIsActiveClass);
  setTimeout(() => {
    clickedCategoryName = clicked.dataset.categoryName;
    getProductsByCategory(clickedCategoryName || '');
  }, 10);
}

async function getProductsByCategory(category = '', page = 1) {
  if (isLoading) {
    if (clickedCategoryName.toLowerCase() !== category.toLowerCase()) return;
    
    setTimeout(() => {getProductsByCategory(category, page)}, 100);
  } else {
    isLoading = true;
    showLoader();
    try {
      currentQuery = '';
//      hideLoadMoreBtn();
      hideNotFound();
      renderProducts([], (page !== 1));
/*
      if (page === 1) {
        clearProducts();
      }
*/
      await sleep(1000);

      currentCategory = category;

      const products = await fetchProductsByCategory(currentCategory, page);

      if (clickedCategoryName.toLowerCase() !== currentCategory.toLowerCase()) return;

      handleProducts(products, page);
    } catch (error) {
      console.error(error);

      if (page === 1) {
        clearProducts();
      }

      hideLoadMoreBtn();
      showError(MESSAGES.ERROR_LOADING_PRODUCTS + '<br><br>' + error, true);
    } finally {
      isLoading = false;
      hideLoader();
    }
  }
}

export async function getProductsByQuery(query = '', page = 1) {
  if (!query) {
    currentQuery = '';
    clickedCategoryName = currentCategory;
    document.querySelector(`.${categoriesBtnClass}[data-category-name="${currentCategory}"]`)?.classList.add(categoriesBtnIsActiveClass);
    getProductsByCategory(currentCategory, 1);
    return;
  }

  if (isLoading) {
    return;
  } else {
    isLoading = true;
    showLoader();
    try {
//      hideLoadMoreBtn();
      hideNotFound();
      document.querySelector(`.${categoriesBtnClass}.${categoriesBtnIsActiveClass}`)?.classList.remove(categoriesBtnIsActiveClass);
      renderProducts([], (page !== 1));
/*
      if (page === 1) {
        clearProducts());
      }
*/
      await sleep(1000);

      currentQuery = query;

      const products = await fetchProductsByQuery(query, page);

//      if (clickedCategoryName.toLowerCase() !== currentCategory.toLowerCase()) return;

      handleProducts(products, page);
    } catch (error) {
      console.error(error);

      if (page === 1) {
        clearProducts();
      }

      hideLoadMoreBtn();
      showError(MESSAGES.ERROR_LOADING_PRODUCTS + '<br><br>' + error, true);
    } finally {
      isLoading = false;
      hideLoader();
    }
  }
}

function handleProducts(products, page) {
  const items = products?.products || [];
  const totalItems = products?.total || 0;
  const limit = products?.limit || productsPerPage;
  const totalPages = Math.ceil(totalItems / productsPerPage);

  currentPage = page;
  if ((page === 1) && (items.length === 0)) {
    hideLoadMoreBtn();
//    clearProducts();
    showNotFound();
    showInfo(MESSAGES.INFO_NO_PRODUCTS_FOUND);
    return;
  }

  renderProducts(items, (page !== 1));

  let newProducts;
  if (page === 1) {
    newProducts = refs.productsList.querySelectorAll('.products__item');
  } else {
    const currentCount = refs.productsList.children.length;
    const allProducts = refs.productsList.querySelectorAll('.products__item');
    newProducts = Array.from(allProducts).slice(currentCount);
  }

  if ((page >= totalPages) || (items.length < productsPerPage)) {
    hideLoadMoreBtn();

    if (page > 1) {
      showInfo(MESSAGES.INFO_END_OF_PRODUCTS_LIST);
    }
  } else {
    showLoadMoreBtn();
  }
}

async function handleLoadMoreBtnClick(event) {
  try {
    if (currentQuery) {
      await getProductsByQuery(currentQuery, currentPage + 1);
    } else {
      await getProductsByCategory(currentCategory, currentPage + 1);
    }
  } catch {
    showError(MESSAGES.ERROR_LOADING_PRODUCTS);
  }
}

export async function getProductsList() {

}

const isVisibleClass = 'is-visible';
const isHiddenClass = 'is-hidden';
const isLoadingClass = 'is-loading';
const notFoundVisibleClass = 'not-found--visible';

function showLoader() {
  refs.loader?.classList.add(isVisibleClass);
  refs.loader?.classList.add(isLoadingClass);
//  refs.loader?.classList.remove(isHiddenClass);

  refs.loadMoreBtn?.classList.add(isLoadingClass);
  refs.loadMoreBtn?.classList.remove(isHiddenClass);
}

function hideLoader() {
  refs.loader?.classList.remove(isVisibleClass);
  refs.loader?.classList.remove(isLoadingClass);
//  refs.loader?.classList.add(isHiddenClass);

  refs.loadMoreBtn?.classList.remove(isLoadingClass);
//  refs.loadMoreBtn?.classList.add(isHiddenClass);
}

function showLoadMoreBtn() {
  refs.loadMoreBtn?.classList.add(isVisibleClass);
//  refs.loadMoreBtn?.classList.add(isLoadingClass);
  refs.loadMoreBtn?.classList.remove(isHiddenClass);
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn?.classList.remove(isVisibleClass);
  refs.loadMoreBtn?.classList.remove(isLoadingClass);
  refs.loadMoreBtn?.classList.add(isHiddenClass);
}

function showNotFound() {
  refs.notFound?.classList.add(notFoundVisibleClass);
}

function hideNotFound() {
  refs.notFound?.classList.remove(notFoundVisibleClass);
}
