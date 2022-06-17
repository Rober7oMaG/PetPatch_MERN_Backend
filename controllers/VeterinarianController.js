import Veterinarian from "../models/Veterinarian.js";
import generateJWT from "../helpers/generateJWT.js";
import generateToken from "../helpers/generateToken.js";
import registerEmail from "../helpers/registerEmail.js";
import forgotPasswordEmail from "../helpers/forgotPasswordEmail.js";

const register = async (req, res) => {
    const {email, name} = req.body;

    // Prevent duplicated users
    const userExists = await Veterinarian.findOne({email});
    if (userExists) {
        const error = new Error("This user is already registered");
        return res.status(400).json({msg: error.message});
    }

    try {
        // Save veterinarian to database
        const veterinarian = new Veterinarian(req.body);
        const savedVeterinarian = await veterinarian.save();

        // Send email after saving user
        registerEmail({
            email,
            name,
            token: savedVeterinarian.token
        });

        res.json(savedVeterinarian);
    } catch (error) {
        console.log(error);
    }
};

const profile = (req, res) => {
    const {veterinarian} = req;
    res.json(veterinarian);
};

const confirm = async (req, res) => {
    const {token} = req.params;
    
    // Find user by token
    const confirmedUser = await Veterinarian.findOne({token});
    if (!confirmedUser) {
        const error = new Error("Invalid token");
        return res.status(404).json({msg: error.message});
    }

    try {
        confirmedUser.token = null;
        confirmedUser.confirmed = true;
        await confirmedUser.save();

        res.json({msg: "Account confirmed successfully"});
    } catch (error) {
        console.log(error);
    }

    console.log(confirmedUser);
};

const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await Veterinarian.findOne({email});

    // Verify the user actualy exists.
    if (!user) {
        const error = new Error("User does not exist.");
        return res.status(404).json({msg: error.message});
    } 

    // Verify the user is confirmated
    if (!user.confirmed) {
        const error = new Error("Your account has not been confirmed.");
        return res.status(403).json({msg: error.message});
    }

    // Verify user's password
    if (await user.verifyPassword(password)) {
        // Authenticate
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            web: user.web,
            token: generateJWT(user.id)
        });
    } else {
        const error = new Error("Your password is incorrect.");
        return res.status(403).json({msg: error.message});
    }
};

const forgotPassword = async (req, res) => {
    const {email} = req.body;

    const userExists = await Veterinarian.findOne({email});
    if (!userExists) {
        const error = new Error("This user is does not exist");
        return res.status(400).json({msg: error.message});
    }

    try {
        userExists.token = generateToken();
        await userExists.save();

        // Send email
        forgotPasswordEmail({
            name: userExists.name,
            email, 
            token: userExists.token
        });

        res.json({msg: "Check your mail inbox to reset your password"});
    } catch (error) {
        console.log(error);
    }
}

const checkToken = async (req, res) => {
    const {token} = req.params;
    
    // Find user by token
    const userExists = await Veterinarian.findOne({token});
    if (userExists) {
        res.json({msg: "Valid token, user exists."})
    } else {
        const error = new Error("Invalid token");
        return res.status(404).json({msg: error.message});
    }
}

const resetPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const veterinarian = await Veterinarian.findOne({token});
    if (!veterinarian) {
        const error = new Error("Invalid token");
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinarian.token = null;
        veterinarian.password = password;
        await veterinarian.save();

        res.json({msg: 'Password changed successfully'});
    } catch (error) {
        console.log(error);
    }
}

const updateProfile = async (req, res) => {
    const veterinarian = await Veterinarian.findById(req.params.id);
    if(!veterinarian) {
        const error = new Error("An error has occurred");
        return res.status(400).json({msg: error.message});
    }

    // If the user changes the email, verify it is not used
    const {email} = req.body;
    if (veterinarian.email !== email) {
        const emailExists = await Veterinarian.findOne({email});
        if (emailExists) {
            const error = new Error("This email is already in use");
            return res.status(400).json({msg: error.message});
        }
    }

    // Update profile
    try {
        veterinarian.name = req.body.name;
        veterinarian.email = req.body.email;
        veterinarian.phone = req.body.phone;
        veterinarian.web = req.body.web;

        const updatedVeterinarian = await veterinarian.save();
        res.json(updatedVeterinarian);
    } catch (error) {
        console.log(error);
    }
}

const updatePassword = async (req, res) => {
    // Get data
    const {_id} = req.veterinarian;
    const {password, new_password, new_password_confirmation} = req.body;

    // Check the user exists
    const veterinarian = await Veterinarian.findById(_id);
    if(!veterinarian) {
        const error = new Error("An error has occurred");
        return res.status(400).json({msg: error.message});
    }

    // Check the currente password is correct
    if (await veterinarian.verifyPassword(password)) {
        // Save new password
        veterinarian.password = new_password;
        await veterinarian.save();
        res.json({msg: "Password updated successfully"});
    } else {
        const error = new Error("Your current password is incorrect");
        return res.status(400).json({msg: error.message});
    }
}

export {
    register,
    profile,
    confirm,
    login,
    forgotPassword,
    checkToken,
    resetPassword,
    updateProfile,
    updatePassword
}