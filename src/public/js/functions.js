// Función para formatear el valor a DOP
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

const formatPhoneNumber = (e) => {
    // Remover cualquier formato existente y mantener solo los dígitos
    const phoneNumber = e.target.value.replace(/\D/g, '');

    // Aplicar el formato (123) 456-7890
    const formattedPhoneNumber = phoneNumber.replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3');

    // Actualizar el valor del input con el número formateado
    e.target.value = formattedPhoneNumber;
};

const validatedDate = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
        e.target.value = currentDate.toISOString().split('T')[0];
    }
};

const validatedTrimString = (e) => {
    const input = e.target;
    const trimmedValue = e.target.value.trim();

    if (trimmedValue === '') {
        input.value = '';
    }
};

export {
    formatCurrency,
    getNumericValueFromInput,
    formatPhoneNumber,
    validatedDate,
    validatedTrimString,
};
