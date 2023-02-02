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
    // Initial appointmentRouter
    appointmentRouter.use((req, res, next) => {
        console.log("A request is being made to /appointment");
        next();
    });

    // POST/appointment
    appointmentRouter.post("/", async (req, res, next) => {
        try {
            const appointment = await getAppointmentById(id);

            if (appointment) {
                next({
                    name: "PreExistingPatientError",
                    message: `Appointment named ${appointment.id} already exists!`,
                    error: "Error! ",
                });
            }
            const newAppointment = await createPatient({date, time, location, patient_id, staff_id, treatment_id});
            res.send(newAppointment);
        } catch ({ name, message }) {
            next({ name, message });
        }
      });

    // GET/appointment
    appointmentRouter.get('/', async (req, res, next) =>{
        try{
            const patient = await getAllAppointment();
            res.send(patient) 
        } catch (error) {
            console.log("Error getting all appointment!")
        }
    });

    // GET/getAppointmentById 
    appointmentRouter.get('/:id', async (req, res, next) => {
        const {id} = req.params 
        try {
            const newAppointmentId = await getAppointmentById (id)
            res.send(newAppointmentId)
        } catch (error) {
            console.log("Error getting appointmentId!")
            console.log(error)
        }
    });

    // GET/getAppointmentByDate
    appointmentRouter.get('/:date', async (req, res, next) => {
        const {date} = req.params 
        try {
            const newAppointmentDate = await getAppointmentByDate (date)
            res.send(newAppointmentDate)
        } catch (error) {
            console.log("Error getting appointmentDate!")
            console.log(error)
        }
    });

    // GET/getAppointmentByPatientId
    appointmentRouter.get('/:patient_id', async (req, res, next) => {
        const {patient_id} = req.params 
        try {
            const newPatientId = await getAppointmentByPatientId (patient_id)
            res.send(newPatientId)
        } catch (error) {
            console.log("Error getting patientId!")
            console.log(error)
        }
    });

    // GET/getAppointmentByStaffId
    appointmentRouter.get('/:staff_id', async (req, res, next) => {
        const {staff_id} = req.params 
        try {
            const newStaffId = await getAppointmentByStaffId (staff_id)
            res.send(newStaffId)
        } catch (error) {
            console.log("Error getting staffId!")
            console.log(error)
        }
    });

    // GET/getAppointmentByTreatmentId
    appointmentRouter.get('/:treatment_id', async (req, res, next) => {
        const {treatment_id} = req.params 
        try {
            const newTreatmentId = await getAppointmentByTreatmentId (treatment_id)
            res.send(newTreatmentId)
        } catch (error) {
            console.log("Error getting treatmentId!")
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

    // PATCH/postAppointment
    appointmentRouter.patch("/:id", async (req, res, next) => {
        try {
            const { id } = req.params;
            const { date, time, location, patient_id, staff_id, treatment_id } = req.body;
            const updateFields = {};
            updateFields.id = id;

            // Fields;
            if (date) {
                updateFields.date = date;
            } if (time) {
                updateFields.time = time;
            } if (location) {
                updateFields.location = location;
            } if (patient_id) {
                updateFields.patient_id = patient_id;
            } if (staff_id) {
                updateFields.staff_id = staff_id;
            } if (treatment_id) {
                updateFields.treatment_id = treatment_id;
        
            } if (!(await getAppointmentById(id))) {
                next({
                    name: "AppointmentNotFoundError",
                    message: `Appointment named ${id} not found`,
                    error: "Error! ",
                });
            } else {
                const response = await updateAppointment(updateFields);
                
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

    // DELETE /:id
    appointmentRouter.delete('/:id', async (req, res, next) => {
        try {
          const appointment = await getAppointmentById(req.params.id);
          if (appointment) {
            const updatedAppointment = await updateAppointment(appointment.id, { isPublic: false });
            res.send({ appointment: updatedAppointment });
          } else {
            next({
              name: "AppointmentNotFoundError",
              message: "That Appointment does not exist"
            });
          }
        } catch ({ name, message }) {
          next({ name, message });
        }
      });

// Exports
module.exports = {appointmentRouter};