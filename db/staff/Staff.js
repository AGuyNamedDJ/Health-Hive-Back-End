// Requires
const { client } = require('../Index');
const bcrypt = require('bcrypt');

// createStaff
async function createStaff({name, title, specialty, provider_id, email, phone_number}) {
    try {
        const { rows: [staff] } = await client.query(`
            INSERT INTO staff(name, title, specialty, provider_id, email, phone_number)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [name, title, specialty, provider_id, email, phone_number]);
        
        return staff
    } catch (error) {
        console.log(error)
    }
};

// getAllStaff
async function getAllStaff(){
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM staff;
        `,);
        
        return rows;
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

// destroyStaff
async function destroyStaff(id){
    try {
        await client.query(`
            DELETE
            FROM staff
            WHERE "id" = $1;
            `, [id]);
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    createStaff,
    getAllStaff,
    getStaffById,
    getStaffByTitle,
    getStaffBySpecialty,
    getStaffByProviderId,
    destroyStaff
};