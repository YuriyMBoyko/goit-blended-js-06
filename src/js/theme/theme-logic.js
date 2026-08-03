import refs from './theme-refs.js';
//import theme_init from './theme-init.js?raw';
import { STORAGE_KEYS, THEME_ATTR_NAME, LIGHT_THEME_ATTR_VALUE, DARK_THEME_ATTR_VALUE } from './theme-consts.js';

refs.taggleButton?.addEventListener('click', () => {
  const newTheme = (isCurrentThemeDark() ? String(LIGHT_THEME_ATTR_VALUE) : String(DARK_THEME_ATTR_VALUE));
  console.log(newTheme);
  setTheme(newTheme);
  saveTheme(newTheme);
});

function currentTheme() {
  return (document.documentElement.hasAttribute(THEME_ATTR_NAME) && (document.documentElement.getAttribute(THEME_ATTR_NAME).toLowerCase() === String(DARK_THEME_ATTR_VALUE).toLowerCase())) 
    ? DARK_THEME_ATTR_VALUE
    : ((document.body.hasAttribute(THEME_ATTR_NAME) && (document.body.getAttribute(THEME_ATTR_NAME).toLowerCase() === String(DARK_THEME_ATTR_VALUE).toLowerCase())) ? DARK_THEME_ATTR_VALUE : LIGHT_THEME_ATTR_VALUE);
}

export function isCurrentThemeDark() {
  return isDarkTheme(currentTheme());
}

export function isCurrentThemeLight() {
  return !isCurrentThemeDark();
}

function isDarkTheme(theme) {
  return String(theme).toLowerCase() === String(DARK_THEME_ATTR_VALUE).toLowerCase();
}

function saveTheme(theme) {
  if (isDarkTheme(theme)) {
    localStorage.setItem(Object(STORAGE_KEYS).THEME, String(theme).toLowerCase());
  } else {
    localStorage.removeItem(Object(STORAGE_KEYS).THEME);
  }
}

function setTheme(theme) {
  if (isDarkTheme(theme)) {
    document.documentElement.setAttribute(THEME_ATTR_NAME, DARK_THEME_ATTR_VALUE);
//    document.body.setAttribute(THEME_ATTR_NAME, DARK_THEME_ATTR_VALUE);
  } else {
    document.documentElement.removeAttribute(THEME_ATTR_NAME);
//    document.body.removeAttribute(THEME_ATTR_NAME);
  }
}
