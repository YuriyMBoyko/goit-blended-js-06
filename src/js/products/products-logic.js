import refs from './products-refs.js';
import { allCategoryName } from './products-consts.js';
import { fetchCategories, fetchProductsByCategory, fetchProductsByQuery, PRODUCTS_PER_PAGE } from './products-api.js';
import { clearProducts, renderCategories, renderProducts } from './products-render.js';
import { showLoader, hideLoader, showLoadMoreBtn, hideLoadMoreBtn, showNotFound, hideNotFound, showError, showInfo, sleep } from '../helpers.js';
import { CSS_CLASSES, MESSAGES } from '../constants.js';
import { initProductModal } from '../modal.js';

let currentCategory = '';
let currentPage = 1;
let currentQuery;
let isLoading = false;
let clickedCategoryName = '';

document.addEventListener('DOMContentLoaded', initCategories);
refs.categoriesList.addEventListener('click', handleCategoryClick);
refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);

const categoriesBtnClass = 'categories__btn';
const categoriesBtnIsActiveClass = 'categories__btn--active';

async function initCategories() {
  showLoader(refs.loader);
  try {
    await sleep(1000);
    var categories = await fetchCategories();
    categories = [allCategoryName, ...categories];
    renderCategories(categories);

    const firstBtn = refs.categoriesList.querySelector(`.${categoriesBtnClass}`);
    if (firstBtn) firstBtn.classList.add(categoriesBtnIsActiveClass);

    clickedCategoryName = firstBtn?.dataset.categoryName;
    await getProductsByCategory(clickedCategoryName || '', 1);

    initProductModal(refs.productsList);
  } catch (error) {
    console.log(error);
    
    showError(MESSAGES.ERROR_LOADING_CATEGOREIS + '<br><br>' + error);
  } finally {
    hideLoader(refs.loader);
//    hideLoadMoreBtn(refs.loadMoreBtn);
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
    hideLoadMoreBtn(refs.loadMoreBtn);
    hideNotFound(refs.notFound);
    showLoader(refs.loader);
    try {
      currentQuery = '';
//      hideLoadMoreBtn(refs.loadMoreBtn);
      renderProducts([], null, (page !== 1));
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

//      hideLoadMoreBtn(refs.loadMoreBtn);
      showError(MESSAGES.ERROR_LOADING_PRODUCTS + '<br><br>' + error, true);
    } finally {
      isLoading = false;
      hideLoader(refs.loader);
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
    hideLoadMoreBtn(refs.loadMoreBtn);
    hideNotFound(refs.notFound);
    showLoader(refs.loader);
    try {
//      hideLoadMoreBtn(refs.loadMoreBtn);
      document.querySelector(`.${categoriesBtnClass}.${categoriesBtnIsActiveClass}`)?.classList.remove(categoriesBtnIsActiveClass);
      renderProducts([], null, (page !== 1));
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

//      hideLoadMoreBtn(refs.loadMoreBtn);
      showError(MESSAGES.ERROR_LOADING_PRODUCTS + '<br><br>' + error, true);
    } finally {
      isLoading = false;
      hideLoader(refs.loader);
    }
  }
}

function handleProducts(products, page) {
  const items = products?.products || [];
  const totalItems = products?.total || 0;
  const limit = products?.limit || PRODUCTS_PER_PAGE;
  const totalPages = Math.ceil(totalItems / PRODUCTS_PER_PAGE);

  currentPage = page;
  if ((page === 1) && (items.length === 0)) {
//    hideLoadMoreBtn(refs.loadMoreBtn);
//    clearProducts();
    showNotFound(refs.notFound);
    showInfo(MESSAGES.INFO_NO_PRODUCTS_FOUND);
    return;
  }

  renderProducts(items, null, (page !== 1));

  let newProducts;
  if (page === 1) {
    newProducts = refs.productsList.querySelectorAll('.products__item');
  } else {
    const currentCount = refs.productsList.children.length;
    const allProducts = refs.productsList.querySelectorAll('.products__item');
    newProducts = Array.from(allProducts).slice(currentCount);
  }

  if ((page >= totalPages) || (items.length < PRODUCTS_PER_PAGE)) {
//    hideLoadMoreBtn(refs.loadMoreBtn);

    if (page > 1) {
      showInfo(MESSAGES.INFO_END_OF_PRODUCTS_LIST);
    }
  } else {
    showLoadMoreBtn(refs.loadMoreBtn);
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
/*
export async function getProductsList() {

}

function showLoader() {
  refs.loader?.classList.add(CSS_CLASSES.CLASS_IS_VISIBLE);
  refs.loader?.classList.add(CSS_CLASSES.CLASS_IS_LOADING);
//  refs.loader?.classList.remove(CSS_CLASSES.CLASS_IS_HIDDEN);

//  refs.loadMoreBtn?.classList.add(CSS_CLASSES.CLASS_IS_LOADING);
//  refs.loadMoreBtn?.classList.remove(CSS_CLASSES.CLASS_IS_HIDDEN);
}

function hideLoader() {
  refs.loader?.classList.remove(CSS_CLASSES.CLASS_IS_VISIBLE);
  refs.loader?.classList.remove(CSS_CLASSES.CLASS_IS_LOADING);
//  refs.loader?.classList.add(CSS_CLASSES.CLASS_IS_HIDDEN);

//  refs.loadMoreBtn?.classList.remove(CSS_CLASSES.CLASS_IS_LOADING);
//  refs.loadMoreBtn?.classList.add(CSS_CLASSES.CLASS_IS_HIDDEN);
}

function showLoadMoreBtn() {
  refs.loadMoreBtn?.classList.add(CSS_CLASSES.CLASS_IS_VISIBLE);
//  refs.loadMoreBtn?.classList.add(CSS_CLASSES.CLASS_IS_LOADING);
  refs.loadMoreBtn?.classList.remove(CSS_CLASSES.CLASS_IS_HIDDEN);
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn?.classList.remove(CSS_CLASSES.CLASS_IS_VISIBLE);
//  refs.loadMoreBtn?.classList.remove(CSS_CLASSES.CLASS_IS_LOADING);
  refs.loadMoreBtn?.classList.add(CSS_CLASSES.CLASS_IS_HIDDEN);
}

function showNotFound() {
  refs.notFound?.classList.add(CSS_CLASSES.CLASS_NOT_FOUND_VISIBLE);
}

function hideNotFound() {
  refs.notFound?.classList.remove(CSS_CLASSES.CLASS_NOT_FOUND_VISIBLE);
}
*/