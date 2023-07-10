import Proveedor from "../models/Proveedor.js";

export const renderProveedorForm = (req, res) => {
    res.render("proveedores/new-proveedor", {
        page: 'Nuevo Proveedor'
    });
}

export const createNewProveedor = async (req, res) => {
    const { name, category, email, address, phone, description } = req.body;
    const errors = [];

    if (!name.trim()) {
        errors.push({ text: "Por favor escribe un nombre." });
    }

    if (!category.trim()) {
        errors.push({ text: "Por seleciona una categoria." });
    }

    if (errors.length > 0) {
        return res.render("proveedores/new-proveedor", {
            errors,
            name,
            category,
            email,
            address,
            phone,
            description,
            page: 'Error al agregar'
        });
    }

    const newProveedor = new Proveedor({
        name, category, email, address, phone, description
    });
    newProveedor.user = req.user.id;
    await newProveedor.save();
    req.flash("success_msg", "Proveedor Agregado Correctamente.");
    res.redirect("/proveedores");
};

export const renderProveedores = async (req, res) => {
    const username = req.user.name;
    const proveedores = await Proveedor.find({ user: req.user.id })
        .sort({ date: "desc" })
        .lean();
    res.render("proveedores/all-proveedores", {
        proveedores,
        page: 'Proveedores',
        username
    });
};

export const renderEditForm = async (req, res) => {
    const proveedor = await Proveedor.findById(req.params.id).lean();

    if (proveedor.user != req.user.id) {
        req.flash("error_msg", "Error al cargar la pagina.");
        return res.redirect("/proveedores");
    }

    res.render("proveedores/edit-proveedor", {
        proveedor,
        page: 'Editar proveedor'
    });
};

export const updateProveedor = async (req, res) => {
    const { name, category, email, address, phone, description } = req.body;

    await Proveedor.findByIdAndUpdate(req.params.id, {
        name, category, email, address, phone, description
    });
    req.flash("success_msg", "Proveedor Actualizado Correctamente.");
    res.redirect("/proveedores");
};

export const deleteProveedor = async (req, res) => {
    await Proveedor.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Proveedor Eliminado Correctamente.");
    res.redirect("/proveedores");
};
