export const renderIndex = (req, res) => {
    const isAuthenticated = req.isAuthenticated(); // Aquí obtienes el estado de autenticación desde el request

    if (!isAuthenticated) {
        res.render('index', {
            page: 'Inicio',
        });
    } else {
        res.redirect('/presupuesto');
    }
};
