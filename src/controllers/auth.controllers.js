import User from '../models/User.js';
import passport from 'passport';

export const renderRegistrarForm = (req, res) => {
    res.render('auth/registrar', {
        page: 'Registrarse',
        isRegistrar: true
    });
};
export const registrar = async (req, res) => {
    let errors = [];
    const { name, email, password, confirm_password } = req.body;

    if (name.trim() === '') {
        errors.push({ text: 'El nombre es obligatorio.' });
    }

    if (password !== confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden.' });
    }

    if (password.length < 6) {
        errors.push({ text: 'La contraseña tiene que tener minimo 6 caracteres.' });
    }

    if (errors.length > 0) {
        return res.render('auth/registrar', {
            errors,
            name,
            email
        });
    }

    // Buscar el correo
    const userFound = await User.findOne({ email: email });
    if (userFound) {
        req.flash('error_msg', 'El correo ya esta en uso.');
        return res.redirect('/auth/registrar');
    }

    // Guardamos el usuario
    const newUser = new User({
        name,
        email,
        password
    });

    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();
    req.flash('success_msg', 'Tu cuenta ha sido Registrada correctamente, inicia ahora...');
    res.redirect('/auth/acceder');
};

export const renderAccederForm = (req, res) => {
    res.render('auth/acceder', {
        page: 'Acceder',
        isAcceder: true
    });
};

export const acceder = passport.authenticate('local', {
    successRedirect: '/proveedores',
    failureRedirect: '/auth/acceder',
    failureFlash: true
});

export const salir = async (req, res, next) => {
    await req.logout((err) => {
        if (err) return next(err);
        req.flash('success_msg', 'You are logged out now.');
        res.redirect('/auth/acceder');
    });
};
