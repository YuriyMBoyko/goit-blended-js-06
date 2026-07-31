import refs from './theme-refs.js';

const themeAttrName = 'data-theme';
const lightThemeAttrValue = 'light';
const darkThemeAttrValue = 'dark';

function currentTheme() {
  return document.body.getAttribute(themeAttrName);
}

export function isLightTheme() {
  return currentTheme() === lightThemeAttrValue;
}

export function isDarkTheme() {
  return currentTheme() === darkThemeAttrValue;
}

refs.taggleButton?.addEventListener('click', () => {
  const newTheme = (isDarkTheme() ? lightThemeAttrValue : darkThemeAttrValue);
  document.body.setAttribute(themeAttrName, newTheme);
});
