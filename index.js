import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDatabase from './config/db.js';
import veterinarianRoutes from './routes/VeterinarianRoutes.js';
import patientRoutes from './routes/PatientRoutes.js';

const app = express();

app.use(express.json());

dotenv.config();

connectDatabase();

const allowedDomains = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function(origin, callback) {
        if (allowedDomains.indexOf(origin) !== -1) {
            // Request's origin is allowed
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
};

app.use(cors(corsOptions));

// Set port
const port = process.env.PORT || 4000;

app.use('/api/veterinarians', veterinarianRoutes);
app.use('/api/patients', patientRoutes);

app.listen(port, () => {
    console.log(`Server working on port ${port}`);
});