import Presupuesto from '../models/Prespuesto.js';
import { presupuestoDefaultTypes } from '../helpers/defaultTypes.js';
import parseNumberOrArray from '../helpers/parseNumberOrArray.js';
import noRepeatTypes from '../helpers/noRepeatTypes.js';
import capitalizeArrayOrString from '../helpers/capitalizeArrayOrString.js';
import capitalizeEachWord from '../helpers/capitalizeEachWord.js';
import { Handlebars } from '../helpers/hbs.js';

export const renderDashboard = async (req, res) => {
    res.render('presupuesto/dashboard');
};

export const renderPresupuestos = async (req, res) => {
    try {
        const presupuesto = await Presupuesto.find({ user: req.user.id })
            .sort({ updatedAt: 'desc' })
            .lean();

        res.render('presupuesto/all-presupuestos', {
            page: 'Presupuestos',
            isPresupuesto: true,
            presupuesto,
            categorySearch: presupuestoDefaultTypes.activity,
        });
    } catch (error) {
        console.log(error);
    }
};

export const renderPrintPresupuesto = async (req, res) => {
    try {
        const presupuesto = await Presupuesto.findById(req.params.id).lean();

        if (presupuesto) {
            return res.render('presupuesto/print-presupuesto', {
                presupuesto,
                page: 'Imprimir presupuesto',
                isPresupuesto: true,
            });
        }
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
};

export const renderPresupuestoForm = async (req, res) => {
    try {
        const createdBy = req.user.name;
        res.render('presupuesto/new-presupuesto', {
            page: 'Crear presupuesto',
            createdBy,
            presupuestoDefaultTypes,
            isPresupuesto: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const createNewPresupuesto = async (req, res) => {
    const errors = [];

    const createdBy = req.user.name;
    const {
        email,
        phone,
        dateActivity,
        timeActivity,
        typeActivity,
        statusPresupuesto,
        statusPaid,
    } = req.body;

    //Convertir primera letra a mayuscula y quitar espacios en blanco
    const nameActivity = capitalizeArrayOrString(req.body.nameActivity.trim());
    const nameClient = capitalizeEachWord(req.body.nameClient.trim());
    const location = capitalizeEachWord(req.body.location.trim());
    const descriptionActivity = capitalizeEachWord(req.body.descriptionActivity.trim());

    //Creamos el objeto con los datos de la tabla y validamos/convertimos datos
    const presupuestoData = {
        typeArticle: capitalizeArrayOrString(req.body['typeArticle[]']),
        nameArticle: capitalizeArrayOrString(req.body['nameArticle[]']),
        totalArticle: parseNumberOrArray(req.body['totalArticle[]']),
        price: parseNumberOrArray(req.body['price[]']),
        itbis: parseNumberOrArray(req.body['itbis[]']),
        porcentDiscount: parseNumberOrArray(req.body['porcentDiscount[]']),
    };

    // Verificar campos necesarios
    if (!nameActivity.trim() || !nameClient.trim()) {
        errors.push({
            text: 'Asegurate de que los detalles estén llenos correctamente.',
        });
    }

    if (errors.length > 0) {
        //Revisa si se encuentra el valor repetido y eliminar los valores duplicados
        const typeActivity = noRepeatTypes(presupuestoDefaultTypes.activity, typeActivity);
        const statusPresupuesto = noRepeatTypes(
            presupuestoDefaultTypes.statusPresupuesto,
            statusPresupuesto
        );
        const statusPaid = noRepeatTypes(presupuestoDefaultTypes.statusPaid, statusPaid);

        return res.render('presupuesto/new-presupuesto', {
            errors,
            nameActivity,
            typeActivity,
            nameClient,
            email,
            location,
            phone,
            descriptionActivity,
            dateActivity,
            timeActivity,
            createdBy,
            statusPaid,
            statusPresupuesto,
            presupuestoData,
            presupuestoDefaultTypes,
            page: 'Error al agregar',
        });
    }

    const subTotal = Array.isArray(presupuestoData.price)
        ? presupuestoData.price.reduce(
              (total, value, index) => total + value * presupuestoData.totalArticle[index],
              0
          )
        : presupuestoData.price * presupuestoData.totalArticle;

    const totalItbis = Array.isArray(presupuestoData.itbis)
        ? presupuestoData.itbis.reduce((total, value) => total + value, 0)
        : presupuestoData.itbis;

    const totalDiscount = Array.isArray(presupuestoData.porcentDiscount)
        ? presupuestoData.porcentDiscount.reduce((total, value, index) => {
              const discountDecimal = value / 100;

              return (
                  total +
                  (presupuestoData.price[index] * presupuestoData.totalArticle[index] +
                      presupuestoData.itbis[index]) *
                      discountDecimal
              );
          }, 0)
        : (presupuestoData.porcentDiscount / 100) * (subTotal + presupuestoData.itbis);

    const totalAmount = subTotal + totalItbis - totalDiscount;

    try {
        const newPresupuesto = new Presupuesto({
            nameActivity,
            typeActivity,
            nameClient,
            email,
            location,
            phone,
            descriptionActivity,
            dateActivity,
            timeActivity,
            createdBy,
            statusPaid,
            statusPresupuesto,
            presupuestoData,
            subTotal,
            totalItbis,
            totalDiscount,
            totalAmount,
        });

        newPresupuesto.user = req.user.id;
        await newPresupuesto.save();

        req.flash('success_msg', 'Presupuesto Agregado Correctamente.');
        res.redirect('/presupuesto/all-presupuesto');
    } catch (error) {
        console.log(error);
    }
};

export const renderEditForm = async (req, res) => {
    try {
        const presupuesto = await Presupuesto.findById(req.params.id).lean();
        if (presupuesto.user != req.user.id) {
            req.flash('error_msg', 'Error al cargar la pagina.');
            return res.redirect('/presupuesto/all-presupuesto');
        }

        //Revisa si se encuentra el valor repetido y eliminar los valores duplicados
        const typeActivity = noRepeatTypes(
            presupuestoDefaultTypes.activity,
            presupuesto.typeActivity
        );
        const statusPresupuesto = noRepeatTypes(
            presupuestoDefaultTypes.statusPresupuesto,
            presupuesto.statusPresupuesto
        );
        const statusPaid = noRepeatTypes(
            presupuestoDefaultTypes.statusPaid,
            presupuesto.statusPaid
        );

        res.render('presupuesto/edit-presupuesto', {
            page: 'Editar presupuesto',
            presupuesto,
            presupuestoDefaultTypes,
            typeActivity,
            statusPresupuesto,
            statusPaid,
        });
    } catch (error) {
        console.log(error);
    }
};

export const updatePresupuesto = async (req, res) => {
    const errors = [];

    const createdBy = req.user.name;
    const {
        email,
        phone,
        dateActivity,
        timeActivity,
        typeActivity,
        statusPresupuesto,
        statusPaid,
    } = req.body;

    //Convertir primera letra a mayuscula y quitar espacios en blanco
    const nameActivity = capitalizeArrayOrString(req.body.nameActivity.trim());
    const nameClient = capitalizeEachWord(req.body.nameClient.trim());
    const location = capitalizeEachWord(req.body.location.trim());
    const descriptionActivity = capitalizeEachWord(req.body.descriptionActivity.trim());

    //Creamos el objeto con los datos de la tabla y validamos/convertimos datos
    const presupuestoData = {
        typeArticle: capitalizeArrayOrString(req.body['typeArticle[]']),
        nameArticle: capitalizeArrayOrString(req.body['nameArticle[]']),
        totalArticle: parseNumberOrArray(req.body['totalArticle[]']),
        price: parseNumberOrArray(req.body['price[]']),
        itbis: parseNumberOrArray(req.body['itbis[]']),
        porcentDiscount: parseNumberOrArray(req.body['porcentDiscount[]']),
    };

    // Verificar campos necesarios
    if (!nameActivity.trim() || !nameClient.trim()) {
        errors.push({
            text: 'Asegurate de que los detalles estén llenos correctamente.',
        });
    }

    if (errors.length > 0) {
        //Revisa si se encuentra el valor repetido y eliminar los valores duplicados
        const typeActivity = noRepeatTypes(presupuestoDefaultTypes.activity, typeActivity);
        const statusPresupuesto = noRepeatTypes(
            presupuestoDefaultTypes.statusPresupuesto,
            statusPresupuesto
        );
        const statusPaid = noRepeatTypes(presupuestoDefaultTypes.statusPaid, statusPaid);

        return res.render('presupuesto/new-presupuesto', {
            errors,
            nameActivity,
            typeActivity,
            nameClient,
            email,
            location,
            phone,
            descriptionActivity,
            dateActivity,
            timeActivity,
            createdBy,
            statusPaid,
            statusPresupuesto,
            presupuestoData,
            presupuestoDefaultTypes,
            page: 'Error al agregar',
        });
    }

    const subTotal = Array.isArray(presupuestoData.price)
        ? presupuestoData.price.reduce(
              (total, value, index) => total + value * presupuestoData.totalArticle[index],
              0
          )
        : presupuestoData.price * presupuestoData.totalArticle;

    const totalItbis = Array.isArray(presupuestoData.itbis)
        ? presupuestoData.itbis.reduce((total, value) => total + value, 0)
        : presupuestoData.itbis;

    const totalDiscount = Array.isArray(presupuestoData.porcentDiscount)
        ? presupuestoData.porcentDiscount.reduce((total, value, index) => {
              const discountDecimal = value / 100;

              return (
                  total +
                  (presupuestoData.price[index] * presupuestoData.totalArticle[index] +
                      presupuestoData.itbis[index]) *
                      discountDecimal
              );
          }, 0)
        : (presupuestoData.porcentDiscount / 100) * (subTotal + presupuestoData.itbis);

    const totalAmount = subTotal + totalItbis - totalDiscount;

    try {
        await Presupuesto.findByIdAndUpdate(req.params.id, {
            nameActivity,
            typeActivity,
            nameClient,
            email,
            location,
            phone,
            descriptionActivity,
            dateActivity,
            timeActivity,
            createdBy,
            statusPaid,
            statusPresupuesto,
            presupuestoData,
            subTotal,
            totalItbis,
            totalDiscount,
            totalAmount,
        });
        req.flash('success_msg', 'Presupuesto Actualizado Correctamente.');
        res.redirect('/presupuesto/all-presupuesto');
    } catch (error) {
        console.log(error);
    }
};

export const deletePresupuesto = async (req, res) => {
    try {
        await Presupuesto.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Presupuesto Eliminado Correctamente.');
        res.redirect('/presupuesto/all-presupuesto');
    } catch (error) {
        console.log(error);
    }
};
