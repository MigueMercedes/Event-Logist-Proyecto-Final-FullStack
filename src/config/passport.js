import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import User from "../models/User.js";

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            // Buscar correo
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: "Credenciales incorrectos" });
            }

            // Buscar password
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return done(null, false, { message: "Contraseña incorrecta" });
            }

            return done(null, user);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
