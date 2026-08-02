import refs from './products-refs.js';
//import { itemCategoryHtmlTemplate, itemProductHtmlTemplate } from './products-consts.js';

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

export function createProductModalMarkup(product) {
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
      </div>
`;
}