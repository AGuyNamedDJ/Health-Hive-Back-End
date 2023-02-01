// Imports
const express = require("express");
const { createAppointment,
    getAllAppointment,
    getAppointmentById,
    getAppointmentByDate,
    getAppointmentByPatientId,
    getAppointmentByStaffId,
    getAppointmentByTreatmentId,
    destroyAppointment,
    updateAppointment } = require('../../db/patient/Appointment');

const { requireUser, requireActiveUser  } = require('../utilities');

// Router Middleware
const appointmentRouter = express.Router();

// Route Handelers
    // Initial patientRouter
    appointmentRouter.use((req, res, next) => {
        console.log("A request is being made to /patient");
        next();
    });

    // POST/patient
    appointmentRouter.post("/", async (req, res, next) => {
        try {
            const patient = await getPatientByEmail(email);

            if (patient) {
                next({
                    name: "PreExistingPatientError",
                    message: `Patient named ${patient.email} already exists!`,
                    error: "Error! ",
                });
            }
            const newPatient = await createPatient({first_name, last_name, date_of_birth, gender, address, phone_number, email, emergency_contact_name, emergency_contact_phone});
            res.send(newPatient);
        } catch ({ name, message }) {
            next({ name, message });
        }
      });

    // GET/patient
    appointmentRouter.get('/', async (req, res, next) =>{
        try{
            const patient = await getAllPatient();
            res.send(patient) 
        } catch (error) {
            console.log("Error getting all patient!")
        }
    });

    // GET/getPatientById 
    appointmentRouter.get('/:id', async (req, res, next) => {
        const {id} = req.params 
        try {
            const newPatientId = await getPatientById (id)
            res.send(newPatientId)
        } catch (error) {
            console.log("Error getting patientId!")
            console.log(error)
        }
    });

    // GET/getPatientByLastName
    appointmentRouter.get('/:last_name', async (req, res, next) => {
        const {last_name} = req.params 
        try {
            const newPatientLN = await getPatientByLastName (last_name)
            res.send(newPatientLN)
        } catch (error) {
            console.log("Error getting patientLN!")
            console.log(error)
        }
    });

    // GET/getPatientByDateOfBirth
    appointmentRouter.get('/:date_of_birth', async (req, res, next) => {
        const {date_of_birth} = req.params 
        try {
            const newPatientDOB = await getPatientByDateOfBirth (date_of_birth)
            res.send(newPatientDOB)
        } catch (error) {
            console.log("Error getting patientDOB!")
            console.log(error)
        }
    });

    // GET/getPatientByAddress
    appointmentRouter.get('/:address', async (req, res, next) => {
        const {address} = req.params 
        try {
            const newPatientAddy = await getPatientByAddress (address)
            res.send(newPatientAddy)
        } catch (error) {
            console.log("Error getting patientAddy!")
            console.log(error)
        }
    });

    // GET/getPatientByPhoneNumber
    appointmentRouter.get('/:phone_number', async (req, res, next) => {
        const {phone_number} = req.params 
        try {
            const newPatientPN = await getPatientByPhoneNumber (phone_number)
            res.send(newPatientPN)
        } catch (error) {
            console.log("Error getting patientPN!")
            console.log(error)
        }
    });

    // GET/getPatientByPhoneNumber
    appointmentRouter.get('/:phone_number', async (req, res, next) => {
        const {phone_number} = req.params 
        try {
            const newPatientPN = await getPatientByPhoneNumber (phone_number)
            res.send(newPatientPN)
        } catch (error) {
            console.log("Error getting patientPN!")
            console.log(error)
        }
    });
    
    // GET/getPatientByEmail
    appointmentRouter.get('/:email', async (req, res, next) => {
        const {email} = req.params 
        try {
            const newPatientEmail = await getPatientByEmail (email)
            res.send(newPatientEmail)
        } catch (error) {
            console.log("Error getting patientEmail!")
            console.log(error)
        }
    });

    // GET/getPatientByEmergencyContactName
    appointmentRouter.get('/:emergency_contact_name', async (req, res, next) => {
        const {emergency_contact_name} = req.params 
        try {
            const newPatientEmail = await getPatientByEmergencyContactName (emergency_contact_name)
            res.send(newPatientEmail)
        } catch (error) {
            console.log("Error getting patientEMCName!")
            console.log(error)
        }
    });

    // GET/getPatientByEmergencyContactPhone
    appointmentRouter.get('/:emergency_contact_phone', async (req, res, next) => {
        const {emergency_contact_phone} = req.params 
        try {
            const newPatientEmail = await getPatientByEmergencyContactPhone (emergency_contact_phone)
            res.send(newPatientEmail)
        } catch (error) {
            console.log("Error getting patientEMCPhone!")
            console.log(error)
        }
    });

// Exports
module.exports = {patientRouter};