import Presupuesto from '../models/Prespuesto.js';
import User from '../models/User.js';
import defaultTypesArray from '../models/defaultTypes.js';
import parseNumberOrArray from '../helpers/parseNumberOrArray.js';
import noRepeatTypes from '../helpers/noRepeatTypes.js';
import capitalizeArrayOrString from '../helpers/capitalizeArrayOrString.js';
import capitalizeEachWord from '../helpers/capitalizeEachWord.js';
import { Handlebars } from '../helpers/hbs.js';

export const renderDashboard = async (req, res) => {
    try {
        // Obtener todos los presupuestos del usuario
        const presupuestos = await Presupuesto.find({ user: req.user.id }).lean();

        const countPresupuesto = {
            totalCreate: presupuestos.length,
            completed: 0,
            accepted: 0,
            editing: 0,
            refused: 0,
            paid: 0,
            pending: 0,
            noPaid: 0,
        };

        let existPresupuesto = false;
        if (countPresupuesto.totalCreate > 0) {
            existPresupuesto = true;
        } else {
            existPresupuesto = false;
        }

        presupuestos.forEach((presupuesto) => {
            if (presupuesto.statusPaid === 'Pago') {
                countPresupuesto.paid++;
            } else if (presupuesto.statusPaid === 'Pendiente') {
                countPresupuesto.pending++;
            } else {
                countPresupuesto.noPaid++;
            }

            switch (presupuesto.statusPresupuesto) {
                case 'Aceptado':
                    countPresupuesto.accepted++;
                    break;
                case 'Editando':
                    countPresupuesto.editing++;
                    break;
                case 'Rechazado':
                    countPresupuesto.refused++;
                    break;
                case 'Completado':
                    countPresupuesto.completed++;
                    break;
                default:
                    break;
            }
        });

        res.render('presupuesto/dashboard', {
            countPresupuesto,
            isPresupuesto: true,
            existPresupuesto,
        });
    } catch (error) {
        console.log(error);
    }
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
            categorySearch: defaultTypesArray.activity,
        });
    } catch (error) {
        console.log(error);
    }
};

export const renderPrintPresupuesto = async (req, res) => {
    try {
        const dataUser = {
            username: req.user.name,
            email: req.user.email,
        };

        //variables para las fechas y numero de factura
        const invoiceNumber = Date.now();
        const invoiceDate = new Date(invoiceNumber).toUTCString();

        //obtener el presupuesto
        const presupuesto = await Presupuesto.findById(req.params.id).lean();

        return res.render('presupuesto/print-presupuesto', {
            presupuesto,
            page: 'Imprimir presupuesto',
            isPresupuesto: true,
            invoiceNumber,
            invoiceDate,
            dataUser,
        });
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
            defaultTypesArray,
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

    // const missingTypes = [];

    // presupuestoData.typeArticle.forEach((type) => {
    //     if (!defaultTypesArray.article.includes(type)) {
    //         missingTypes.push(type);
    //     }
    // });
    // console.log(missingTypes);

    // if (missingTypes.length > 0) {
    //     console.log('Tipos de artículo faltantes:');
    //     console.log(missingTypes);
    // } else {
    //     console.log('Todos los tipos de artículo están presentes en el array predeterminado.');
    // }

    // Verificar campos necesarios
    if (!nameActivity.trim() || !nameClient.trim()) {
        errors.push({
            text: 'Asegurate de que los detalles estén llenos correctamente.',
        });
    }

    if (errors.length > 0) {
        //Revisa si se encuentra el valor repetido y eliminar los valores duplicados
        const typeActivity = noRepeatTypes(defaultTypesArray.activity, typeActivity);
        const statusPresupuesto = noRepeatTypes(
            defaultTypesArray.statusPresupuesto,
            statusPresupuesto
        );
        const statusPaid = noRepeatTypes(defaultTypesArray.statusPaid, statusPaid);

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
            defaultTypesArray,
            page: 'Error al agregar',
            isPresupuesto: true,
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
        // const user = await User.findById(req.user.id);
        const presupuesto = await Presupuesto.findById(req.params.id).lean();
        if (presupuesto.user != req.user.id) {
            req.flash('error_msg', 'Error al cargar la pagina.');
            return res.redirect('/presupuesto/all-presupuesto');
        }

        //Revisa si se encuentra el valor repetido y eliminar los valores duplicados
        const typeActivity = noRepeatTypes(defaultTypesArray.activity, presupuesto.typeActivity);
        const statusPresupuesto = noRepeatTypes(
            defaultTypesArray.statusPresupuesto,
            presupuesto.statusPresupuesto
        );
        const statusPaid = noRepeatTypes(defaultTypesArray.statusPaid, presupuesto.statusPaid);
        // const typeArticle = noRepeatTypes(user.userDataTypesP.article);

        res.render('presupuesto/edit-presupuesto', {
            page: 'Editar presupuesto',
            presupuesto,
            defaultTypesArray,
            typeActivity,
            statusPresupuesto,
            statusPaid,
            isPresupuesto: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const updatePresupuesto = async (req, res) => {
    try {
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

        // const missingTypes = [];

        // presupuestoData.typeArticle.forEach((type) => {
        //     if (!defaultTypesArray.article.includes(type)) {
        //         missingTypes.push(type);
        //     }
        // });

        // if (missingTypes.length > 0) {
        //     console.log('Tipos de artículo faltantes:');
        //     console.log(missingTypes);
        // } else {
        //     console.log('Todos los tipos de artículo están presentes en el array predeterminado.');
        // }

        // // Agregar nuevo type a la base de datos del usuario
        // const user = await User.findById(req.user.id);

        // if (missingTypes.length > 0) {
        //     // Verificar si userDataTypesP existe, si no, inicializarlo
        //     if (!user.userDataTypesP) {
        //         user.userDataTypesP = {
        //             article: [],
        //             // Agrega otros campos si es necesario (activity, proveedor, etc.)
        //         };
        //     }

        //     // Agregar los tipos de artículo faltantes
        //     user.userDataTypesP.article = [...user.userDataTypesP.article, ...missingTypes];

        //     // Guardar los cambios en la base de datos
        //     await user.save();
        // }

        // Verificar campos necesarios
        if (!nameActivity.trim() || !nameClient.trim()) {
            errors.push({
                text: 'Asegurate de que los detalles estén llenos correctamente.',
            });
        }

        // Verificar campos necesarios
        if (!nameActivity.trim() || !nameClient.trim()) {
            errors.push({
                text: 'Asegurate de que los detalles estén llenos correctamente.',
            });
        }

        if (errors.length > 0) {
            //Revisa si se encuentra el valor repetido y eliminar los valores duplicados
            const typeActivity = noRepeatTypes(defaultTypesArray.activity, typeActivity);
            const statusPresupuesto = noRepeatTypes(
                defaultTypesArray.statusPresupuesto,
                statusPresupuesto
            );
            const statusPaid = noRepeatTypes(defaultTypesArray.statusPaid, statusPaid);

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
                defaultTypesArray,
                // customTypes: user.userDataTypesP.article,
                page: 'Error al agregar',
                isPresupuesto: true,
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
