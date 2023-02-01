// Requires
const { client } = require('../Index');
const bcrypt = require('bcrypt');

// createPatient
async function createPatient({first_name, last_name, date_of_birth, gender, address, phone_number, email, emergency_contact_name, emergency_contact_phone}) {
    try {
        const { rows: [patient] } = await client.query(`
            INSERT INTO patient(first_name, last_name, date_of_birth, gender, address, phone_number, email, emergency_contact_name, emergency_contact_phone)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `, [first_name, last_name, date_of_birth, gender, address, phone_number, email, emergency_contact_name, emergency_contact_phone]);
        
        return patient
    } catch (error) {
        console.log(error)
    }
};

// getAllPatient
async function getAllPatient(){
    try {
        const { rows } = await client.query(`
        SELECT id, first_name, last_name, date_of_birth, gender, address, phone_number, email, emergency_contact_name, emergency_contact_phone
        FROM patient;
        `,);
        
        return rows;
    } catch (error) {
        console.log(error)
    }
};

// getPatientById
async function getPatientById(userId) {
    try {
        const { rows: [ patient ] } = await client.query(`
        SELECT *
        FROM patient
        WHERE id= $1;
        `,[userId]);

        if (!patient) {
            return null
        }
        return patient;
    } catch (error) {
        console.log(error)
    }
};

//getPatientByLastName
async function getPatientByLastName(last_name){
    try {
        const { rows: [patient] } = await client.query(`
        SELECT *
        FROM patient
        WHERE last_name=$1;
        `, [last_name])
        return patient
    } catch (error) {
        console.log("Error getting patient by last_name!")
        console.log(error);
    }
};

// getPatientByDateOfBirth
async function getPatientByDateOfBirth(date_of_birth) {
    try{
        const { rows : [patient ] } = await client.query(`
        SELECT *
        FROM patient
        WHERE "date_of_birth"=$1;
        `, [date_of_birth]);

        return patient;
    } catch (error) {
        console.log("Error getting patient by date_of_birth!")
        console.log(error);
    }
};

// getPatientByAddress
async function getPatientByAddress(address) {
    try{
        const { rows : [patient ] } = await client.query(`
        SELECT *
        FROM patient
        WHERE "address"=$1;
        `, [address]);

        return patient;
    } catch (error) {
        console.log("Error getting patient by address!")
        console.log(error);
    }
};

// getPatientByPhoneNumber
async function getPatientByPhoneNumber(phone_number) {
    try{
        const { rows : [patient ] } = await client.query(`
        SELECT *
        FROM patient
        WHERE "phone_number"=$1;
        `, [phone_number]);

        return patient;
    } catch (error) {
        console.log("Error getting patient by phone_number!")
        console.log(error);
    }
};

// getPatientByEmail
async function getPatientByEmail(email) {
    try{
        const { rows : [patient ] } = await client.query(`
        SELECT *
        FROM patient
        WHERE "email"=$1;
        `, [email]);

        return patient;
    } catch (error) {
        console.log("Error getting patient by email!")
        console.log(error);
    }
};

// getPatientByEmergencyContactName
async function getPatientByEmergencyContactName(emergency_contact_name) {
    try{
        const { rows : [patient ] } = await client.query(`
        SELECT *
        FROM patient
        WHERE "emergency_contact_name"=$1;
        `, [emergency_contact_name]);

        return patient;
    } catch (error) {
        console.log("Error getting patient by emergency_contact_name!")
        console.log(error);
    }
};

// getPatientByEmergencyContactPhone
async function getPatientByEmergencyContactPhone(emergency_contact_phone) {
    try{
        const { rows : [patient ] } = await client.query(`
        SELECT *
        FROM patient
        WHERE "emergency_contact_phone"=$1;
        `, [emergency_contact_phone]);

        return patient;
    } catch (error) {
        console.log("Error getting patient by emergency_contact_phone!")
        console.log(error);
    }
};

// updatePatient
async function updatePatient(id, fields = {}) {
    const setString = Object.keys(fields)
        .map((key, index) => `"${key}"=$${index + 1}`)
        .join(", ");
  
    if (setString.length === 0) {
        return;
    }
  
    try {
        const { rows: [patient] } = await client.query(`
            UPDATE patient
            SET ${setString}
            WHERE "id"='${id}'
            RETURNING *;
        `, Object.values(fields));
  
        return patient;
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    createPatient,
    getPatientById,
    getAllPatient,
    getPatientByLastName,
    getPatientByDateOfBirth,
    getPatientByAddress,
    getPatientByPhoneNumber,
    getPatientByEmail,
    getPatientByEmergencyContactName,
    getPatientByEmergencyContactPhone,
    updatePatient
};