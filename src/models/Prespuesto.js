import mongoose from "mongoose";

const billingDetails = new mongoose.Schema({
    typeArticle: {
        type: String,
        required: false,
    },
    article: {
        type: String,
        required: false,
    },
    totalArticle: {
        type: String,
        required: false,
    },
    price: {
        type: String,
        required: false,
    },
    itbis: {
        type: String,
        required: false,
    },
    amount: {
        type: String,
        required: false,
    }
});

const PresupuestoSchema = new mongoose.Schema(
    {
        nameActivity: {
            type: String,
            required: false,
        },
        typeActivity: {
            type: String,
            required: false,
        },
        nameClient: {
            type: String,
            required: false,
        },
        rnc: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        location: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: false,
        },
        descriptionActivity: {
            type: String,
            required: false,
        },
        dateActivity: {
            type: String,
            required: false,
        },
        timeActivity: {
            type: String,
            required: false,
        },
        createdBy: {
            type: String,
            required: false,
        },
        statusPaid: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            required: false,
        },
        billing: {
            type: billingDetails,
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

export default mongoose.model("Presupuesto", PresupuestoSchema);
