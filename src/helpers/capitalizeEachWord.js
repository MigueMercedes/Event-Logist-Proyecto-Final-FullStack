// Convierte cada palabra de un string a mayuscula
const capitalizeEachWord = (str) => str.trim().replace(/(^|\s)\S/g, (match) => match.toUpperCase());

export default capitalizeEachWord;
