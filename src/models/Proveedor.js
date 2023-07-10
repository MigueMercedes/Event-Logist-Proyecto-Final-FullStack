import mongoose from "mongoose";

const ProveedorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
        user: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Proveedor", ProveedorSchema);
