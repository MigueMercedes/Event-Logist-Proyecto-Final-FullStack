import mongoose from 'mongoose';

const presupuestoDetails = new mongoose.Schema({
    typeArticle: {
        type: [String],
        required: true
    },
    nameArticle: {
        type: [String],
        required: true
    },
    totalArticle: {
        type: [Number],
        required: true
    },
    price: {
        type: [Number],
        required: true
    },
    itbis: {
        type: [Number],
        required: true
    },
    discount: {
        type: [Number],
        required: true
    },
    totalItbis: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    totalDiscount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    }
});

const PresupuestoSchema = new mongoose.Schema(
    {
        nameActivity: {
            type: String,
            required: true
        },
        typeActivity: {
            type: String,
            required: true
        },
        nameClient: {
            type: String,
            required: true
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
            required: true
        },
        statusPaid: {
            type: String,
            required: true
        },
        statusPresupuesto: {
            type: String,
            required: true
        },
        presupuestoData: {
            type: presupuestoDetails,
            required: true
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
