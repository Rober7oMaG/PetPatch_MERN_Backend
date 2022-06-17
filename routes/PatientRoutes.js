import express from "express";
import { 
    getPatients, 
    addPatient,
    getPatient,
    updatePatient,
    deletePatient
} from "../controllers/PatientController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.route('/').get(checkAuth, getPatients).post(checkAuth, addPatient);
router.route('/:id').get(checkAuth, getPatient).put(checkAuth, updatePatient).delete(checkAuth, deletePatient);

export default router;