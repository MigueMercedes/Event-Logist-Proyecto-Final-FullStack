// Variables globales
let index = 2;

// Selectores
const selectorBtnNewRow = document.querySelector('#btnNewRow');
const elDinamicTableRow = document.querySelector('#DinamicTableRow');
const totalPriceInputId = document.querySelector('#totalPrice');
const ItbistInputId = document.querySelector('#totalItbis');
let inputTA = document.querySelectorAll('.totalArticle');
let inputP = document.querySelectorAll('.price');
let inputItbis = document.querySelectorAll('.itbis');
let totalPrice = 0;
let totalItbis = 0;

// Event listener al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    sumTotal();

    // Event listener para los cambios en los input de cantidad
    inputTA.forEach((input) => {
        input.addEventListener('input', sumTotal);
    });

    // Event listener para los cambios en los input de precio
    inputP.forEach((input) => {
        input.addEventListener('input', sumTotal);
    });
    inputItbis.forEach((input) => {
        input.addEventListener('input', sumTotal);
    });

    // Event listener para el botón "Agregar"
    selectorBtnNewRow.addEventListener('click', (e) => {
        e.preventDefault();
        createDinamicTableRow();
        inputTA = document.querySelectorAll('.totalArticle');
        inputP = document.querySelectorAll('.price');
        inputTA.forEach((input) => {
            input.addEventListener('input', sumTotal);
        });
        inputP.forEach((input) => {
            input.addEventListener('input', sumTotal);
        });
        inputItbis.forEach((input) => {
            input.addEventListener('input', sumTotal);
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

// Función para calcular el monto total y el ITBIS total
function sumTotal() {
    // Reiniciar los totales a cero
    totalPrice = 0;
    totalItbis = 0;

    // Iterar sobre los campos de entrada de cantidad
    inputTA.forEach((input) => {
        // Obtener el valor de la cantidad
        const valueTA = parseFloat(input.value);
        // Obtener el precio del artículo relacionado
        const priceInput = input.closest('tr').querySelector('.price').value;
        // Calcular el subtotal del artículo
        const totalPriceInput = valueTA * parseFloat(priceInput);
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
    });

    // Actualizar el valor del campo de entrada del monto total con el valor acumulativo
    totalPriceInputId.value = totalPrice.toFixed(2);
    // Actualizar el valor del campo de entrada del ITBIS total con el valor acumulativo
    ItbistInputId.value = totalItbis.toFixed(2);
}

// Función para eliminar filas dinámicamente
function removeDinamicTableRow(row) {
    row.remove();
    updateRowIndices();
    sumTotal();
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
    const th = document.createElement('th');
    th.textContent = index;
    th.id = `row-${index}`;
    tr.appendChild(th);

    const select = document.createElement('select');
    select.classList.add('form-select');
    select.name = 'typeArticle[]';

    const options = [
        { value: 'Indefinido', text: 'Selecciona un tipo' },
        { value: 'Decoracion', text: 'Decoracion' },
        { value: 'Comida', text: 'Comida' },
        { value: 'Equipo', text: 'Equipo' },
        { value: 'Personal', text: 'Personal' },
        { value: 'Otro', text: 'Otro' }
    ];

    options.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        select.appendChild(optionElement);
    });

    const tdSelect = document.createElement('td');
    tdSelect.appendChild(select);
    tr.appendChild(tdSelect);

    const tdInputNA = document.createElement('td');
    const inputNA = document.createElement('input');
    inputNA.classList.add('form-control');
    inputNA.type = 'text';
    inputNA.name = 'nameArticle[]';
    inputNA.placeholder = 'Bocinas';
    tdInputNA.appendChild(inputNA);

    const tdInputTA = document.createElement('td');
    const inputTA = document.createElement('input');
    inputTA.classList.add('form-control', 'totalArticle');
    inputTA.type = 'number';
    inputTA.name = 'totalArticle[]';
    inputTA.value = 0;
    inputTA.placeholder = 0;
    tdInputTA.appendChild(inputTA);

    const tdInputPrice = document.createElement('td');
    const inputPrice = document.createElement('input');
    inputPrice.classList.add('form-control', 'price');
    inputPrice.type = 'number';
    inputPrice.name = 'price[]';
    inputPrice.value = '0.00';
    inputPrice.placeholder = '0.00';
    tdInputPrice.appendChild(inputPrice);

    const tdInputItbis = document.createElement('td');
    const inputItbis = document.createElement('input');
    inputItbis.classList.add('form-control', 'itbis');
    inputItbis.type = 'number';
    inputItbis.name = 'itbis[]';
    inputItbis.value = '0.00';
    inputItbis.placeholder = '0.00';
    inputItbis.readOnly = true;
    tdInputItbis.appendChild(inputItbis);

    // Crear botón de eliminar fila
    const tdRemoveBtn = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'btnRemoveRow');
    removeBtn.textContent = 'Eliminar';
    tdRemoveBtn.appendChild(removeBtn);

    // Agregar elementos a la fila
    tr.appendChild(tdInputNA);
    tr.appendChild(tdInputTA);
    tr.appendChild(tdInputPrice);
    tr.appendChild(tdInputItbis);
    tr.appendChild(tdRemoveBtn);

    // Agregar fila al elemento contenedor
    elDinamicTableRow.appendChild(tr);
    index++;
    updateRowIndices();
}
