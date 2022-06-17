import Patient from "../models/Patient.js";

const getPatients = async (req, res) => {
    // Get patients by logged veterinarian
    const patients = await Patient.find().where('veterinarian').equals(req.veterinarian);
    res.json(patients);
}

const addPatient = async (req, res) => {
    const patient = new Patient(req.body);
    patient.veterinarian = req.veterinarian._id
    
    try {
        const savedPatient = await patient.save();
        res.json(savedPatient);
    } catch (error) {
        console.log(error);
    }
}

const getPatient = async (req, res) => {
    const {id} = req.params;
    const patient = await Patient.findById(id);

    if (!patient) {
        return res.status(400).json({msg: "Patient not found."});
    }

    // Validate that the person making the request is the same one who created it
    if (patient.veterinarian._id.toString() !== req.veterinarian._id.toString()) {
        return res.json({msg: "Invalid action."});
    } 

    res.json(patient);
}

const updatePatient = async (req, res) => {
    const {id} = req.params;
    const patient = await Patient.findById(id);

    if (!patient) {
        return res.status(400).json({msg: "Patient not found."});
    }

    if (patient.veterinarian._id.toString() !== req.veterinarian._id.toString()) {
        return res.json({msg: "Invalid action."});
    } 

    // Update patient
    patient.name = req.body.name || patient.name;
    patient.owner = req.body.owner || patient.owner;
    patient.email = req.body.email || patient.email;
    patient.date = req.body.date || patient.date;
    patient.symptoms = req.body.symptoms || patient.symptoms;

    try {
        const updatedPatient = await patient.save();
        res.json(updatedPatient);
    } catch (error) {
        console.log(error);
    }
}

const deletePatient = async (req, res) => {
    const {id} = req.params;
    const patient = await Patient.findById(id);

    if (!patient) {
        return res.status(400).json({msg: "Patient not found."});
    }

    if (patient.veterinarian._id.toString() !== req.veterinarian._id.toString()) {
        return res.json({msg: "Invalid action."});
    } 

    try {
        await patient.deleteOne();
        res.json({msg: "Patient deleted successfully."});
    } catch (error) {
        console.log(error);
    }
}

export {
    getPatients, 
    addPatient,
    getPatient,
    updatePatient,
    deletePatient
}