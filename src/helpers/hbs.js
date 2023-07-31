// Importa Handlebars para poder definir el helper
import Handlebars from 'handlebars';

// Define la función sum
function sum(a, b) {
    return Number(a) + Number(b);
}

// Registra el helper sum
Handlebars.registerHelper('sum', sum);

// Define el helper formatCurrency
const formatCurrency = (valor) => {
    const formatter = new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP',
    });
    return formatter.format(valor);
};

// Registra el helper formatCurrency
Handlebars.registerHelper('formatCurrency', formatCurrency);

export { formatCurrency, sum };
