// Imports
const express = require("express");
const { createProcedure,
    getAllProcedure,
    getProcedureById,
    getProcedureByPatientId,
    getProcedureByTreatmentId,
    getProcedureByStaffId,
    destroyProcedure,
    updateProcedure } = require('../../db/treatment/Procedure');

const { requireUser, requireActiveUser  } = require('../utilities');

// Router Middleware
const procedureRouter = express.Router();

// Route Handelers
    // Initial procedureRouter
    procedureRouter.use((req, res, next) => {
        console.log("A request is being made to /procedure");
        next();
    });

    // POST/procedure
    procedureRouter.post("/", async (req, res, next) => {
        try {
            const procedure = await getProcedureById(id);

            if (procedure) {
                next({
                    name: "PreExistingProcedureError",
                    message: `Procedure named ${procedure.id} already exists!`,
                    error: "Error! ",
                });
            }
            const newProcedure = await createProcedure({name, description, date_performed, patient_id, treatment_id, staff_id});
            res.send(newProcedure);
        } catch ({ name, message }) {
            next({ name, message });
        }
      });

    // GET/procedure
    procedureRouter.get('/', async (req, res, next) =>{
        try{
            const procedure = await getAllProcedure();
            res.send(procedure) 
        } catch (error) {
            console.log("Error getting all procedure!")
        }
    });

    // GET/getProcedureById 
    procedureRouter.get('/:id', async (req, res, next) => {
        const {id} = req.params 
        try {
            const newProcedureId = await getProcedureById (id)
            res.send(newProcedureId)
        } catch (error) {
            console.log("Error getting procedureId!")
            console.log(error)
        }
    });

    // GET/getProcedureByPatientId
    procedureRouter.get('/:patient_id', async (req, res, next) => {
        const {patient_id} = req.params 
        try {
            const newPatientId = await getProcedureByPatientId (patient_id)
            res.send(newPatientId)
        } catch (error) {
            console.log("Error getting PAtientId!")
            console.log(error)
        }
    });

    // GET/getProcedureByTreatmentId
    procedureRouter.get('/:treatment_id', async (req, res, next) => {
        const {treatment_id} = req.params 
        try {
            const newTreatmentId = await getProcedureByTreatmentId (treatment_id)
            res.send(newTreatmentId)
        } catch (error) {
            console.log("Error getting treatment_id!")
            console.log(error)
        }
    });

    // GET/getProcedureByStaffId
    procedureRouter.get('/:staff_id', async (req, res, next) => {
        const {staff_id} = req.params 
        try {
            const newStaffId = await getProcedureByStaffId (staff_id)
            res.send(newStaffId)
        } catch (error) {
            console.log("Error getting staff_id!")
            console.log(error)
        }
    });

    // PATCH/procedure
    procedureRouter.patch("/:id", async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, description, date_performed, patient_id, treatment_id, staff_id } = req.body;
            const updateFields = { id };

            // Fields;
            if (name) {
                updateFields.name = name;
            } if (description) {
                updateFields.description = description;
            } if (date_performed) {
                updateFields.date_performed = date_performed;
            } if (patient_id) {
                updateFields.patient_id = patient_id;
            } if (treatment_id) {
                updateFields.treatment_id = treatment_id;
            } if (staff_id) {
                updateFields.staff_id = staff_id;
            };
        
            const procedure = await getProcedureById(id);
            if (!procedure) {
              next({
                name: "ProcedureNotFoundError",
                message: `Procedure with id ${id} not found`,
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
                const response = await updateProcedure(id, updateFields);
                res.send({ message: "Procedure updated successfully", medication: response });
              }
            }
          } catch (error) {
            console.error(error);
            next({
              name: "UpdateProcedureError",
              message: "An error occurred while updating the procedure",
              error: error,
            });
          }
        });

    // DELETE /:id
    procedureRouter.delete('/:id', async (req, res, next) => {
        try {
          const procedure = await getProcedureById(req.params.id);
          if (procedure) {
            const updatedProcedure = await updateProcedure(procedure.id, { isPublic: false });
            res.send({ staff: updatedProcedure });
          } else {
            next({
              name: "UpdateProcedureError",
              message: "That Procedure does not exist"
            });
          }
        } catch ({ name, message }) {
          next({ name, message });
        }
      });

// Exports
module.exports = {procedureRouter};