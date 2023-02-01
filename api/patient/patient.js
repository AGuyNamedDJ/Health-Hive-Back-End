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

// Router Middleware
const patientRouter = express.Router();

// Route Handelers
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

// Exports
module.exports = {patientRouter};