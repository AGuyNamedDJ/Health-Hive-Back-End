// Requires
const { client } = require('../Index');
const bcrypt = require('bcrypt');

// createTreatmentPlan
async function createTreatmentPlan({plan, patient_id, provider_id}) {
    try {
        const { rows: [treatment_plan] } = await client.query(`
            INSERT INTO staff(plan, patient_id, provider_id)
            VALUES($1, $2, $3)
            RETURNING *;
        `, [plan, patient_id, provider_id]);
        
        return treatment_plan
    } catch (error) {
        console.log(error)
    }
};

// getAllTreatmentPlan
async function getAllTreatmentPlan() {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM treatment_plan
            RETURNING *;
        `,);
        
        return treatment_plan
    } catch (error) {
        console.log(error)
    }
};

// getStaffById
async function getStaffById(id) {
    try {
        const { rows: [ staff ] } = await client.query(`
        SELECT *
        FROM staff
        WHERE id= $1;
        `,[id]);

        if (!staff) {
            return null
        }
        return staff;
    } catch (error) {
        console.log(error)
    }
};

// getStaffByTitle
async function getStaffByTitle(title) {
    try {
        const { rows: [ staff ] } = await client.query(`
        SELECT *
        FROM staff
        WHERE title= $1;
        `,[title]);

        return staff;
    } catch (error) {
        console.log(error)
    }
};

// getStaffBySpecialty
async function getStaffBySpecialty(specialty) {
    try {
        const { rows: [ staff ] } = await client.query(`
        SELECT *
        FROM staff
        WHERE specialty= $1;
        `,[specialty]);

        return staff;
    } catch (error) {
        console.log(error)
    }
};

// getStaffByProviderId
async function getStaffByProviderId(provider_Id) {
    try {
        const { rows: [ staff ] } = await client.query(`
        SELECT *
        FROM staff
        WHERE provider_Id= $1;
        `,[provider_Id]);

        return staff;
    } catch (error) {
        console.log(error)
    }
};


module.exports = {
    createTreatmentPlan,
    getAllTreatmentPlan,
};