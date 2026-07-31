import refs from './products-refs.js';
import { fetchCategories, fetchProducts, productsPerPage } from './products-api.js';
import { createCategoriesMarkup, createProductsMarkup } from './products-render.js';
import { showError, showInfo, sleep/*, showScrollTopBtn, hideScrollTopBtn*/ } from '../helpers.js';
import { errorLoadingCategories, errorLoadingProducts, errorChangingCategory, infoNoProductsFound, infoEndOfProductsList, infoNoProductInfo } from '../string-consts.js';
import { openProductModal } from '../modal.js';

let currentCategory = '';
let currentPage = 1;
let isLoading = false;

document.addEventListener('DOMContentLoaded', initCategories);
refs.categoriesList.addEventListener('click', handleCategoryClick);
refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);

let lastCategoryName;

function initProductModal() {
  if (!refs.productsList) return;

  refs.productsList.addEventListener('click', event => {
    const clicked = event.target.closest('.products__item');
    if (clicked) {
      const productId = clicked.dataset.id;
      if (!productId) {
        showInfo(infoNoProductInfo);
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
    const productCategories = await fetchCategories();
    refs.categoriesList.innerHTML = createCategoriesMarkup(productCategories);

    const firstBtn = refs.categoriesList.querySelector(`.${categoriesBtnClass}`);
    if (firstBtn) firstBtn.classList.add(categoriesBtnIsActiveClass);

    await renderProducts(firstBtn?.dataset.categoryName || '', 1);

    initProductModal();
  } catch (error) {
    console.log(error);
    
    showError(errorLoadingCategories + '<br><br>' + error);
  } finally {
    hideLoader();
//    hideLoadMoreBtn();
  }
}

async function handleCategoryClick(event) {
  const clickedBtn = event.target;  
  if ((!clickedBtn) || (!clickedBtn.classList.contains(`${categoriesBtnClass}`)) || clickedBtn.classList.contains(categoriesBtnIsActiveClass)) return;

  document.querySelector(`.${categoriesBtnClass}.${categoriesBtnIsActiveClass}`)?.classList.remove(categoriesBtnIsActiveClass);

  clickedBtn.classList.add(categoriesBtnIsActiveClass);
  setTimeout(() => {
    lastCategoryName = clickedBtn.dataset.categoryName;
    console.log(`${lastCategoryName}: selected`);
    renderProducts(lastCategoryName || '');
  }, 10);
}

async function renderProducts(category = '', page = 1) {
  if (isLoading) {
    if (lastCategoryName.toUpperCase() !== category.toUpperCase()) return;
    
    setTimeout(() => {renderProducts(category)}, 100);
  } else {
    console.log(`${category}: renderProducts executing`);

    isLoading = true;
    showLoader();
    try {
//      hideLoadMoreBtn();
      hideNotFound();
      if (page === 1) {
        refs.productsList.innerHTML = '';
      }
      await sleep(1000);

      currentCategory = (category.toUpperCase() === 'beauty'.toUpperCase()) ? category + 123 : category;
//      currentCategory = category;
      currentPage = page;

      const products = await fetchProducts(currentCategory, currentPage);

      const items = products?.products || [];
      const totalItems = products?.total || 0;
      const limit = products?.limit || productsPerPage;
      const totalPages = Math.ceil(totalItems / productsPerPage);

      if ((page === 1) && (items.length === 0)) {
        refs.productsList.innerHTML = '';
        hideLoadMoreBtn();
        showNotFound();
        showInfo(infoNoProductsFound);
        return;
      }

      let newProducts;

      if (page === 1) {
        refs.productsList.innerHTML = createProductsMarkup(items);
        newProducts = refs.productsList.querySelector('.products__item');
      } else {
        const currentCount = refs.productsList.children.length;
        refs.productsList.insertAdjacentHTML('beforeend', createProductsMarkup(items));
        const allProducts = refs.productsList.querySelectorAll('.products__item');
        newProducts = Array.from(allProducts).slice(currentCount);
      }

      if ((page >= totalPages) || (items.length < productsPerPage)) {
        hideLoadMoreBtn();

        if (page > 1) {
          showInfo(infoEndOfProductsList);
        }
      } else {
        showLoadMoreBtn();
      }

    } catch (error) {
      console.error(error);

      if (currentPage === 1) {
        refs.productsList.innerHTML = '';
      }

      hideLoadMoreBtn();
      showError(errorLoadingProducts + '<br><br>' + error, true);
    } finally {
      isLoading = false;
      hideLoader();
      console.log(`${category}: renderProducts finished`);
    }
  }
}

async function handleLoadMoreBtnClick(event) {
  currentPage += 1;
  try {
    await renderProducts(currentCategory, currentPage);
  } catch {
    showError(errorLoadingProducts);
  }
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
