// Función para formatear el valor a DOP
// Funcion para formater un valor a DOP
const formatCurrency = (valor) => {
    const formatter = new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP',
    });
    return formatter.format(valor);
};

// Función para obtener el valor numérico de un input y no sea menor a 0
const getNumericValueFromInput = (inputValue) => {
    const numericValue = Math.max(0, parseFloat(inputValue));
    return isNaN(numericValue) ? 0 : numericValue;
};

export { formatCurrency, getNumericValueFromInput };
