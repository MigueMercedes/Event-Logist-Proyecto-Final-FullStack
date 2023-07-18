// Variables globales
let index = 2;

// Selectores
const selectorBtnNewRow = document.querySelector('#btnNewRow');
const elDinamicTableRow = document.querySelector('#DinamicTableRow');
const amountInput = document.querySelector('#amount');
let inputTA = document.querySelectorAll('.totalArticle');
let inputP = document.querySelectorAll('.price');
let totalPrice = 0;

// Event listener al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    currentYear();

    // Función para sumar el total del presupuesto
    function sumTotal() {
        totalPrice = 0;
        inputTA.forEach(input => {
            const valueTA = parseFloat(input.value);
            const priceInput = input.closest('tr').querySelector('.price').value;
            const totalPriceInput = valueTA * parseFloat(priceInput);
            totalPrice += totalPriceInput;
        });
        amountInput.value = totalPrice.toFixed(2);
    }

    // Event listener para los cambios en los input de cantidad
    inputTA.forEach(input => {
        input.addEventListener('input', sumTotal);
    });

    // Event listener para los cambios en los input de precio
    inputP.forEach(input => {
        input.addEventListener('input', sumTotal);
    });

    // Event listener para el botón "Agregar"
    selectorBtnNewRow.addEventListener('click', e => {
        e.preventDefault();
        createDinamicTableRow();
        inputTA = document.querySelectorAll('.totalArticle');
        inputP = document.querySelectorAll('.price');
        inputTA.forEach(input => {
            input.addEventListener('input', sumTotal);
        });
        inputP.forEach(input => {
            input.addEventListener('input', sumTotal);
        });
    });
});

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

    options.forEach(option => {
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
    inputPrice.value = 0;
    inputPrice.placeholder = 0;
    tdInputPrice.appendChild(inputPrice);

    const tdInputItbis = document.createElement('td');
    const inputItbis = document.createElement('input');
    inputItbis.classList.add('form-control', 'itbis');
    inputItbis.type = 'number';
    inputItbis.name = 'itbis[]';
    inputItbis.value = 0;
    inputItbis.placeholder = 0;
    inputItbis.readOnly = true;
    tdInputItbis.appendChild(inputItbis);

    // Agregar elementos a la fila
    tr.appendChild(tdInputNA);
    tr.appendChild(tdInputTA);
    tr.appendChild(tdInputPrice);
    tr.appendChild(tdInputItbis);

    // Agregar fila al elemento contenedor
    elDinamicTableRow.appendChild(tr);
    index++;
}

// Función para obtener el año actual
function currentYear() {
    const currentYearElement = document.querySelector('#currentYear');
    const currentYear = new Date().getFullYear();
    currentYearElement.textContent = `${currentYear} | Event Logist.`;
}
