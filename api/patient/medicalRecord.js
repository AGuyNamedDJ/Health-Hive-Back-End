// Imports
const express = require("express");
const { createMedicalRecord,
    getAllMedicalRecord,
    getMedicalRecordById,
    getMedicalRecordByDiagnosis,
    getMedicalRecordByPatientId,
    getMedicalRecordBySymptom,
    getMedicalRecordByStatus,
    updateMedicalRecord } = require('../../db/patient/MedicalRecord');

const { requireUser, requireActiveUser  } = require('../utilities');

// Router Middleware
const medicalRecordRouter = express.Router();

// Route Handelers
    // Initial medicalRecordRouter
    medicalRecordRouter.use((req, res, next) => {
        console.log("A request is being made to /medicalrecords");
        next();
    });

    // POST/medicalrecord
    medicalRecordRouter.post("/", async (req, res, next) => {
        try {
            const medicalRecord = await getMedicalRecordById(id);

            if (medicalRecord) {
                next({
                    name: "PreExistingRecordError",
                    message: `Medical Record named ${medicalRecord.id} already exists!`,
                    error: "Error! ",
                });
            }
            const newMedicalRecord = await createMedicalRecord({date, time, location, patient_id, staff_id, treatment_id});
            res.send(newMedicalRecord);
        } catch ({ name, message }) {
            next({ name, message });
        }
      });

    // GET/medicalrecord
    medicalRecordRouter.get('/', async (req, res, next) =>{
        try{
            const medicalRecord = await getAllMedicalRecord();
            res.send(medicalRecord) 
        } catch (error) {
            console.log("Error getting all medicalRecord!")
        }
    });

    // GET/getMedicalRecordById 
    medicalRecordRouter.get('/:id', async (req, res, next) => {
        const {id} = req.params 
        try {
            const newMRId = await getMedicalRecordById (id)
            res.send(newMRId)
        } catch (error) {
            console.log("Error getting MRID!")
            console.log(error)
        }
    });

    // GET/getMedicalRecordByDiagnosis
    medicalRecordRouter.get('/:diagnosis', async (req, res, next) => {
        const {diagnosis} = req.params 
        try {
            const newMRDiag = await getMedicalRecordByDiagnosis (diagnosis)
            res.send(newMRDiag)
        } catch (error) {
            console.log("Error getting diagnosis!")
            console.log(error)
        }
    });

    // GET/getMedicalRecordByPatientId
    medicalRecordRouter.get('/:patient_id', async (req, res, next) => {
        const {patient_id} = req.params 
        try {
            const newMRPatId = await getMedicalRecordByPatientId (patient_id)
            res.send(newMRPatId)
        } catch (error) {
            console.log("Error getting patientId!")
            console.log(error)
        }
    });

    // GET/getMedicalRecordBySymptom
    medicalRecordRouter.get('/:staff_id', async (req, res, next) => {
        const {symptoms} = req.params 
        try {
            const newSymptoms = await getMedicalRecordBySymptom (symptoms)
            res.send(newSymptoms)
        } catch (error) {
            console.log("Error getting symptoms!")
            console.log(error)
        }
    });

    // GET/getMedicalRecordByStatus
    medicalRecordRouter.get('/:treatment_id', async (req, res, next) => {
        const {status} = req.params 
        try {
            const newStatus = await getMedicalRecordByStatus (status)
            res.send(newStatus)
        } catch (error) {
            console.log("Error getting Status!")
            console.log(error)
        }
    });

    // PATCH/medicalRecord
    medicalRecordRouter.patch("/:id", async (req, res, next) => {
        try {
            const { id } = req.params;
            const { patient_id, diagnosis, symptoms, status } = req.body;
            const updateFields = { id };

            // Fields;
            if (patient_id) {
                updateFields.patient_id = patient_id;
            } if (diagnosis) {
                updateFields.diagnosis = diagnosis;
            } if (symptoms) {
                updateFields.symptoms = symptoms;
            } if (status) {
                updateFields.status = status;
            }
        
            const medicalRecord = await getMedicalRecordById(id);
            if (!medicalRecord) {
              next({
                name: "MedicalRecordNotFoundError",
                message: `Medical Record with id ${id} not found`,
                error: "Error! ",
              });
            } else {
              if (Object.keys(updateFields).length === 0) {
                next({
                  name: "NoFieldsToUpdate",
                  message: `Enter a field to update.`,
                  error: "Error! ",
                });
              } else {
                const response = await updateMedicalRecord(id, updateFields);
                res.send({ message: "Medical record updated successfully", medicalRecord: response });
              }
            }
          } catch (error) {
            console.error(error);
            next({
              name: "UpdateMedicalRecordError",
              message: "An error occurred while updating the medical record",
              error: error,
            });
          }
        });

    // DELETE /:id
    medicalRecordRouter.delete('/:id', async (req, res, next) => {
        try {
          const medicalRecord = await getMedicalRecordById(req.params.id);
          if (medicalRecord) {
            const updatedMR = await updateMedicalRecord(appointment.id, { isPublic: false });
            res.send({ medicalRecord: updatedMR });
          } else {
            next({
              name: "MedicalRecordNotFoundError",
              message: "That Medical Record does not exist"
            });
          }
        } catch ({ name, message }) {
          next({ name, message });
        }
      });

// Exports
module.exports = {medicalRecordRouter};