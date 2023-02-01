// Requires
const { client } = require('../Index');
const bcrypt = require('bcrypt');

// createMedication
async function createMedication({name, dosage_form, route, sig, indication, day_supply, start_date, length_of_therapy, refills, pharmacy, treatment_id, provider_id}) {
    try {
        const { rows: [medication] } = await client.query(`
            INSERT INTO medication(name, dosage_form, route, sig, indication, day_supply, start_date, length_of_therapy, refills, pharmacy, treatment_id, provider_id)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *;
        `, [name, dosage_form, route, sig, indication, day_supply, start_date, length_of_therapy, refills, pharmacy, treatment_id, provider_id]);
        
        return medication
    } catch (error) {
        console.log(error)
    }
};

// getAllMedication
async function getAllMedication() {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM medication;
        `,);
        
        return rows
    } catch (error) {
        console.log(error)
    }
};

// getMedicationById
async function getMedicationById(id) {
    try {
        const { rows: [ medication ] } = await client.query(`
        SELECT *
        FROM medication
        WHERE id= $1;
        `,[id]);

        if (!medication) {
            return null
        }
        return medication;
    } catch (error) {
        console.log(error)
    }
};

// getMedicationByPharmacy
async function getMedicationByPharmacy(pharmacy) {
    try {
        const { rows: [ medication ] } = await client.query(`
        SELECT *
        FROM medication
        WHERE pharmacy= $1;
        `,[pharmacy]);

        return medication;
    } catch (error) {
        console.log(error)
    }
};

// getMedicationByTreatmentId
async function getMedicationByTreatmentId(treatment_id) {
    try {
        const { rows: [ medication ] } = await client.query(`
        SELECT *
        FROM medication
        WHERE treatment_id= $1;
        `,[treatment_id]);

        return medication;
    } catch (error) {
        console.log(error)
    }
};

// getMedicationByProviderId
async function getMedicationByProviderId(provider_id) {
    try {
        const { rows: [ medication ] } = await client.query(`
        SELECT *
        FROM medication
        WHERE provider_id= $1;
        `,[provider_id]);

        return medication;
    } catch (error) {
        console.log(error)
    }
};

// updateMedication
async function updateMedication(id, fields = {}) {
    const setString = Object.keys(fields)
        .map((key, index) => `"${key}"=$${index + 1}`)
        .join(", ");
  
    if (setString.length === 0) {
        return;
    }
  
    try {
        const { rows: [medication] } = await client.query(`
            UPDATE medication
            SET ${setString}
            WHERE "id"='${id}'
            RETURNING *;
        `, Object.values(fields));
  
        return medication;
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    createMedication,
    getAllMedication,
    getMedicationById,
    getMedicationByPharmacy,
    getMedicationByTreatmentId,
    getMedicationByProviderId,
    updateMedication
};