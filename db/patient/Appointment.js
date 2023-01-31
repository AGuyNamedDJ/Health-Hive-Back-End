// Requires
const { client } = require('../Index');
const bcrypt = require('bcrypt')

// createAppointment
async function createAppointment({date, time, location, patient_id, staff_id, treatment_Id}) {
    try {
        const { rows: [appointment] } = await client.query(`
            INSERT INTO appointment(date, time, location, patient_id, staff_id, treatment_Id)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [date, time, location, patient_id, staff_id, treatment_Id]);
        
        return appointment
    } catch (error) {
        console.log(error)
    }
};

// getAllAppointment
async function getAllAppointment(){
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM appointment;
        `,);
        
        return rows;
    } catch (error) {
        console.log("Error getting appointments!")
        console.log(error)
    }
};

// getAppointmentById
async function getAppointmentById(id){
    try {
        const { rows: [appointment] } = await client.query(`
        SELECT *
        FROM appointment
        WHERE "id" = $1;
        `, [id]);
        
        return appointment;
    } catch (error) {
        console.log("Error getting appointmentId!")
        console.log(error)
    }
};

// getAppointmentByDate
async function getAppointmentByDate(date){
    try {
        const { rows: [appointment] } = await client.query(`
        SELECT *
        FROM appointment
        WHERE "date" = $1;
        `, [date]);
        
        return appointment;
    } catch (error) {
        console.log("Error getting date!")
        console.log(error)
    }
};

//getAppointmentByPatientId
async function getAppointmentByPatientId(patient_id){
    try {
        const { rows: [appointment] } = await client.query(`
        SELECT *
        FROM appointment
        WHERE "patient_id" = $1;
        `, [patient_id]);
        
        return appointment;
    } catch (error) {
        console.log("Error getting patient_id!")
        console.log(error)
    }
};

// getPatientByStaffId
async function getPatientByStaffId(staff_id){
    try {
        const { rows: [appointment] } = await client.query(`
        SELECT *
        FROM appointment
        WHERE "staff_id" = $1;
        `, [staff_id]);
        
        return appointment;
    } catch (error) {
        console.log("Error getting staff_id!")
        console.log(error)
    }
};

// getPatientByTreatmentId
async function getPatientByTreatmentId(treatment_id){
    try {
        const { rows: [appointment] } = await client.query(`
        SELECT *
        FROM appointment
        WHERE "treatment_id" = $1;
        `, [treatment_id]);
        
        return appointment;
    } catch (error) {
        console.log("Error getting treatment_id!")
        console.log(error)
    }
};



module.exports = {
    createAppointment,
    getAllAppointment,
    getAppointmentById,
    getAppointmentByDate,
    getAppointmentByPatientId,
    getPatientByStaffId,
    getPatientByTreatmentId
};