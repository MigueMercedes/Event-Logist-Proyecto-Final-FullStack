import Presupuesto from '../models/Prespuesto.js';
import { formatCurrency, noRepeatTypes } from '../helpers/index.js';

const dataTypes = {
    activity: [
        'Boda',
        'Cumpleaños',
        'Conferencia',
        'Feria',
        'Exposicion',
        'Comporativo',
        'Gala',
        'Festival',
        'Concierto',
        'Deportivo',
        'Graducacion'
    ],
    article: [
        'Comida',
        'Bebida',
        'Decoracion',
        'Sonido',
        'Pantalla',
        'Luces',
        'Personal',
        'Servicios',
        'Centros de Mesa',
        'Vestimenta',
        'Invitaciones'
    ],
    statusPresupuesto: ['Aceptada', 'Editando', 'Rechazada', 'Completada'],
    statusPaid: ['Pendiente', 'Pago', 'No Pago']
};

export const renderPresupuestos = async (req, res) => {
    try {
        const presupuesto = await Presupuesto.find({ user: req.user.id })
            .sort({ updatedAt: 'desc' })
            .lean();

        if (presupuesto.length > 0) {
            res.render('presupuesto/all-presupuestos', {
                page: 'Presupuestos',
                // isPresupuesto: true,
                presupuesto
            });
        }
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
            dataTypes
        });
    } catch (error) {
        console.log(error);
    }
};

export const createNewPresupuesto = async (req, res) => {
    const errors = [];

    const {
        nameActivity,
        nameClient,
        email,
        location,
        address,
        phone,
        descriptionActivity,
        dateActivity,
        timeActivity,
        createdBy,
        totalPrice,
        totalItbis
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
        discount
    };

    //Revisa si se encuentra el valor repetido y eliminar los valores duplicados
    typeActivity = noRepeatTypes(dataTypes.activity, typeActivity);
    statusPresupuesto = noRepeatTypes(dataTypes.statusPresupuesto, statusPresupuesto);
    statusPaid = noRepeatTypes(dataTypes.statusPaid, statusPaid);

    if (!nameActivity.trim()) {
        errors.push({ text: 'Debes escribir un nombre para la actividad' });
    }

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
            page: 'Error al agregar'
        });
    }

    const newPresupuesto = new Presupuesto({
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
    req.flash('success_msg', 'Presupuesto Agregado Correctamente.');
    res.redirect('/presupuesto');
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
