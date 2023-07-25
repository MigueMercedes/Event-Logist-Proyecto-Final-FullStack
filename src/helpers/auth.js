export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Hubo un problema al acceder a la URL.');
    res.redirect('/users/acceder');
};
