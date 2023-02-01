// Requires
const { client } = require('../Index');
const bcrypt = require('bcrypt');

// createProcedure
async function createProcedureStaff({procedure_id, staff_id}) {
    try {
        const { rows: [procedure_staff] } = await client.query(`
            INSERT INTO procedure_staff(procedure_id, staff_id)
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
        `);
        
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

// destroyProcedureStaff
async function destroyProcedureStaff(id){
    try {
        await client.query(`
            DELETE
            FROM procedure_staff
            WHERE "id" = $1;
            `, [id]);
    } catch (error) {
        console.log(error)
    }
};

// updateProcedureStaff
async function updateProcedureStaff(id, fields = {}) {
    const setString = Object.keys(fields)
        .map((key, index) => `"${key}"=$${index + 1}`)
        .join(", ");
  
    if (setString.length === 0) {
        return;
    }
  
    try {
        const { rows: [procedure_staff] } = await client.query(`
            UPDATE procedure_staff
            SET ${setString}
            WHERE "id"='${id}'
            RETURNING *;
        `, Object.values(fields));
  
        return procedure_staff;
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    createProcedureStaff,
    getAllProcedureStaff,
    getProcedureStaffById,
    getProcedureStaffByStaffId,
    destroyProcedureStaff,
    updateProcedureStaff
};
