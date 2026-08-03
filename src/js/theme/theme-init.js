const STORAGE_KEYS = {
  THEME: 'blended-js6-theme',
}

const THEME_ATTR_NAME = 'data-theme';
const LIGHT_THEME_ATTR_VALUE = 'light';
const DARK_THEME_ATTR_VALUE = 'dark';

function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (userPrefersDark ? DARK_THEME_ATTR_VALUE : LIGHT_THEME_ATTR_VALUE);
  document.documentElement.setAttribute(THEME_ATTR_NAME, initialTheme);
}

initTheme();
