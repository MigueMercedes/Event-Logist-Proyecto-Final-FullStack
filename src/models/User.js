import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const presupuestoDataTypes = new mongoose.Schema({
    activity: {
        type: [String],
        required: true
    },
    article: {
        type: [String],
        required: true
    },
    proveedor: {
        type: [String],
        required: true
    }
});

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        userDataTypesP: {
            type: presupuestoDataTypes,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);
