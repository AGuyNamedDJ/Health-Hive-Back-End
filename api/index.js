require("dotenv").config();
const express = require("express");
const apiRouter = express.Router();
const jwt = require('jsonwebtoken');
const { getUsersById } = require("../db/Users");
const JWT_SECRET = process.env.JWT_SECRET

// JWT Middleware
apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    console.log("Req.header on indexAPI", req.header('Authorization'))

    if (!auth) {
        console.log("No auth!")
        next(); // call next middleware/route handler

        // cehck if auth header has a 'Bearer '
    } else if (auth) {
        const token = auth.slice(prefix.length); // get token from auth header
        console.log("We have Auth", token)

        // Verify JWT token
        try {
            const parsedToken = await jwt.verify(token, JWT_SECRET); // verifying via jwt secret
            console.log("Parsed Token", parsedToken)
            const id = parsedToken && parsedToken.id // Get  id from parsed token
            if (id) { 
                console.log('We have id!')
                req.user = await getUsersById(id); // from db
                console.log("id & req.user", id, req.users)
                next();
            }
        } catch (error) {
            console.log(error);
        }
    // auth header does not start with 'Bearer '
    } else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${ prefix }`
        });
    }
});

// Routers
const { patientRouter } = require('./patient');
const { appointmentRouter } = require('./appointment');
const { medicalRecordRouter } = require('./medicalRecord');
const { staffRouter } = require('./staff');
const { medicationRouter } = require('./medication');
const { procedureRouter } = require('./procedure');
const { procedureStaffRouter } = require('./procedureStaff');
const { treatmentPlanRouter } = require('./treatmentPlan');
apiRouter.use('/patient', patientRouter);
apiRouter.use('/patient/appointment', appointmentRouter);
apiRouter.use('/patient/medicalrecord', medicalRecordRouter);
apiRouter.use('/staff', staffRouter);
apiRouter.use('/patient/medication', medicationRouter);
apiRouter.use('/patient/procedure', procedureRouter);
apiRouter.use('/patient/procedure/staff', procedureStaffRouter);
apiRouter.use('/patient/treatmentplan', treatmentPlanRouter);

// Export
module.exports = { apiRouter }