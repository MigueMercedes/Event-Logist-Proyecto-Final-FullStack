import {
    formatPhoneNumber,
    validatedDate,
    validatedTrimString,
    validatedPhone,
} from '../js/functions.js';

document.addEventListener('DOMContentLoaded', () => {
    // Validar Telefono
    const phoneInput = document.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
        phoneInput.addEventListener('blur', validatedPhone);
    }

    // Validar que la fecha sea a futuro
    const dateInput = document.querySelector('#dateActivity');
    if (dateInput) {
        dateInput.addEventListener('input', validatedDate);
    }

    const nameInput = document.querySelector('#nameInput');
    if (nameInput) {
        nameInput.addEventListener('input', validatedTrimString);
    }
});
