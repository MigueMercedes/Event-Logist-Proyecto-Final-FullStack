import Presupuesto from '../models/Prespuesto.js';
import { formatCurrency, noRepeatTypes } from '../helpers/index.js';
import presupuestoDefaultTypes from '../helpers/defaultTypes.js';

export const renderPresupuestos = async (req, res) => {
    try {
        const presupuesto = await Presupuesto.find({ user: req.user.id })
            .sort({ updatedAt: 'desc' })
            .lean();

        res.render('presupuesto/all-presupuestos', {
            page: 'Presupuestos',
            // isPresupuesto: true,
            presupuesto
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
};

export const renderPrintPresupuesto = async (req, res) => {
    try {
        const presupuesto = await Presupuesto.findById(req.params.id).lean();

        res.render('presupuesto/print-presupuesto', {
            presupuesto,
            page: 'Imprimir presupuesto',
            formatCurrency
        });
    } catch (error) {
        console.log(error);
        res.redirect('/presupuesto');
    }
};

export const renderPresupuestoForm = async (req, res) => {
    try {
        const username = req.user.name;
        res.render('presupuesto/new-presupuesto', {
            page: 'Crear presupuesto',
            username,
            presupuestoDefaultTypes
        });
    } catch (error) {
        console.log(error);
    }
};

export const createNewPresupuesto = async (req, res) => {
    try {
        const errors = [];

        const {
            nameActivity,
            nameClient,
            email,
            location,
            phone,
            descriptionActivity,
            dateActivity,
            timeActivity,
            createdBy,
            totalPrice,
            totalItbis,
            totalDiscount,
            totalAmount
        } = req.body;
        let { typeActivity } = req.body;
        let { statusPresupuesto } = req.body;
        let { statusPaid } = req.body;

        const typeArticle = req.body['typeArticle[]'];
        const nameArticle = req.body['nameArticle[]'];
        const totalArticle = req.body['totalArticle[]'];
        const price = req.body['price[]'];
        const itbis = req.body['itbis[]'];
        const discount = req.body['discount[]'];

        const presupuestoData = {
            typeArticle,
            nameArticle,
            totalArticle,
            price,
            itbis,
            totalPrice,
            totalItbis,
            discount,
            totalDiscount,
            totalAmount
        };
        console.log(presupuestoData);

        // Verificar que todos los campos estén completos

        if (
            !nameActivity.trim() ||
            !nameClient.trim() ||
            !createdBy.trim() ||
            !totalPrice.trim() ||
            !typeActivity.trim() ||
            !statusPresupuesto.trim() ||
            !statusPaid.trim()
        ) {
            errors.push({ text: 'Asegurate de que los campos esten correctamente llenos' });
        }

        //Revisa si se encuentra el valor repetido y eliminar los valores duplicados
        typeActivity = noRepeatTypes(presupuestoDefaultTypes.activity, typeActivity);
        statusPresupuesto = noRepeatTypes(
            presupuestoDefaultTypes.statusPresupuesto,
            statusPresupuesto
        );
        statusPaid = noRepeatTypes(presupuestoDefaultTypes.statusPaid, statusPaid);

        if (errors.length > 0) {
            return res.render('presupuesto/new-presupuesto', {
                errors,
                nameActivity,
                typeActivity,
                nameClient,
                email,
                location,
                address,
                phone,
                descriptionActivity,
                dateActivity,
                timeActivity,
                createdBy,
                statusPaid,
                statusPresupuesto,
                presupuestoData,
                presupuestoDefaultTypes,
                page: 'Error al agregar'
            });
        }

        /*const newPresupuesto = new Presupuesto({
        nameActivity,
        typeActivity,
        nameClient,
        email,
        location,
        address,
        phone,
        descriptionActivity,
        dateActivity,
        timeActivity,
        createdBy,
        statusPaid,
        statusPresupuesto,
        presupuestoData
    });

    newPresupuesto.user = req.user.id;
    await newPresupuesto.save();
    */
        req.flash('success_msg', 'Presupuesto Agregado Correctamente.');
        res.redirect('/presupuesto');
    } catch (error) {
        console.log(error);
    }
};

export const renderEditForm = async (req, res) => {
    const presupuesto = await Presupuesto.findById(req.params.id).lean();
    if (presupuesto.user != req.user.id) {
        req.flash('error_msg', 'Error al cargar la pagina.');
        return res.redirect('/presupuesto');
    }

    res.render('presupuesto/edit-presupuesto', {
        page: 'Editar presupuesto',
        presupuesto
    });
};

export const updatePresupuesto = async (req, res) => {
    const {
        nameActivity,
        typeActivity,
        nameClient,
        email,
        location,
        address,
        phone,
        descriptionActivity,
        dateActivity,
        timeActivity,
        createdBy,
        statusPaid,
        status,
        totalPrice,
        totalItbis
    } = req.body;

    const typeArticle = req.body['typeArticle[]'];
    const nameArticle = req.body['nameArticle[]'];
    const totalArticle = req.body['totalArticle[]'];
    const price = req.body['price[]'];
    const itbis = req.body['itbis[]'];

    const presupuestoData = {
        typeArticle,
        nameArticle,
        totalArticle,
        price,
        itbis,
        totalPrice,
        totalItbis
    };

    await Presupuesto.findByIdAndUpdate(req.params.id, {
        nameActivity,
        typeActivity,
        nameClient,
        email,
        location,
        address,
        phone,
        descriptionActivity,
        dateActivity,
        timeActivity,
        createdBy,
        statusPaid,
        status,
        presupuestoData
    });
    req.flash('success_msg', 'Presupuesto Actualizado Correctamente.');
    res.redirect('/presupuesto');
};

export const deletePresupuesto = async (req, res) => {
    await Presupuesto.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Presupuesto Eliminado Correctamente.');
    res.redirect('/presupuesto');
};
