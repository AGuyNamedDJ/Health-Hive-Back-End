// Imports
const express = require("express");
const { createTreatmentPlan,
    getAllTreatmentPlan,
    getTreatmentPlanById,
    getTreatmentPlanByPatientId,
    getTreatmentPlanByProviderId,
    destroyTreatmentPlan,
    updateTreatmentPlan } = require('../db/TreatmentPlan');

const { requireUser, requireActiveUser  } = require('./utilities');

// Router Middleware
const treatmentPlanRouter = express.Router();

// Route Handelers
    // Initial treatmentPlanRouter
    treatmentPlanRouter.use((req, res, next) => {
        console.log("A request is being made to /treatmentplan");
        next();
    });

    // POST/procedureStaff
    treatmentPlanRouter.post("/", async (req, res, next) => {
        try {
            const treatmentPlan = await getTreatmentPlanById(id);

            if (treatmentPlan) {
                next({
                    name: "PreExistingTreatmentPlanError",
                    message: `TreatmentPlan named ${treatmentPlan.id} already exists!`,
                    error: "Error! ",
                });
            }
            const newTP = await createTreatmentPlan({treatmentPlan, staff_id});
            res.send(newTP);
        } catch ({ name, message }) {
            next({ name, message });
        }
      });

    // GET/procedure
    treatmentPlanRouter.get('/', async (req, res, next) =>{
        try{
            const tP = await getAllTreatmentPlan();
            res.send(tP) 
        } catch (error) {
            console.log("Error getting all treatmentplan!")
        }
    });

    // GET/getTreatmentPlanById 
    treatmentPlanRouter.get('/:id', async (req, res, next) => {
        const {id} = req.params 
        try {
            const newTPId = await getTreatmentPlanById (id)
            res.send(newTPId)
        } catch (error) {
            console.log("Error getting treatmentPlanId!")
            console.log(error)
        }
    });

    // GET/getTreatmentPlanByPatientId
    treatmentPlanRouter.get('/:patient_id', async (req, res, next) => {
        const {patient_id} = req.params 
        try {
            const newPatientId = await getTreatmentPlanByPatientId (patient_id)
            res.send(newPatientId)
        } catch (error) {
            console.log("Error getting PatientId!")
            console.log(error)
        }
    });

    // GET/getTreatmentPlanByProviderId
    treatmentPlanRouter.get('/:provider_id', async (req, res, next) => {
        const {provider_id} = req.params 
        try {
            const newProviderId = await getTreatmentPlanByProviderId (provider_id)
            res.send(newProviderId)
        } catch (error) {
            console.log("Error getting ProviderId!")
            console.log(error)
        }
    });

    // PATCH/procedure
    treatmentPlanRouter.patch("/:id", async (req, res, next) => {
        try {
            const { id } = req.params;
            const { plan, patient_id, provider_id } = req.body;
            const updateFields = {};

            // Fields;
            if (plan) {
                updateFields.plan = plan;
            } if (patient_id) {
                updateFields.patient_id = patient_id;
            } if (provider_id) {
                updateFields.provider_id = provider_id;
            };
        
            const treatmentPlan = await getTreatmentPlanById(id);
            if (!treatmentPlan) {
              next({
                name: "TreatmentPlanNotFoundError",
                message: `TreatmentPlan with id ${id} not found`,
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
                const response = await updateTreatmentPlan(id, updateFields);
                res.send({ message: "TreatmentPlan updated successfully", medication: response });
              }
            }
          } catch (error) {
            console.error(error);
            next({
              name: "UpdateTreatmentPlanError",
              message: "An error occurred while updating the treatmentPlan",
              error: error,
            });
          }
        });

    // DELETE /:id
    treatmentPlanRouter.delete('/:id', async (req, res, next) => {
        try {
          const treatmentPlan = await getTreatmentPlanById(req.params.id);
          if (treatmentPlan) {
            const updatedTreatmentPlan = await updateTreatmentPlan(treatmentPlan.id, { isPublic: false });
            res.send({ staff: updatedTreatmentPlan });
          } else {
            next({
              name: "UpdatedTreatmentPlanError",
              message: "That TreatmentPlan does not exist"
            });
          }
        } catch ({ name, message }) {
          next({ name, message });
        }
      });

// Exports
module.exports = {treatmentPlanRouter};