import Proveedor from "../models/Proveedor.js";

export const renderProveedorForm = (req, res) => {
    res.render("proveedores/new-proveedor", { page: 'Nuevo Proveedor' });
}

export const createNewProveedor = async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: "Please Write a Title." });
    }
    if (!description) {
        errors.push({ text: "Please Write a Description" });
    }
    if (errors.length > 0)
        return res.render("proveedores/new-proveedor", {
            errors,
            title,
            description,
        });

    const newProveedor = new Proveedor({ title, description });
    newProveedor.user = req.user.id;
    await newProveedor.save();
    req.flash("success_msg", "Proveedor Added Successfully");
    res.redirect("/proveedores");
};

export const renderProveedores = async (req, res) => {
    const proveedores = await Proveedor.find({ user: req.user.id })
        .sort({ date: "desc" })
        .lean();
    res.render("proveedores/all-proveedores", { proveedores });
};

export const renderEditForm = async (req, res) => {
    const proveedor = await Proveedor.findById(req.params.id).lean();
    if (proveedor.user != req.user.id) {
        req.flash("error_msg", "Not Authorized");
        return res.redirect("/proveedores");
    }
    res.render("proveedores/edit-proveedor", { proveedor });
};

export const updateProveedor = async (req, res) => {
    const { title, description } = req.body;

    await Proveedor.findByIdAndUpdate(req.params.id, { title, description });
    req.flash("success_msg", "Proveedor Updated Successfully");
    res.redirect("/proveedores");
};

export const deleteProveedor = async (req, res) => {
    await Proveedor.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Proveedor Deleted Successfully");
    res.redirect("/proveedores");
};
