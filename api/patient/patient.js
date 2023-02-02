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
    getPatientByEmergencyContactPhone, 
    updatePatient } = require('../../db/patient/Patient');

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
            const patient = await getPatientById(id);

            if (patient) {
                next({
                    name: "PreExistingPatientError",
                    message: `Patient named ${patient.id} already exists!`,
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

    // PATCH/postPatient
    patientRouter.patch("/:id", async (req, res, next) => {
        try {
            const { id } = req.params;
            const { first_name, last_name, date_of_birth, gender, address, phone_number, email, emergency_contact_name, emergency_contact_phone } = req.body;
            const updateFields = {};
            updateFields.id = id;

            // Fields;
            if (first_name) {
                updateFields.first_name = first_name;
            } if (last_name) {
                updateFields.last_name = last_name;
            } if (date_of_birth) {
                updateFields.date_of_birth = date_of_birth;
            } if (gender) {
                updateFields.gender = gender;
            } if (address) {
                updateFields.address = address;
            } if (phone_number) {
                updateFields.phone_number = phone_number;
            } if (email) {
                updateFields.email = email;
            } if (emergency_contact_name) {
                updateFields.emergency_contact_name = emergency_contact_name;
            } if (emergency_contact_phone) {
                updateFields.emergency_contact_phone = emergency_contact_phone;
        
            } if (!(await getPatientById(id))) {
                next({
                    name: "PatientNotFoundError",
                    message: `Patient named ${id} not found`,
                    error: "Error! ",
                });
            } else {
                const response = await updatePatient(updateFields);
                
                if (response) {
                    res.send(response);
                } else {
                    next({
                        name: "NoFieldsToUpdate",
                        message: `Enter a field to update.`,
                        error: "Error! ",
                    });
                }
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    });

// Exports
module.exports = {patientRouter};