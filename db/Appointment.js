// Requires
const { client } = require('./Index');
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

// getAppointmentByStaffId
async function getAppointmentByStaffId(staff_id){
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

// getAppointmentByTreatmentId
async function getAppointmentByTreatmentId(treatment_id){
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

// destroyAppointment
async function destroyAppointment(id){
    try {
        await client.query(`
            DELETE
            FROM appointment
            WHERE "id" = $1;
            `, [id]);
    } catch (error) {
        console.log(error)
    }
}

// updateAppointment
async function updateAppointment(id, fields = {}) {
    const setString = Object.keys(fields)
        .map((key, index) => `"${key}"=$${index + 1}`)
        .join(", ");
  
    if (setString.length === 0) {
        return;
    }
  
    try {
        const { rows: [appointment] } = await client.query(`
            UPDATE appointment
            SET ${setString}
            WHERE "id"='${id}'
            RETURNING *;
        `, Object.values(fields));
  
        return appointment;
    } catch (error) {
        console.log(error)
    }
};

// async function testUpdateAppointment() {
//     const id = 1;
//     const fields = {
//         date: '2022-01-01',
//         time: '10:00:00',
//         patient_id: 2,
//         procedure_id: 1
//     };
  
//     try {
//         const updatedAppointment = await updateAppointment(id, fields);
//         console.log(`Appointment with id ${id} was updated successfully:`, updatedAppointment);
//     } catch (error) {
//         console.error(`Error updating appointment with id ${id}:`, error);
//     }
// };

// testUpdateAppointment();

module.exports = {
    createAppointment,
    getAllAppointment,
    getAppointmentById,
    getAppointmentByDate,
    getAppointmentByPatientId,
    getAppointmentByStaffId,
    getAppointmentByTreatmentId,
    destroyAppointment,
    updateAppointment
};