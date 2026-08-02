import axios from 'axios';
import { allCategoryName } from './products-consts.js';

const baseUrl = 'https://dummyjson.com';
const productsPath = '/products';
const categoriesListPath = '/category-list';
const categoryPath = '/category';
const searchPath = '/search';

export const productsPerPage = 12;

function prepareUrl(baseUrl, arrayPath) {
  return (baseUrl?? '') + (!arrayPath ? '' : (Array.isArray(arrayPath) ? arrayPath.join('') : arrayPath));
}

export async function fetchCategories() {
  const url = prepareUrl(baseUrl, [productsPath, categoriesListPath]);
  const response = await axios.get(url);
  return response.data;
/*
  return (Array.isArray(response.data)) ?
    (((!response.data.find((element) => element.toUpperCase() === allCategoryName.toUpperCase())) ? [allCategoryName] : []).concat(response.data)) : [];
*/
}

export async function fetchProductsByCategory(category = '', page = 1) {
  const categoryName = (category.trim().toLowerCase() === allCategoryName.toLowerCase()) ? '' : category.trim();
  const params = { limit: productsPerPage, skip: (page - 1) * productsPerPage };
  let url = prepareUrl(baseUrl, [productsPath]);
  if (categoryName !== '') url += categoryPath + '/' + categoryName;

  const response = await axios.get(url, { params });
  return response.data;
}

export async function fetchProductsByQuery(query = '', page = 1) {
  const params = { q: query, limit: productsPerPage, skip: (page - 1) * productsPerPage };
  let url = prepareUrl(baseUrl, [productsPath, searchPath]);

  console.log(query);
  const response = await axios.get(url, { params });
  console.log(response.data);
  return response.data;
}

export async function fetchProductById(id) {
  const url = prepareUrl(baseUrl, [productsPath, `/${id.trim()}`]);
  const response = await axios.get(url);
  return response.data;
}
