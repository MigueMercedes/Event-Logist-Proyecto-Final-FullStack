import { formatPhoneNumber, validatedDate } from '../js/functions.js';

document.addEventListener('DOMContentLoaded', () => {
    // Validar Telefono
    const phoneInput = document.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => formatPhoneNumber(e));
    }

    // Validar que la fecha sea a futuro
    const dateInput = document.querySelector('#dateActivity');
    if (dateInput) {
        dateInput.addEventListener('input', (e) => validatedDate(e));
    }
});
