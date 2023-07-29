// Variables globales
let index = 1;
let totalPrice;
let totalItbis;
let totalDiscount;
let totalAmount;

// Selectores
const selectorBtnNewRow = document.querySelector('#btnNewRow');
const elDinamicTableRow = document.querySelector('#DinamicTableRow');
const totalPriceInputId = document.querySelector('#totalPrice');
const totalItbistInputId = document.querySelector('#totalItbis');
const totaldiscountInputId = document.querySelector('#totalDiscount');
const totalAmountInputId = document.querySelector('#totalAmount');

// Obtener todos los elementos con la clase "totalArticle", "price", "itbis" y "discount"
let inputTA = document.querySelectorAll('.totalArticle');
let inputP = document.querySelectorAll('.price');
let inputItbis = document.querySelectorAll('.itbis');
let inputPorcentDiscount = document.querySelectorAll('.porcentDiscount');
let inputDiscount = document.querySelectorAll('.discount');

// Event listener al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    updateTotals();

    // Event listener para los cambios en los input de cantidad
    inputTA.forEach((input) => {
        input.addEventListener('input', updateTotals);
    });
    // Event listener para los cambios en los input de precio
    inputP.forEach((input) => {
        input.addEventListener('input', updateTotals);
    });

    // Event listener para los cambios en los input de itbis
    inputItbis.forEach((input) => {
        input.addEventListener('input', updateTotals);
    });

    // Event listener para los cambios en los input de descuento
    inputDiscount.forEach((input) => {
        input.addEventListener('input', handleDiscountInput);
    });

    // Event listener para el botón "Agregar"
    selectorBtnNewRow.addEventListener('click', (e) => {
        e.preventDefault();
        createDinamicTableRow();
        // Actualizar los elementos con las clases "totalArticle", "price", "itbis" y "discount"
        inputTA = document.querySelectorAll('.totalArticle');
        inputP = document.querySelectorAll('.price');
        inputDiscount = document.querySelectorAll('.discount');
        // Añadir eventos para los nuevos elementos agregados
        inputTA.forEach((input) => {
            input.addEventListener('input', updateTotals);
        });
        inputP.forEach((input) => {
            input.addEventListener('input', updateTotals);
        });
        inputItbis.forEach((input) => {
            input.addEventListener('input', updateTotals);
        });
        inputDiscount.forEach((input) => {
            input.addEventListener('input', handleDiscountInput);
        });
    });

    // Event listener para el botón "Eliminar fila"
    elDinamicTableRow.addEventListener('click', (e) => {
        if (e.target.classList.contains('btnRemoveRow')) {
            const row = e.target.closest('tr');
            const rowIndex = parseInt(row.querySelector('th').textContent);
            removeDinamicTableRow(row, rowIndex);
        }
    });
});

// Función para formatear el valor a DOP
const formatCurrency = (valor) => {
    const formatter = new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP',
    });
    return formatter.format(valor);
};

// Función para limitar los caracteres y validar el descuento
function handleDiscountInput(e) {
    // Obtener el valor ingresado
    let value = e.target.value;

    // Limitar el valor entre 0 y 100
    value = Math.min(100, Math.max(0, value));

    // Actualizar el valor del input con el valor validado
    e.target.value = value;
    // Volver a calcular el precio total con el nuevo descuento
    updateTotals();
}

// Función para obtener el valor numérico del input
function getNumericValueFromInput(input) {
    const value = parseFloat(input.value) || 0;
    if (isNaN(value) || value < 0) {
        input.value = 0;
        return 0;
    }
    return value;
}

// Función para calcular el subtotal del artículo
function calculateSubtotal(inputTA, inputPrice) {
    const valueTA = getNumericValueFromInput(inputTA);
    const valuePrice = getNumericValueFromInput(inputPrice);
    return valueTA * valuePrice;
}

// Función para calcular el ITBIS del artículo
function calculateItbis(subtotal) {
    return subtotal * 0.18;
}

// Función para obtener el descuento numérico
function getDiscountNumeric(input) {
    const discountValue = input.value.trim() === '' ? '0%' : input.value;
    const discountNumeric = parseFloat(discountValue.replace(/[^0-9.]/g, '')) || 0;
    return Math.min(100, Math.max(0, discountNumeric));
}

// Función para calcular el descuento del artículo
function calculateDiscount(subtotal, itbis, inputDiscount) {
    const discountDecimal = getDiscountNumeric(inputDiscount) / 100;
    return (subtotal + itbis) * discountDecimal;
}

// Función para actualizar los totales
function updateTotals() {
    // Actualizar los selectores con los elementos más recientes
    inputTA = document.querySelectorAll('.totalArticle');
    inputP = document.querySelectorAll('.price');
    inputItbis = document.querySelectorAll('.itbis');
    inputDiscount = document.querySelectorAll('.discount');

    // Reiniciar los totales a cero
    totalPrice = 0;
    totalItbis = 0;
    totalDiscount = 0;
    totalAmount = 0;

    // Iterar sobre los campos de entrada de cantidad y precio
    inputTA.forEach((input) => {
        // Obtener el valor de la cantidad y asegurarse de que sea un número válido (positivo o cero)
        const valueTA = getNumericValueFromInput(input);
        // Obtener el precio del artículo
        const priceInput = input.closest('tr').querySelector('.price');
        const valuePrice = getNumericValueFromInput(priceInput);

        // Calcular el subtotal del artículo
        const totalPriceInput = valueTA * valuePrice;
        // Sumar al monto total acumulativo
        totalPrice += totalPriceInput;

        // Obtener la referencia al campo de entrada del ITBIS correspondiente
        const itbisInput = input.closest('tr').querySelector('.itbis');
        // Calcular el ITBIS del artículo
        const totalItbisInput = totalPriceInput * 0.18;
        // Sumar al ITBIS total acumulativo
        totalItbis += totalItbisInput;
        // Actualizar el valor del campo de entrada del ITBIS con el valor calculado
        itbisInput.value = totalItbisInput.toFixed(2);

        // Obtener el descuento ingresado
        const discountInput = input.closest('tr').querySelector('.discount');
        // Obtener el valor numérico del descuento
        const discountNumeric = getNumericValueFromInput(discountInput);
        // Limitar el descuento entre 0 y 100
        const validatedDiscount = Math.min(100, Math.max(0, discountNumeric));
        // Convertir el descuento validado en decimal (ejemplo: 10% -> 0.1)
        const discountDecimal = validatedDiscount / 100;

        // Calcular el descuento del artículo
        const totalDiscountInput = (totalPriceInput + totalItbisInput) * discountDecimal;
        // Sumar al descuento total acumulativo
        totalDiscount += totalDiscountInput;
    });

    // Sumar al monto total acumulativo
    totalAmount = totalPrice + totalItbis - totalDiscount;

    // Actualizar el valor del campo de entrada del monto total con el valor acumulativo
    totalPriceInputId.textContent = formatCurrency(totalPrice);
    // Actualizar el valor del campo de entrada del ITBIS total con el valor acumulativo
    totalItbistInputId.textContent = formatCurrency(totalItbis);
    // Actualizar el valor del campo de entrada del descuento total con el valor acumulativo
    totaldiscountInputId.textContent = formatCurrency(totalDiscount);
    // Actualizar el valor del campo de entrada del monto total con el valor acumulativo
    totalAmountInputId.textContent = formatCurrency(totalAmount);
}

// Función para eliminar filas dinámicamente
function removeDinamicTableRow(row) {
    row.remove();
    updateRowIndices();
    updateTotals(); // Actualizar los totales al eliminar una fila
}

// Función para actualizar los índices de las filas
function updateRowIndices() {
    const rows = elDinamicTableRow.querySelectorAll('tr');
    rows.forEach((row, i) => {
        const rowIndex = row.querySelector('th');
        rowIndex.textContent = i + 1;
    });
}

// Función para agregar filas dinámicamente
function createDinamicTableRow() {
    // Crear elementos
    const tr = document.createElement('tr');
    tr.classList.add('align-middle');
    const th = document.createElement('th');
    tr.appendChild(th);

    const select = document.createElement('select');
    select.classList.add('form-select', 'typeArticle');
    select.name = 'typeArticle[]';
    select.required = true;

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona uno';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    const options = [
        'Comida',
        'Bebida',
        'Decoracion',
        'Sonido',
        'Pantalla',
        'Luces',
        'Personal',
        'Servicios',
        'Centros de Mesa',
        'Vestimenta',
        'Invitaciones',
    ];

    options.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });

    const tdSelect = document.createElement('td');
    tdSelect.appendChild(select);
    tr.appendChild(tdSelect);

    const tdInputNA = document.createElement('td');
    const inputNA = document.createElement('input');
    inputNA.classList.add('form-control', 'nameArticle');
    inputNA.type = 'text';
    inputNA.name = 'nameArticle[]';
    inputNA.placeholder = 'Bocinas';
    inputNA.required = true;
    tdInputNA.appendChild(inputNA);

    const tdInputTA = document.createElement('td');
    const inputTA = document.createElement('input');
    inputTA.classList.add('form-control', 'text-end', 'totalArticle');
    inputTA.type = 'number';
    inputTA.name = 'totalArticle[]';
    inputTA.placeholder = 0;
    inputTA.required = true;
    tdInputTA.appendChild(inputTA);

    const tdInputPrice = document.createElement('td');
    const inputPrice = document.createElement('input');
    inputPrice.classList.add('form-control', 'text-end', 'price');
    inputPrice.type = 'number';
    inputPrice.name = 'price[]';
    inputPrice.placeholder = '0.00';
    inputPrice.required = true;
    tdInputPrice.appendChild(inputPrice);

    const tdInputItbis = document.createElement('td');
    const inputItbis = document.createElement('input');
    inputItbis.classList.add('form-control', 'text-end', 'itbis');
    inputItbis.type = 'number';
    inputItbis.name = 'itbis[]';
    inputItbis.placeholder = '0.00';
    inputItbis.readOnly = true;
    tdInputItbis.appendChild(inputItbis);

    const tdInputPorcentDiscount = document.createElement('td');
    const inputPorcentDiscount = document.createElement('input');
    inputPorcentDiscount.classList.add('form-control', 'text-end', 'porcentDiscount');
    inputPorcentDiscount.type = 'number';
    inputPorcentDiscount.name = 'porcentDiscount[]';
    inputPorcentDiscount.placeholder = '0%';
    inputPorcentDiscount.required = true;
    inputPorcentDiscount.step = '0.1';
    tdInputPorcentDiscount.appendChild(inputPorcentDiscount);

    const tdInputDiscount = document.createElement('td');
    const inputDiscount = document.createElement('input');
    inputDiscount.classList.add('form-control', 'text-end', 'discount');
    inputDiscount.type = 'number';
    inputDiscount.name = 'discount[]';
    inputDiscount.placeholder = '0.00';
    inputDiscount.required = true;
    inputDiscount.readOnly = true;
    tdInputDiscount.appendChild(inputDiscount);

    // Crear botón de eliminar fila
    const tdRemoveBtn = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('btnRemoveRow');
    removeBtn.textContent = 'Eliminar';
    tdRemoveBtn.appendChild(removeBtn);

    // Agregar elementos a la fila
    tr.appendChild(tdInputNA);
    tr.appendChild(tdInputTA);
    tr.appendChild(tdInputPrice);
    tr.appendChild(tdInputItbis);
    tr.appendChild(tdInputPorcentDiscount);
    tr.appendChild(tdInputDiscount);
    tr.appendChild(tdRemoveBtn);

    // Agregar fila al elemento contenedor
    elDinamicTableRow.appendChild(tr);
    index++;
    updateRowIndices();
}
