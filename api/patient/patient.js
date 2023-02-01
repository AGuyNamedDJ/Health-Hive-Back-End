// Imports
const express = require("express");
const { createPatient,
    getPatientById,
    getAllPatient,
    getPatientByLastName,
    getPatientByDateOfBirth,
    getPatientByAddress,
    getPatientByPhoneNumber,
    getPatientByEmail,
    getPatientByEmergencyContactName,
    getPatientByEmergencyContactPhone } = require('../../db/patient/Patient');

    const { requireUser, requireActiveUser  } = require('../utilities');

// Router Middleware
const patientRouter = express.Router();

// Route Handelers
    // Initial patientRouter
    patientRouter.use((req, res, next) => {
        console.log("A request is being made to /patient");
        next();
    });

    // POST/patient
    patientRouter.post("/", async (req, res, next) => {
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
    patientRouter.get('/', async (req, res, next) =>{
        try{
            const patient = await getAllPatient();
            res.send(patient) 
        } catch (error) {
            console.log("Error getting all patient!")
        }
    });

    // GET/getPatientById 
    patientRouter.get('/:id', async (req, res, next) => {
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
    patientRouter.get('/:last_name', async (req, res, next) => {
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
    patientRouter.get('/:date_of_birth', async (req, res, next) => {
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
    patientRouter.get('/:address', async (req, res, next) => {
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
    patientRouter.get('/:phone_number', async (req, res, next) => {
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
    patientRouter.get('/:phone_number', async (req, res, next) => {
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
    patientRouter.get('/:email', async (req, res, next) => {
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
    patientRouter.get('/:emergency_contact_name', async (req, res, next) => {
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
    patientRouter.get('/:emergency_contact_phone', async (req, res, next) => {
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