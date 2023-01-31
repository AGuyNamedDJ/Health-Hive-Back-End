// Requires
const { client } = require('../Index');
const bcrypt = require('bcrypt');

// createProcedure
async function createProcedureStaff({procedure_id, staff_id}) {
    try {
        const { rows: [procedure_staff] } = await client.query(`
            INSERT INTO procedure_staff(procedure_id staff_id)
            VALUES($1, $2)
            RETURNING *;
        `, [procedure_id, staff_id]);
        
        return procedure_staff
    } catch (error) {
        console.log(error)
    }
};

// getAllProcedureStaff
async function getAllProcedureStaff() {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM procedure_staff;
        `,);
        
        return rows
    } catch (error) {
        console.log(error)
    }
};

// getProcedureStaffById
async function getProcedureStaffById(id) {
    try {
        const { rows: [ procedure_staff ] } = await client.query(`
        SELECT *
        FROM procedure_staff
        WHERE id= $1;
        `,[id]);

        if (!procedure_staff) {
            return null
        }
        return procedure_staff;
    } catch (error) {
        console.log(error)
    }
};

// getProcedureStaffByStaffId
async function getProcedureStaffByStaffId(staff_id) {
    try {
        const { rows: [ procedure_staff ] } = await client.query(`
        SELECT *
        FROM procedure_staff
        WHERE staff_id= $1;
        `,[staff_id]);

        return procedure_staff;
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    createProcedureStaff,
    getAllProcedureStaff,
    getProcedureStaffById,
    getProcedureStaffByStaffId
};