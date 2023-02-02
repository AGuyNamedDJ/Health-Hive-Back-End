// Imports
const express = require("express");
const { createStaff,
    getAllStaff,
    getStaffById,
    getStaffByTitle,
    getStaffBySpecialty,
    getStaffByProviderId,
    destroyStaff,
    updateStaff } = require('../../db/staff/Staff');

const { requireUser, requireActiveUser  } = require('../utilities');

// Router Middleware
const staffRouter = express.Router();

// Route Handelers
    // Initial staffRouter
    staffRouter.use((req, res, next) => {
        console.log("A request is being made to /staff");
        next();
    });

    // POST/staff
    staffRouter.post("/", async (req, res, next) => {
        try {
            const staff = await getStaffById(id);

            if (staff) {
                next({
                    name: "PreExistingStaffError",
                    message: `Staff named ${staff.id} already exists!`,
                    error: "Error! ",
                });
            }
            const newStaff = await createStaff({name, title, specialty, provider_id, email, phone_number});
            res.send(newStaff);
        } catch ({ name, message }) {
            next({ name, message });
        }
      });

    // GET/staff
    staffRouter.get('/', async (req, res, next) =>{
        try{
            const staff = await getAllStaff();
            res.send(staff) 
        } catch (error) {
            console.log("Error getting all staff!")
        }
    });

    // GET/getStaffById 
    staffRouter.get('/:id', async (req, res, next) => {
        const {id} = req.params 
        try {
            const newStaffId = await getStaffById (id)
            res.send(newStaffId)
        } catch (error) {
            console.log("Error getting staffId!")
            console.log(error)
        }
    });

    // GET/getStaffByTitle
    staffRouter.get('/:title', async (req, res, next) => {
        const {title} = req.params 
        try {
            const newTitle = await getStaffByTitle (title)
            res.send(newTitle)
        } catch (error) {
            console.log("Error getting title!")
            console.log(error)
        }
    });

    // GET/getStaffBySpecialty
    staffRouter.get('/:specialty', async (req, res, next) => {
        const {specialty} = req.params 
        try {
            const newSpecialty = await getStaffBySpecialty (specialty)
            res.send(newSpecialty)
        } catch (error) {
            console.log("Error getting specialty!")
            console.log(error)
        }
    });

    // GET/getStaffByProviderId
    staffRouter.get('/:provider_id', async (req, res, next) => {
        const {provider_id} = req.params 
        try {
            const newProvider = await getStaffByProviderId (provider_id)
            res.send(newProvider)
        } catch (error) {
            console.log("Error getting providerId!")
            console.log(error)
        }
    });

    // PATCH/staff
    staffRouter.patch("/:id", async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, title, specialty, provider_id, email, phone_number } = req.body;
            const updateFields = { id };

            // Fields;
            if (name) {
                updateFields.name = name;
            } if (title) {
                updateFields.title = title;
            } if (specialty) {
                updateFields.specialty = specialty;
            } if (email) {
                updateFields.email = email;
            } if (phone_number) {
                updateFields.phone_number = phone_number;
            };
        
            const staff = await getStaffById(id);
            if (!staff) {
              next({
                name: "StaffNotFoundError",
                message: `Staff with id ${id} not found`,
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
                const response = await updateStaff(id, updateFields);
                res.send({ message: "Staff updated successfully", staff: response });
              }
            }
          } catch (error) {
            console.error(error);
            next({
              name: "UpdateStaffError",
              message: "An error occurred while updating the staff",
              error: error,
            });
          }
        });

    // DELETE /:id
    staffRouter.delete('/:id', async (req, res, next) => {
        try {
          const staff = await getStaffById(req.params.id);
          if (staff) {
            const updatedStaff = await updateStaff(staff.id, { isPublic: false });
            res.send({ staff: updatedStaff });
          } else {
            next({
              name: "StaffNotFoundError",
              message: "That Staff does not exist"
            });
          }
        } catch ({ name, message }) {
          next({ name, message });
        }
      });

// Exports
module.exports = {staffRouter};