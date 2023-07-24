import mongoose from 'mongoose';

const presupuestoTypes = new mongoose.Schema({
    typesActivity: {
        type: [String],
        required: false
    },
    typesArticle: {
        type: [String],
        required: false
    },
    typesStatusPresupuesto: {
        type: [String],
        required: false
    },
    typesStatusPaid: {
        type: [String],
        required: false
    }
});
const presupuestoDetails = new mongoose.Schema({
    typeArticle: {
        type: [String],
        required: false
    },
    nameArticle: {
        type: [String],
        required: false
    },
    totalArticle: {
        type: [String],
        required: false
    },
    price: {
        type: [String],
        required: false
    },
    itbis: {
        type: [String],
        required: false
    },
    discount: {
        type: [String],
        required: false
    },
    totalItbis: {
        type: String,
        required: false
    },
    totalPrice: {
        type: String,
        required: false
    },
    totalDiscount: {
        type: String,
        required: false
    }
});

const PresupuestoSchema = new mongoose.Schema(
    {
        nameActivity: {
            type: String,
            required: false
        },
        typeActivity: {
            type: String,
            required: false
        },
        nameClient: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        location: {
            type: String,
            required: false
        },
        phone: {
            type: String,
            required: false
        },
        descriptionActivity: {
            type: String,
            required: false
        },
        dateActivity: {
            type: String,
            required: false
        },
        timeActivity: {
            type: String,
            required: false
        },
        createdBy: {
            type: String,
            required: false
        },
        statusPaid: {
            type: String,
            required: false
        },
        statusPresupuesto: {
            type: String,
            required: false
        },
        presupuestoData: {
            type: presupuestoDetails,
            required: false
        },
        presupuestoDataTypes: {
            type: presupuestoTypes,
            required: false
        },
        user: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Presupuesto', PresupuestoSchema);
