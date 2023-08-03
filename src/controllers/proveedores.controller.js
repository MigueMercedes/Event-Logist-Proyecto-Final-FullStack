import Proveedor from '../models/Proveedor.js';
import noRepeatTypes from '../helpers/noRepeatTypes.js';
import capitalizeEachWord from '../helpers/capitalizeEachWord.js';
import { proveedorDefaultTypes } from '../helpers/defaultTypes.js';
import { Handlebars } from '../helpers/hbs.js';

export const renderProveedores = async (req, res) => {
    const username = req.user.name.split(' ', 1);

    try {
        const proveedores = await Proveedor.find({ user: req.user.id })
            .sort({ updatedAt: 'desc' })
            .lean();

        res.render('proveedores/all-proveedores', {
            proveedores,
            page: 'Proveedores',
            username,
            isProveedores: true,
            proveedorDefaultTypes,
        });
    } catch (error) {
        console.log(error);
    }
};

export const renderProveedorForm = (req, res) => {
    res.render('proveedores/new-proveedor', {
        page: 'Nuevo Proveedor',
        isProveedores: true,
        proveedorDefaultTypes,
    });
};

export const createNewProveedor = async (req, res) => {
    const { email, category, address, phone, description } = req.body;
    const name = req.body.name.trim();

    try {
        const newProveedor = new Proveedor({
            name,
            category,
            email,
            address,
            phone,
            description,
        });
        newProveedor.user = req.user.id;
        await newProveedor.save();
        req.flash('success_msg', 'Proveedor Agregado Correctamente.');
        res.redirect('/proveedores');
    } catch (error) {
        console.log(error);
    }
};

export const renderEditForm = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id).lean();

        //Revisa si se encuentra el valor repetido y eliminar los valores duplicados
        const category = noRepeatTypes(proveedorDefaultTypes, proveedor.category);
        proveedor.category = category;

        if (proveedor.user != req.user.id) {
            req.flash('error_msg', 'Error al cargar la pagina.');
            return res.redirect('/proveedores');
        }

        res.render('proveedores/edit-proveedor', {
            proveedor,
            page: 'Editar proveedor',
            isProveedores: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const updateProveedor = async (req, res) => {
    const { name, category, email, address, phone, description } = req.body;

    try {
        await Proveedor.findByIdAndUpdate(req.params.id, {
            name,
            category,
            email,
            address,
            phone,
            description,
        });
        req.flash('success_msg', 'Proveedor Actualizado Correctamente.');
        res.redirect('/proveedores');
    } catch (error) {
        console.log(error);
    }
};

export const deleteProveedor = async (req, res) => {
    try {
        await Proveedor.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Proveedor Eliminado Correctamente.');
        res.redirect('/proveedores');
    } catch (error) {
        console.log(error);
    }
};
