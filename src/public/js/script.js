
// Variables globales
let index = 2;

// Selectores
const selectorBtnNewRow = document.querySelector('#btnNewRow');
const elDinamicTableRow = document.querySelector('#DinamicTableRow');


// Event listener al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    currentYear();
    if (elDinamicTableRow) {
        selectorBtnNewRow.addEventListener('click', e => {
            e.preventDefault();
            createDinamicTableRow();
        });
    }
});

// Función para obtener el año actual
function currentYear() {
    const currentYearElement = document.querySelector('#currentYear');
    const currentYear = new Date().getFullYear();
    currentYearElement.textContent = `${currentYear} | Event Logist.`;
}

// Función para agregar filas dinámicamente
function createDinamicTableRow() {
    // Crear elementos
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    const tdSelect = document.createElement('td');
    const tdInput = document.createElement('td');
    const select = document.createElement('select');
    const input = document.createElement('input');

    // Configurar atributos y contenido
    th.textContent = index;
    th.id = `row-${index}`;
    index++;

    select.classList.add('form-select');
    select.name = '';
    select.id = '';

    const options = [
        { value: 'decoracion', text: 'Decoracion' },
        { value: 'comida', text: 'Comida' },
        { value: 'equipo', text: 'Equipo' },
        { value: 'personal', text: 'Personal' },
        { value: 'otro', text: 'Otro' }
    ];

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        select.appendChild(optionElement);
    });

    input.type = 'text';
    input.name = '';
    input.classList.add('form-control');

    // Agregar elementos a la fila
    tdSelect.appendChild(select);
    tdInput.appendChild(input);
    tr.appendChild(th);
    tr.appendChild(tdSelect);
    tr.appendChild(tdInput);

    // Agregar fila al elemento contenedor
    elDinamicTableRow.appendChild(tr);
}
