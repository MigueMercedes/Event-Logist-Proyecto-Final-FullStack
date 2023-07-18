import Presupuesto from '../models/Prespuesto.js';

export const renderPresupuestos = async (req, res) => {
    const username = req.user.name.split(' ', 1);

    // Registra el ayudante personalizado para incrementar el índice
    res.locals.helpers = {
        incrementIndex: function (index) {
            return index + 1;
        }
    };
    const presupuesto = await Presupuesto.find({ user: req.user.id }).sort({ updatedAt: "desc" }).lean();

    res.render('presupuesto/all-presupuestos', {
        username,
        page: 'Presupuesto',
        isPresupuesto: true,
        presupuesto,
    });
}

export const renderPresupuestoForm = async (req, res) => {
    const username = req.user.name;

    res.render('presupuesto/new-presupuesto', {
        page: 'Nuevo presupuesto',
        username,
    });
};



export const createNewPresupuesto = async (req, res) => {
    const { nameActivity, typeActivity, nameClient, email, location, address, phone, descriptionActivity,
        dateActivity, timeActivity, createdBy, statusPaid, status, totalPrice, totalItbis
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
    }

    console.log(presupuestoData)

    const errors = [];

    if (!nameActivity.trim()) {
        errors.push({ text: "Por favor escribe un nombre." });
    }

    if (errors.length > 0) {
        return res.render("presupuesto/new-presupuesto", {
            errors, nameActivity, typeActivity, nameClient, email, location, address, phone, descriptionActivity,
            dateActivity, timeActivity, createdBy, statusPaid, status, presupuestoData,
            page: 'Error al agregar'
        });
    }

    const newPresupuesto = new Presupuesto({
        nameActivity, typeActivity, nameClient, email, location, address, phone, descriptionActivity,
        dateActivity, timeActivity, createdBy, statusPaid, status, presupuestoData,
    });

    newPresupuesto.user = req.user.id;
    await newPresupuesto.save();
    req.flash("success_msg", "Presupuesto Agregado Correctamente.");
    res.redirect("/presupuesto");
}

export const renderEditForm = async (req, res) => {
    const presupuesto = await Presupuesto.findById(req.params.id).lean();
    if (presupuesto.user != req.user.id) {
        req.flash("error_msg", "Error al cargar la pagina.");
        return res.redirect("/presupuesto");
    }

    res.render('presupuesto/edit-presupuesto', {
        page: 'Editar presupuesto',
        presupuesto
    })
}

export const updatePresupuesto = async (req, res) => {
    const { nameActivity, typeActivity, nameClient, email, location, address, phone, descriptionActivity,
        dateActivity, timeActivity, createdBy, statusPaid, status, billing, } = req.body;

    await Presupuesto.findByIdAndUpdate(req.params.id, {
        nameActivity, typeActivity, nameClient, email, location, address, phone, descriptionActivity,
        dateActivity, timeActivity, createdBy, statusPaid, status, billing,
    });
    req.flash("success_msg", "Presupuesto Actualizado Correctamente.");
    res.redirect("/presupuesto");
}

export const deletePresupuesto = async (req, res) => {
    await Presupuesto.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Presupuesto Eliminado Correctamente.");
    res.redirect("/presupuesto");
};