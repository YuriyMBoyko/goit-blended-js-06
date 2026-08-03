import refs from './products-refs.js';

export function renderCategories(categories) {
  refs.categoriesList.innerHTML = createCategoriesMarkup(categories);
}

function createCategoriesMarkup(categories) {
  return !categories ? '' :
    (Array.isArray(categories) ?
      categories.map((category, index) => {
        return `
          <li class="categories__item">
            <button class="categories__btn" type="button" data-category-name="${category}">${category}</button>
          </li>`;
      }).join('') : '').trim();
}

export function clearProducts() {
  refs.productsList.innerHTML = '';
}

export function renderProducts(products, append = false) {
  const markup = (Array.isArray(products) && (products.length === 0)) ? '' : createProductsMarkup(products);
  if (append) {
    if (markup !== '') {
      refs.productsList.insertAdjacentHTML('beforeend', markup);
    }
  } else {
    refs.productsList.innerHTML = markup;
  }
}

function createProductsMarkup(products) {
  return !products ? '' :
    (Array.isArray(products) ? 
      products.map((product, index) => {
        return `
          <li class="products__item" data-id="${product.id}">
            <img class="products__image" src="${product.thumbnail}" alt="${product.description}"/>
            <p class="products__title">${product.title}</p>
            <p class="products__brand"><span class="products__brand--bold">Brand: ${product.brand}</span></p>
            <p class="products__category">Category: ${product.category}</p>
            <p class="products__price">Price: $${product.price}</p>
          </li>`;
      }).join('') : '').trim();
}
