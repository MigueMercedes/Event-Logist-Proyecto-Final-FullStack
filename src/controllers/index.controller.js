import { isAuthenticated } from '../helpers/auth.js';

export const renderIndex = (req, res) => {
    if (!isAuthenticated) {
        res.render('index', {
            page: 'Inicio',
        });
    } else if (isAuthenticated) {
        res.render('presupuesto/dashboard', {
            page: 'Dashboard',
        });
    } else {
        console.log('Hubo un error al cargar la ruta');
    }
};
