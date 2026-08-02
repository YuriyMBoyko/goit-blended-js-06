import refs from './refs.js';
import { getProductsByQuery } from './products/products-logic.js';
import { showInfo, showError } from './helpers.js';
import { errorFillSearchValue } from './string-consts.js';

refs.searchForm?.addEventListener('submit', searchFormOnSubmit);
refs.clearSearchBtn?.addEventListener('click', clearSearchBtnOnClick);

function searchFormOnSubmit(event) {
  event.preventDefault();

  const query = event.currentTarget.elements.searchValue.value.trim();

  if (!query) {
    showError(errorFillSearchValue);
    return;
  }

  getProductsByQuery(query);
}

function clearSearchBtnOnClick(event) {
  if (refs.searchForm) {
    refs.searchForm.elements.searchValue.value = '';
  }
  getProductsByQuery();
}
