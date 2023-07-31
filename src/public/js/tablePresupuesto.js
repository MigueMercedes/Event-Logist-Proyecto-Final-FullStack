import { formatCurrency, getNumericValueFromInput } from './functions.js';

// Variables globales
let subTotal;
let totalItbis;
let totalDiscount;
let totalAmount;

// Selectores
const elDinamicTableRow = document.querySelector('#DinamicTableRow');
const selectorBtnNewRow = document.querySelector('#btnNewRow');

// Obtener todos inputs de las tablas
let inputTotalArticle = document.querySelectorAll('.totalArticle');
let inputPrice = document.querySelectorAll('.price');
let inputItbis = document.querySelectorAll('.itbis');
let inputPorcentDiscount = document.querySelectorAll('.porcentDiscount');
let inputTotalPrice = document.querySelectorAll('.totalPrice');

// Event listener al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    const totalAmountInputId = document.querySelector('#totalAmount');
    if (totalAmountInputId) {
        updateTotals();
    }

    // Event listener para los cambios en los input de cantidad
    inputTotalArticle.forEach((input) => {
        input.addEventListener('input', updateTotals);
    });

    // Event listener para los cambios en los input de precio
    inputPrice.forEach((input) => {
        input.addEventListener('input', updateTotals);
    });

    // Event listener para los cambios en los input de itbis
    inputItbis.forEach((input) => {
        input.addEventListener('input', updateTotals);
    });

    // Event listener para los cambios en los input de descuento
    inputPorcentDiscount.forEach((input) => {
        input.addEventListener('input', updateTotals);
    });

    // Event listener para los cambios en los input de descuento
    inputTotalPrice.forEach((input) => {
        input.addEventListener('input', updateTotals);
    });

    // Event listener para el botón "Agregar fila"
    if (selectorBtnNewRow) {
        selectorBtnNewRow.addEventListener('click', () => {
            createDinamicTableRow();

            // Actualizar todos los inputs de las tablas

            inputTotalArticle = document.querySelectorAll('.totalArticle');
            inputPrice = document.querySelectorAll('.price');
            inputItbis = document.querySelectorAll('.itbis');
            inputPorcentDiscount = document.querySelectorAll('.porcentDiscount');
            inputTotalPrice = document.querySelectorAll('.totalPrice');

            // Añadir eventos para los nuevos elementos agregados
            inputTotalArticle.forEach((input) => {
                input.addEventListener('input', updateTotals);
            });

            inputPrice.forEach((input) => {
                input.addEventListener('input', updateTotals);
            });

            inputItbis.forEach((input) => {
                input.addEventListener('input', updateTotals);
            });

            inputPorcentDiscount.forEach((input) => {
                input.addEventListener('input', updateTotals);
            });

            inputTotalPrice.forEach((input) => {
                input.addEventListener('input', updateTotals);
            });
        });
    }

    // EventListener para el botón "Eliminar fila"
    if (elDinamicTableRow) {
        elDinamicTableRow.addEventListener('click', (e) => {
            if (e.target.classList.contains('btnRemoveRow')) {
                const row = e.target.closest('tr');
                const rowIndex = parseInt(row.querySelector('th').textContent);
                removeDinamicTableRow(row, rowIndex);
            }
        });
    }
});

// Función para actualizar los totales
function updateTotals() {
    //selectores span para mostrar los valores finales
    const subTotalInputId = document.querySelector('#subTotal');
    const totalItbistInputId = document.querySelector('#totalItbis');
    const totaldiscountInputId = document.querySelector('#totalDiscount');
    const totalAmountInputId = document.querySelector('#totalAmount');

    // Reiniciar los totales a cero
    subTotal = 0;
    totalItbis = 0;
    totalDiscount = 0;
    totalAmount = 0;

    // Actualizar los selectores con los elementos más recientes
    inputTotalArticle = document.querySelectorAll('.totalArticle');
    inputPrice = document.querySelectorAll('.price');
    inputItbis = document.querySelectorAll('.itbis');
    inputPorcentDiscount = document.querySelectorAll('.porcentDiscount');
    inputTotalPrice = document.querySelectorAll('.totalPrice');

    // Iterar sobre los inputs de totalArticle y hacer cálculos a partir de ahí
    inputTotalArticle.forEach((input, index) => {
        // La funcion getNumericValueFromInput se asegura que el valor sea un número válido (positivo o cero)

        // Obtener el valor de la cantidad
        const valueTotalArticle = getNumericValueFromInput(input.value);
        input.value = valueTotalArticle;

        // Obtener el precio del artículo
        const priceInput = inputPrice[index];
        const valuePrice = getNumericValueFromInput(priceInput.value);
        inputPrice[index].value = valuePrice;

        // Calcular el subtotal del artículo
        const subTotalInput = valueTotalArticle * valuePrice;

        // Sumar al subtotal acumulativo
        subTotal += subTotalInput;

        // Obtener el ITBIS del artículo
        const totalItbisInput = subTotalInput * 0.18;
        inputItbis[index].value = totalItbisInput.toFixed(2);

        // Sumar al itbis total acumulativo
        totalItbis += totalItbisInput;

        // Obtener el descuento ingresado definir valor maximo como 100
        const discountInput = inputPorcentDiscount[index].value;
        const valueDiscount = getNumericValueFromInput(discountInput);
        const verifiedDiscount = Math.min(100, parseFloat(valueDiscount));
        inputPorcentDiscount[index].value = verifiedDiscount;

        // Convertir el descuento validado en decimal (ejemplo: 10% -> 0.1)
        const discountDecimal = verifiedDiscount / 100;
        // Calcular el descuento del artículo
        const totalDiscountInput = (subTotalInput + totalItbisInput) * discountDecimal;

        // Sumar al descuento total acumulativo
        totalDiscount += totalDiscountInput;

        //Actualizar el precio total del articulo
        const totalPrice = subTotalInput + totalItbisInput - totalDiscountInput;
        inputTotalPrice[index].value = totalPrice.toFixed(2);
    });

    // Calcular el monto total incluyendo el descuento
    totalAmount = subTotal + totalItbis - totalDiscount;

    // Actualizar los campos de entrada con los valores acumulados
    subTotalInputId.textContent = formatCurrency(subTotal);
    totalItbistInputId.textContent = formatCurrency(totalItbis);
    totaldiscountInputId.textContent = formatCurrency(totalDiscount);
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

    const select = document.createElement('select');
    select.classList.add('form-select', 'typeArticle');
    select.name = 'typeArticle[]';
    select.required = true;

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

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona uno';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    options.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });

    const tdSelect = document.createElement('td');
    tdSelect.appendChild(select);

    const tdinputNameArticle = document.createElement('td');
    const inputNameArticle = document.createElement('input');
    inputNameArticle.classList.add('form-control', 'nameArticle');
    inputNameArticle.type = 'text';
    inputNameArticle.name = 'nameArticle[]';
    inputNameArticle.placeholder = 'Bocinas';
    inputNameArticle.required = true;
    tdinputNameArticle.appendChild(inputNameArticle);

    const tdinputTotalArticle = document.createElement('td');
    const inputTotalArticle = document.createElement('input');
    inputTotalArticle.classList.add('form-control', 'text-end', 'totalArticle');
    inputTotalArticle.type = 'number';
    inputTotalArticle.name = 'totalArticle[]';
    inputTotalArticle.step = '1';
    inputTotalArticle.placeholder = 0;
    inputTotalArticle.required = true;
    tdinputTotalArticle.appendChild(inputTotalArticle);

    const tdinputPricePrice = document.createElement('td');
    const inputPricePrice = document.createElement('input');
    inputPricePrice.classList.add('form-control', 'text-end', 'price');
    inputPricePrice.type = 'number';
    inputPricePrice.name = 'price[]';
    inputPricePrice.step = '0.1';
    inputPricePrice.placeholder = '0.00';
    inputPricePrice.required = true;
    tdinputPricePrice.appendChild(inputPricePrice);

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
    inputPorcentDiscount.step = '0.1';
    inputPorcentDiscount.placeholder = '0%';
    inputPorcentDiscount.required = true;
    tdInputPorcentDiscount.appendChild(inputPorcentDiscount);

    const tdInputTotalPrice = document.createElement('td');
    const inputTotalPrice = document.createElement('input');
    inputTotalPrice.classList.add('form-control', 'text-end', 'totalPrice');
    inputTotalPrice.type = 'number';
    inputTotalPrice.name = 'totalPrice[]';
    inputTotalPrice.placeholder = '0.00';
    inputTotalPrice.required = true;
    inputTotalPrice.readOnly = true;
    tdInputTotalPrice.appendChild(inputTotalPrice);

    // Crear botón de eliminar fila
    const tdRemoveBtn = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('btnRemoveRow');
    removeBtn.textContent = 'X';
    tdRemoveBtn.appendChild(removeBtn);

    // Agregar elementos a la fila
    tr.appendChild(th);
    tr.appendChild(tdSelect);
    tr.appendChild(tdinputNameArticle);
    tr.appendChild(tdinputTotalArticle);
    tr.appendChild(tdinputPricePrice);
    tr.appendChild(tdInputItbis);
    tr.appendChild(tdInputPorcentDiscount);
    tr.appendChild(tdInputTotalPrice);
    tr.appendChild(tdRemoveBtn);

    // Agregar fila al elemento contenedor
    elDinamicTableRow.appendChild(tr);

    // Actualizar indices
    updateRowIndices();
}
