import Presupuesto from '../models/Prespuesto.js';
import presupuestoDefaultTypes from '../helpers/defaultTypes.js';
import parseNumberOrArray from '../helpers/parseNumberOrArray.js';
import noRepeatTypes from '../helpers/noRepeatTypes.js';
import capitalizeArrayOrString from '../helpers/capitalizeArrayOrString.js';

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
            // isPresupuesto: true,
            presupuesto,
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
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
};

export const renderPresupuestoForm = async (req, res) => {
    try {
        const createdBy = req.user.name;
        res.render('presupuesto/new-presupuesto', {
            page: 'Crear presupuesto',
            createdBy,
            presupuestoDefaultTypes,
        });
    } catch (error) {
        console.log(error);
    }
};

export const createNewPresupuesto = async (req, res) => {
    const errors = [];

    const createdBy = req.user.name;
    const {
        nameActivity,
        nameClient,
        email,
        location,
        phone,
        descriptionActivity,
        dateActivity,
        timeActivity,
    } = req.body;

    // Verificar campos necesarios
    if (!nameActivity.trim() || !nameClient.trim()) {
        errors.push({
            text: 'Asegurate de que los detalles estén llenos correctamente.',
        });
    }

    let { typeActivity } = req.body;
    let { statusPresupuesto } = req.body;
    let { statusPaid } = req.body;

    //Revisa si se encuentra el valor repetido y eliminar los valores duplicados
    typeActivity = noRepeatTypes(
        presupuestoDefaultTypes.activity,
        typeActivity
    );
    statusPresupuesto = noRepeatTypes(
        presupuestoDefaultTypes.statusPresupuesto,
        statusPresupuesto
    );
    statusPaid = noRepeatTypes(presupuestoDefaultTypes.statusPaid, statusPaid);

    //Creamos el objeto con los datos de la tabla y validamos/convertimos datos
    const presupuestoData = {
        typeArticle: capitalizeArrayOrString(req.body['typeArticle[]']),
        nameArticle: capitalizeArrayOrString(req.body['nameArticle[]']),
        totalArticle: parseNumberOrArray(req.body['totalArticle[]']),
        price: parseNumberOrArray(req.body['price[]']),
        itbis: parseNumberOrArray(req.body['itbis[]']),
        discount: parseNumberOrArray(req.body['discount[]']),
    };

    console.log(presupuestoData);

    if (errors.length > 0) {
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

    const totalPrice = Array.isArray(presupuestoData.price)
        ? presupuestoData.price.reduce(
              (total, value, index) =>
                  total + value * presupuestoData.totalArticle[index],
              0
          )
        : presupuestoData.price * presupuestoData.totalArticle;

    const totalItbis = Array.isArray(presupuestoData.itbis)
        ? presupuestoData.itbis.reduce((total, value) => total + value, 0)
        : presupuestoData.itbis;

    const totalDiscount = Array.isArray(presupuestoData.discount)
        ? presupuestoData.discount.reduce((total, value) => {
              total + value, 0;
          })
        : presupuestoData.discount;

    //const totalAmount
    console.log(totalPrice);
    console.log(totalItbis);
    console.log(totalDiscount);

    try {
        /*const newPresupuesto = new Presupuesto({
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
        presupuesto,
    });
};

export const updatePresupuesto = async (req, res) => {
    const {
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
        status,
        totalPrice,
        totalItbis,
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
        totalItbis,
    };

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
        status,
        presupuestoData,
    });
    req.flash('success_msg', 'Presupuesto Actualizado Correctamente.');
    res.redirect('/presupuesto');
};

export const deletePresupuesto = async (req, res) => {
    await Presupuesto.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Presupuesto Eliminado Correctamente.');
    res.redirect('/presupuesto');
};
