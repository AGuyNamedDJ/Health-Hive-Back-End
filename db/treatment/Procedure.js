// Requires
const { client } = require('../Index');
const bcrypt = require('bcrypt');

// createProcedure
async function createProcedure({name, description, date_performed, patient_id, treatment_id, staff_id}) {
    try {
        const { rows: [procedure] } = await client.query(`
            INSERT INTO procedure(name, description, date_performed, patient_id, treatment_id, staff_id)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [name, description, date_performed, patient_id, treatment_id, staff_id]);
        
        return procedure
    } catch (error) {
        console.log(error)
    }
};

// getAllProcedure
async function getAllProcedure() {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM procedure;
        `,);
        
        return rows
    } catch (error) {
        console.log(error)
    }
};

// getProcedureById
async function getProcedureById(id) {
    try {
        const { rows: [ procedure ] } = await client.query(`
        SELECT *
        FROM procedure
        WHERE id= $1;
        `,[id]);

        if (!procedure) {
            return null
        }
        return procedure;
    } catch (error) {
        console.log(error)
    }
};

// getProcedureByPatientId
async function getProcedureByPatientId(patient_id) {
    try {
        const { rows: [ procedure ] } = await client.query(`
        SELECT *
        FROM procedure
        WHERE patient_id= $1;
        `,[patient_id]);

        return procedure;
    } catch (error) {
        console.log(error)
    }
};

// getProcedureByTreatmentId
async function getProcedureByTreatmentId(treatment_id) {
    try {
        const { rows: [ procedure ] } = await client.query(`
        SELECT *
        FROM procedure
        WHERE treatment_id= $1;
        `,[treatment_id]);

        return procedure;
    } catch (error) {
        console.log(error)
    }
};

// getProcedureByStaffId
async function getProcedureByStaffId(staff_id) {
    try {
        const { rows: [ procedure ] } = await client.query(`
        SELECT *
        FROM procedure
        WHERE staff_id= $1;
        `,[staff_id]);

        return procedure;
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    createProcedure,
    getAllProcedure,
    getProcedureById,
    getProcedureByPatientId,
    getProcedureByTreatmentId,
    getProcedureByStaffId
};