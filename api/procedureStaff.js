// Imports
const express = require("express");
const { createProcedureStaff,
    getAllProcedureStaff,
    getProcedureStaffById,
    getProcedureStaffByStaffId,
    destroyProcedureStaff,
    updateProcedureStaff } = require('../db/ProcedureStaff');

const { requireUser, requireActiveUser  } = require('./utilities');

// Router Middleware
const procedureStaffRouter = express.Router();

// Route Handelers
    // Initial procedureStaffRouter
    procedureStaffRouter.use((req, res, next) => {
        console.log("A request is being made to /procedureStaff");
        next();
    });

    // POST/procedureStaff
    procedureStaffRouter.post("/", async (req, res, next) => {
        try {
            const procedureStaff = await getProcedureStaffById(id);

            if (procedureStaff) {
                next({
                    name: "PreExistingProcedureStaffError",
                    message: `ProcedureStaff named ${procedureStaff.id} already exists!`,
                    error: "Error! ",
                });
            }
            const newProcedureStaff = await createProcedure({procedure_id, staff_id});
            res.send(newProcedureStaff);
        } catch ({ name, message }) {
            next({ name, message });
        }
      });

    // GET/procedure
    procedureStaffRouter.get('/', async (req, res, next) =>{
        try{
            const procedureStaff = await getAllProcedureStaff();
            res.send(procedureStaff) 
        } catch (error) {
            console.log("Error getting all procedureStaff!")
        }
    });

    // GET/getProcedureById 
    procedureStaffRouter.get('/:id', async (req, res, next) => {
        const {id} = req.params 
        try {
            const newProcedureStaffId = await getProcedureStaffById (id)
            res.send(newProcedureStaffId)
        } catch (error) {
            console.log("Error getting procedureStaffId!")
            console.log(error)
        }
    });

    // GET/getProcedureStaffByStaffId
    procedureStaffRouter.get('/:staff_id', async (req, res, next) => {
        const {staff_id} = req.params 
        try {
            const newStaffId = await getProcedureStaffByStaffId (staff_id)
            res.send(newStaffId)
        } catch (error) {
            console.log("Error getting StaffId!")
            console.log(error)
        }
    });

    // PATCH/procedure
    procedureStaffRouter.patch("/:id", async (req, res, next) => {
        try {
            const { id } = req.params;
            const { procedure_id, staff_id } = req.body;
            const updateFields = { id };

            // Fields;
            if (procedure_id) {
                updateFields.procedure_id = procedure_id;
            } if (staff_id) {
                updateFields.staff_id = staff_id;
            };
        
            const procedureStaff = await getProcedureStaffById(id);
            if (!procedureStaff) {
              next({
                name: "ProcedureStaffNotFoundError",
                message: `ProcedureStaff with id ${id} not found`,
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
                const response = await updateProcedureStaff(id, updateFields);
                res.send({ message: "ProcedureStaff updated successfully", medication: response });
              }
            }
          } catch (error) {
            console.error(error);
            next({
              name: "UpdateProcedureStaffError",
              message: "An error occurred while updating the procedureStaff",
              error: error,
            });
          }
        });

    // DELETE /:id
    procedureStaffRouter.delete('/:id', async (req, res, next) => {
        try {
          const procedureStaff = await getProcedureStaffById(req.params.id);
          if (procedureStaff) {
            const updatedProcedureStaff = await updateProcedureStaff(procedureStaff.id, { isPublic: false });
            res.send({ staff: updatedProcedureStaff });
          } else {
            next({
              name: "UpdateProcedureStaffError",
              message: "That ProcedureStaff does not exist"
            });
          }
        } catch ({ name, message }) {
          next({ name, message });
        }
      });

// Exports
module.exports = {procedureStaffRouter};