// Convert a string into a URL friendly slug
// src: https://stackoverflow.com/a/54837767/6775987
export default function slugify(str: string) {
  if (str) {
    return str
      .toString()
      .normalize('NFD') //break accented characters into basic letter and diacritic(s)
      .replace(/[\u0300-\u036f]/g, '') //remove diacritics
      .toLowerCase()
      .replace(/\s+/g, '-') //spaces to dashes
      .replace(/[^\w\-]+/g, '') //remove non-words
      .replace(/\-\-+/g, '-') //collapse multiple dashes
      .replace(/^-+/, ''); //trim starting dash
  }
  return '';
}
