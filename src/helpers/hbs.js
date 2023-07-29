// Importa Handlebars para poder definir el helper
import Handlebars from 'handlebars';
import formatCurrency from '../helpers/formatCurrency.js';

// Define la función sum
function sum(a, b) {
    return Number(a) + Number(b);
}

// Registra el helper sum
Handlebars.registerHelper('sum', sum);

// Registra el helper formatCurrency
Handlebars.registerHelper('formatCurrency', formatCurrency);
