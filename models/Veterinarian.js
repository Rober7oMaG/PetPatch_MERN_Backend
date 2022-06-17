import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import generateToken from '../helpers/generateToken.js';

const veterinarianSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    phone: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generateToken()
    },
    confirmed: {
        type: Boolean,
        default: false
    }
});

// Hash password before saving to database
veterinarianSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

veterinarianSchema.methods.verifyPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

const Veterinarian = mongoose.model('Veterinarian', veterinarianSchema);

export default Veterinarian;