// Requires
const { client } = require('../Index');
const bcrypt = require('bcrypt')

// createMedicalRecord
async function createMedicalRecord({patient_id, diagnosis, symptoms, status}) {
    try {
        const { rows: [medical_record] } = await client.query(`
            INSERT INTO medical_record(patient_id, diagnosis, symptoms, status)
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `, [patient_id, diagnosis, symptoms, status]);
        
        return medical_record
    } catch (error) {
        console.log(error)
    }
};

// getAllMedicalRecord
async function getAllMedicalRecord(){
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM medical_record;
        `,);
        
        return rows;
    } catch (error) {
        console.log("Error getting medical_record!")
        console.log(error)
    }
};

// getMedicalRecordById
async function getMedicalRecordById(id){
    try {
        const { rows: [medical_record] } = await client.query(`
        SELECT *
        FROM medical_record
        WHERE "id" = $1;
        `, [id]);
        
        return medical_record;
    } catch (error) {
        console.log("Error getting medical_record!")
        console.log(error)
    }
};

// getMedicalRecordByDiagnosis
async function getMedicalRecordByDiagnosis(diagnosis){
    try {
        const { rows: [medical_record] } = await client.query(`
        SELECT *
        FROM medical_record
        WHERE "diagnosis" = $1;
        `, [diagnosis]);
        
        return appointment;
    } catch (error) {
        console.log("Error getting diagnosis!")
        console.log(error)
    }
};

//getMedicalRecordByPatientId
async function getMedicalRecordByPatientId(patient_id){
    try {
        const { rows: [medical_record] } = await client.query(`
        SELECT *
        FROM medical_record
        WHERE "patient_id" = $1;
        `, [patient_id]);
        
        return medical_record;
    } catch (error) {
        console.log("Error getting patient_id!")
        console.log(error)
    }
};

// getMedicalRecordBySymptom
async function getMedicalRecordBySymptom(symptoms){
    try {
        const { rows: [medical_record] } = await client.query(`
        SELECT *
        FROM medical_record
        WHERE "symptoms" = $1;
        `, [symptoms]);
        
        return medical_record;
    } catch (error) {
        console.log("Error getting symptoms!")
        console.log(error)
    }
};

// getMedicalRecordByStatus
async function getMedicalRecordByStatus(status){
    try {
        const { rows: [medical_record] } = await client.query(`
        SELECT *
        FROM medical_record
        WHERE "status" = $1;
        `, [status]);
        
        return medical_record;
    } catch (error) {
        console.log("Error getting status!")
        console.log(error)
    }
};

// updateMedicalRecord
async function updateMedicalRecord(id, fields = {}) {
    const setString = Object.keys(fields)
        .map((key, index) => `"${key}"=$${index + 1}`)
        .join(", ");
  
    if (setString.length === 0) {
        return;
    }
  
    try {
        const { rows: [medical_record] } = await client.query(`
            UPDATE medical_record
            SET ${setString}
            WHERE "id"='${id}'
            RETURNING *;
        `, Object.values(fields));
  
        return medical_record;
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    createMedicalRecord,
    getAllMedicalRecord,
    getMedicalRecordById,
    getMedicalRecordByDiagnosis,
    getMedicalRecordByPatientId,
    getMedicalRecordBySymptom,
    getMedicalRecordByStatus,
    updateMedicalRecord
};