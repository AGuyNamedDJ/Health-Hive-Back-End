// Imports
const express = require("express");
const { createMedication,
    getAllMedication,
    getMedicationById,
    getMedicationByPharmacy,
    getMedicationByTreatmentId,
    getMedicationByProviderId, 
    updateMedication} = require('../../db/treatment/Medication');

const { requireUser, requireActiveUser  } = require('../utilities');

// Router Middleware
const medicationRouter = express.Router();

// Route Handelers
    // Initial medicationRouter
    medicationRouter.use((req, res, next) => {
        console.log("A request is being made to /medication");
        next();
    });

    // POST/medication
    medicationRouter.post("/", async (req, res, next) => {
        try {
            const medication = await getMedicationById(id);

            if (medication) {
                next({
                    name: "PreExistingMedicationError",
                    message: `Medication named ${medication.id} already exists!`,
                    error: "Error! ",
                });
            }
            const newMedication = await createStaff({name, dosage_form, route, sig, indication, day_supply, start_date, length_of_therapy, refills, pharmacy, treatment_id, provider_id});
            res.send(newMedication);
        } catch ({ name, message }) {
            next({ name, message });
        }
      });

    // GET/medication
    medicationRouter.get('/', async (req, res, next) =>{
        try{
            const med = await getAllMedication();
            res.send(med) 
        } catch (error) {
            console.log("Error getting all meds!")
        }
    });

    // GET/getMedicationById 
    medicationRouter.get('/:id', async (req, res, next) => {
        const {id} = req.params 
        try {
            const newMedID = await getMedicationById (id)
            res.send(newMedID)
        } catch (error) {
            console.log("Error getting medId!")
            console.log(error)
        }
    });

    // GET/getMedicationByPharmacy
    medicationRouter.get('/:pharmacy', async (req, res, next) => {
        const {pharmacy} = req.params 
        try {
            const newPharmacy = await getMedicationByPharmacy (pharmacy)
            res.send(newPharmacy)
        } catch (error) {
            console.log("Error getting pharmacy!")
            console.log(error)
        }
    });

    // GET/getMedicationByTreatmentId
    medicationRouter.get('/:treatment_id', async (req, res, next) => {
        const {treatment_id} = req.params 
        try {
            const newTreatmentId = await getMedicationByTreatmentId (treatment_id)
            res.send(newTreatmentId)
        } catch (error) {
            console.log("Error getting treatment_id!")
            console.log(error)
        }
    });

    // GET/getMedicationByProviderId
    medicationRouter.get('/:provider_id', async (req, res, next) => {
        const {provider_id} = req.params 
        try {
            const newProviderId = await getMedicationByProviderId (provider_id)
            res.send(newProviderId)
        } catch (error) {
            console.log("Error getting providerId!")
            console.log(error)
        }
    });

    // PATCH/medication
    medicationRouter.patch("/:id", async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, dosage_form, route, sig, indication, day_supply, start_date, length_of_therapy, refills, pharmacy, treatment_id, provider_id } = req.body;
            const updateFields = { id };

            // Fields;
            if (name) {
                updateFields.name = name;
            } if (dosage_form) {
                updateFields.dosage_form = dosage_form;
            } if (route) {
                updateFields.route = route;
            } if (sig) {
                updateFields.sig = sig;
            } if (indication) {
                updateFields.indication = indication;
            } if (day_supply) {
                updateFields.day_supply = day_supply;
            } if (start_date) {
                updateFields.start_date = start_date;
            } if (length_of_therapy) {
                updateFields.length_of_therapy = length_of_therapy;
            } if (refills) {
                updateFields.refills = refills;
            } if (pharmacy) {
                updateFields.pharmacy = pharmacy;
            } if (treatment_id) {
                updateFields.treatment_id = treatment_id;
            } if (provider_id) {
                updateFields.provider_id = provider_id;
            };
        
            const medication = await getMedicationById(id);
            if (!medication) {
              next({
                name: "MedicationNotFoundError",
                message: `Medication with id ${id} not found`,
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
                const response = await updateMedication(id, updateFields);
                res.send({ message: "Medication updated successfully", medication: response });
              }
            }
          } catch (error) {
            console.error(error);
            next({
              name: "updateMedicationError",
              message: "An error occurred while updating the medication",
              error: error,
            });
          }
        });

    // DELETE /:id
    medicationRouter.delete('/:id', async (req, res, next) => {
        try {
          const med = await getMedicationById(req.params.id);
          if (med) {
            const updateMedication = await updateMedication(medication.id, { isPublic: false });
            res.send({ staff: updatedStaff });
          } else {
            next({
              name: "updateMedicationError",
              message: "That Medication does not exist"
            });
          }
        } catch ({ name, message }) {
          next({ name, message });
        }
      });

// Exports
module.exports = {medicationRouter};