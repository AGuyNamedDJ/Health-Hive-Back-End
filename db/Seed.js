// Step 1: Import Client & Exports;
const { create } = require('domain');
const { client } = require('./Index');

// Page Imports;
const { createUsers, getAllUsers } = require('./Users');

    // Patient Imports;
    const { createPatient,
        getPatientById,
        getAllPatient,
        getPatientByLastName,
        getPatientByDateOfBirth,
        getPatientByAddress,
        getPatientByPhoneNumber,
        getPatientByEmail,
        getPatientByEmergencyContactName,
        getPatientByEmergencyContactPhone,
        updatePatient } = require('./Patient');

    const { createAppointment,
        getAllAppointment,
        getAppointmentById,
        getAppointmentByDate,
        getAppointmentByPatientId,
        getAppointmentByStaffId,
        getAppointmentByTreatmentId,
        destroyAppointment,
        updateAppointment } = require('./Appointment');
    
    const { createMedicalRecord,
        getAllMedicalRecord,
        getMedicalRecordById,
        getMedicalRecordByDiagnosis,
        getMedicalRecordByPatientId,
        getMedicalRecordBySymptom,
        getMedicalRecordByStatus,
        updateMedicalRecord } = require('./MedicalRecord');

    // Staff Imports;
    const { createStaff,
        getAllStaff,
        getStaffById,
        getStaffByTitle,
        getStaffBySpecialty,
        getStaffByProviderId,
        destroyStaff,
        updateStaff } = require('./Staff');

    // Treatment Imports;
    const { createTreatmentPlan,
        getAllTreatmentPlan,
        getTreatmentPlanById,
        getTreatmentPlanByPatientId,
        getTreatmentPlanByProviderId,
        destroyTreatmentPlan,
        updateTreatmentPlan } =require('./TreatmentPlan');

    const { createMedication,
        getAllMedication,
        getMedicationById,
        getMedicationByPharmacy,
        getMedicationByTreatmentId,
        getMedicationByProviderId,
        updateMedication } =require('./Medication');

    const { createProcedure,
        getAllProcedure,
        getProcedureById,
        getProcedureByPatientId,
        getProcedureByTreatmentId,
        getProcedureByStaffId,
        destroyProcedure,
        updateProcedure } = require('./Procedure');

    const { createProcedureStaff,
        getAllProcedureStaff,
        getProcedureStaffById,
        getProcedureStaffByStaffId,
        destroyProcedureStaff,
        updateProcedureStaff } =require('./ProcedureStaff');

        // console.log(__dirname);


// Step 2: Users Methods;
    // Method: Drop Tables;
    async function dropTables(){
        try {
            console.log('Dropping tables... ');
            await client.query(`
            DROP TABLE IF EXISTS procedure_staff CASCADE;
            DROP TABLE IF EXISTS procedure CASCADE;
            DROP TABLE IF EXISTS treatment_plan CASCADE;
            DROP TABLE IF EXISTS medication CASCADE;
            DROP TABLE IF EXISTS staff CASCADE;
            DROP TABLE IF EXISTS medical_record CASCADE;
            DROP TABLE IF EXISTS appointment CASCADE;
            DROP TABLE IF EXISTS patient CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
            `)
            console.log('Finished dropping tables.')
        } catch(error){
            console.log('Error dropping tables!')
            console.log(error)
        }
    };

    // Method: Create Tables:
    async function createTables() {
        try {
            console.log('Starting to build tables...');
            await client.query(`
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                username VARCHAR(25) UNIQUE NOT NULL,
                password VARCHAR(25) NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                "is_active" BOOLEAN DEFAULT true
            );
            CREATE TABLE patient(
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(25) NOT NULL,
                last_name VARCHAR(25) NOT NULL,
                date_of_birth DATE NOT NULL,
                gender VARCHAR(10) NOT NULL,
                address VARCHAR(100) NOT NULL,
                phone_number VARCHAR(10) NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                emergency_contact_name VARCHAR(50) NOT NULL,
                emergency_contact_phone VARCHAR(10) NOT NULL
            );
            CREATE TABLE staff(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NULL,
                title VARCHAR(100) NULL,
                specialty VARCHAR(100) NOT NULL,
                provider_id INTEGER UNIQUE NULL,
                email VARCHAR(50) NOT NULL,
                phone_number VARCHAR(10) NOT NULL
            );
            CREATE TABLE treatment_plan(
                id SERIAL PRIMARY KEY,
                plan TEXT NOT NULL,
                patient_id INTEGER REFERENCES patient(id),
                provider_id INTEGER REFERENCES staff(provider_id),
                FOREIGN KEY (provider_id) REFERENCES staff(provider_id)
              );              
              CREATE TABLE appointment(
                id SERIAL PRIMARY KEY,
                date TIMESTAMP NOT NULL,
                time TIME NOT NULL,
                location VARCHAR(100) NOT NULL,
                patient_id INTEGER REFERENCES patient(id),
                staff_id INTEGER REFERENCES staff(id) DEFAULT NULL,
                treatment_id INTEGER REFERENCES treatment_plan(id) DEFAULT NULL
            );
            CREATE TABLE medical_record (
                id SERIAL PRIMARY KEY,
                patient_id INTEGER REFERENCES patient(id),
                diagnosis VARCHAR(500) NOT NULL,
                symptoms TEXT NOT NULL,
                status VARCHAR(25) NOT NULL DEFAULT 'Alive'
            );
            CREATE TABLE medication(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                dosage_form VARCHAR(25) NOT NULL,
                route VARCHAR(100) NOT NULL,
                sig VARCHAR(500) NOT NULL,
                indication VARCHAR(500) NOT NULL,
                day_supply VARCHAR(20) NOT NULL,
                start_date DATE NOT NULL,
                length_of_therapy VARCHAR(25) NOT NULL,
                refills INTEGER NOT NULL,
                pharmacy VARCHAR(100) DEFAULT NULL,
                treatment_id INTEGER REFERENCES treatment_plan(id) DEFAULT NULL,
                provider_id INTEGER REFERENCES staff(provider_id)
            );
            CREATE TABLE procedure(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT NOT NULL,
                date_performed DATE NOT NULL,
                patient_id INTEGER REFERENCES patient(id),
                treatment_id INTEGER REFERENCES treatment_plan(id),
                staff_id INTEGER REFERENCES staff(id)
            );
            CREATE TABLE procedure_staff(
                id SERIAL PRIMARY KEY,
                procedure_id INTEGER REFERENCES procedure(id),
                staff_id INTEGER REFERENCES staff(id),
                UNIQUE (procedure_id, staff_id)
            );                  
            `);
            console.log('Finished building tables.');
            } catch (error) {
            console.error('Error building tables!');
            console.log(error);
            }
        };

    // Method: createInitialUsers;
    async function createInitialUsers() {
        console.log('Starting to create users...')
        try {
            await createUsers({
                username: 'admin',
                password: 'admin',
                email: 'admin@healthhive.com',
            });
            await createUsers({
                username: 'guest',
                password: 'guest',
                email: 'guest@healthhive.com',
            });
            console.log('Finished creating users.');
        } catch (error) {
            console.error('Error when creating users!');
            console.log(error);
        }
    };

    // Method: createInitialPatient;
    async function createInitialPatient() {
        console.log('Starting to create patient...')
        try {
            await createPatient({
                first_name: 'John',
                last_name: 'Smith',
                date_of_birth: '1997-06-15',
                gender: 'male',
                address: '283 W Kennedy Dr, Chicago, IL, 60605',
                phone_number: '7084684948',
                email: 'jsmith97@gmail.com',
                emergency_contact_name: 'Sheryl Smith',
                emergency_contact_phone: '7081664345'
            });
            await createPatient({
                first_name: 'Emily',
                last_name: 'Johnson',
                date_of_birth: '1999-03-12',
                gender: 'female',
                address: '456 Park Ave, New York, NY, 10022',
                phone_number: '2125557777',
                email: 'emilyj99@gmail.com',
                emergency_contact_name: 'William Johnson',
                emergency_contact_phone: '2125554444'
            });
            await createPatient({
                first_name: 'Olivia',
                last_name: 'Brown',
                date_of_birth: '2023-02-03',
                gender: 'female',
                address: '789 Main St, Los Angeles, CA, 90001',
                phone_number: '2135551111',
                email: 'oliviab23@gmail.com',
                emergency_contact_name: 'James Brown',
                emergency_contact_phone: '2135552222'
            });
            await createPatient({
                first_name: 'William',
                last_name: 'Davis',
                date_of_birth: '1953-07-18',
                gender: 'male',
                address: '123 Lake Shore Dr, Chicago, IL, 60601',
                phone_number: '3125553333',
                email: 'williamd53@gmail.com',
                emergency_contact_name: 'Emily Davis',
                emergency_contact_phone: '3125554444'
            });
            await createPatient({
                first_name: 'Isabella',
                last_name: 'Wilson',
                date_of_birth: '1997-05-12',
                gender: 'female',
                address: '567 W Jackson Blvd, Chicago, IL, 60661',
                phone_number: '3125556666',
                email: 'isabellaw97@gmail.com',
                emergency_contact_name: 'Michael Wilson',
                emergency_contact_phone: '3125557777'
            });
            await createPatient({
                first_name: 'Alexander',
                last_name: 'Smith',
                date_of_birth: '1980-08-15',
                gender: 'male',
                address: '456 Park Ave, New York, NY, 10022',
                phone_number: '2125559999',
                email: 'alexanders80@gmail.com',
                emergency_contact_name: 'Emily Smith',
                emergency_contact_phone: '2125550000'
            });
            await createPatient({
                first_name: 'Ava',
                last_name: 'Jones',
                date_of_birth: '2000-01-01',
                gender: 'female',
                address: '789 Elm St, Cambridge, MA, 02138',
                phone_number: '6175551111',
                email: 'avaj00@gmail.com',
                emergency_contact_name: 'William Jones',
                emergency_contact_phone: '6175552222'
            });
            await createPatient({
                first_name: 'Ethan',
                last_name: 'Green',
                date_of_birth: '1950-06-01',
                gender: 'male',
                address: '456 University Ave, Palo Alto, CA, 94301',
                phone_number: '6505553333',
                email: 'ethang50@gmail.com',
                emergency_contact_name: 'Isabella Green',
                emergency_contact_phone: '6505554444'
            });
            await createPatient({
                first_name: 'Sophia',
                last_name: 'Lee',
                date_of_birth: '1997-12-01',
                gender: 'female',
                address: '789 Market St, San Francisco, CA, 94102',
                phone_number: '4155551111',
                email: 'sophial97@gmail.com',
                emergency_contact_name: 'Alexander Lee',
                emergency_contact_phone: '4155552222'
            });
            await createPatient({
                first_name: 'Mason',
                last_name: 'Young',
                date_of_birth: '1990-03-15',
                gender: 'male',
                address: '456 Howard St, San Francisco, CA, 94105',
                phone_number: '4155553333',
                email: 'masony90@gmail.com',
                emergency_contact_name: 'Ava Young',
                emergency_contact_phone: '4155554444'
            });
            await createPatient({
                first_name: 'Noah',
                last_name: 'Brown',
                date_of_birth: '1995-09-01',
                gender: 'male',
                address: '123 Michigan Ave, Chicago, IL, 60601',
                phone_number: '3125551111',
                email: 'noahb95@gmail.com',
                emergency_contact_name: 'Sophia Brown',
                emergency_contact_phone: '3125552222'
            });
            await createPatient({
                first_name: 'Liam',
                last_name: 'Miller',
                date_of_birth: '1993-05-01',
                gender: 'male',
                address: '789 First St, Houston, TX, 77001',
                phone_number: '8329551111',
                email: 'liamm93@gmail.com',
                emergency_contact_name: 'Ethan Miller',
                emergency_contact_phone: '8329552222'
            });
            await createPatient({
                first_name: 'Emma',
                last_name: 'Davis',
                date_of_birth: '1992-07-01',
                gender: 'female',
                address: '456 Second Ave, Miami, FL, 33131',
                phone_number: '3057551111',
                email: 'emmad92@gmail.com',
                emergency_contact_name: 'Noah Davis',
                emergency_contact_phone: '3057552222'
            });
            await createPatient({
                first_name: 'Avery',
                last_name: 'Anderson',
                date_of_birth: '1998-02-01',
                gender: 'male',
                address: 'Apt 123, 789 Third St, Washington, DC, 20002',
                phone_number: '2022551111',
                email: 'averya98@gmail.com',
                emergency_contact_name: 'Liam Anderson',
                emergency_contact_phone: '2022552222'
            });
            await createPatient({
                first_name: 'Evelyn',
                last_name: 'Taylor',
                date_of_birth: '1996-12-01',
                gender: 'female',
                address: 'Apt 456, 789 Fourth Ave, Seattle, WA, 98104',
                phone_number: '2065055111',
                email: 'evelynt96@gmail.com',
                emergency_contact_name: 'Emma Taylor',
                emergency_contact_phone: '2065055222'
            });
            await createPatient({
                first_name: 'Abigail',
                last_name: 'Johnson',
                date_of_birth: '1995-06-01',
                gender: 'female',
                address: '123 Oak St, Chicago, IL, 60601',
                phone_number: '3125557777',
                email: 'abigailj95@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '3125558888'
            });
            await createPatient({
                first_name: 'Isabelle',
                last_name: 'Wilson',
                date_of_birth: '1980-12-01',
                gender: 'female',
                address: '8262 Oak St, Chicago, IL, 60601',
                phone_number: '3125559999',
                email: 'isabellew80@gmail.com',
                emergency_contact_name: 'Evelyn Wilson',
                emergency_contact_phone: '3125560000'
            });
            await createPatient({
                first_name: 'Mila',
                last_name: 'Moore',
                date_of_birth: '1985-03-01',
                gender: 'female',
                address: '9463 Elm St, Chicago, IL, 60601',
                phone_number: '8725551111',
                email: 'milam85@gmail.com',
                emergency_contact_name: 'Abigail Moore',
                emergency_contact_phone: '8725552222'
            });
            await createPatient({
                first_name: 'Aurora',
                last_name: 'Anderson',
                date_of_birth: '1950-01-01',
                gender: 'female',
                address: '7452 Oak St, Chicago, IL, 60601',
                phone_number: '3125553333',
                email: 'auroraa50@gmail.com',
                emergency_contact_name: 'Mila Anderson',
                emergency_contact_phone: '3125554444'
            });
            await createPatient({
                first_name: 'Eleanor',
                last_name: 'Thomas',
                date_of_birth: '1960-05-01',
                gender: 'female',
                address: '6343 Elm St, Chicago, IL, 60601',
                phone_number: '3125556666',
                email: 'eleanort60@gmail.com',
                emergency_contact_name: 'Aurora Thomas',
                emergency_contact_phone: '3125557777'
            });
            await createPatient({
                first_name: 'Aria',
                last_name: 'Moore',
                date_of_birth: '1970-07-01',
                gender: 'female',
                address: '5234 Maple St, Evanston, IL, 60201',
                phone_number: '8477551111',
                email: 'ariam70@gmail.com',
                emergency_contact_name: 'Eleanor Moore',
                emergency_contact_phone: '8477552222'
            });
            await createPatient({
                first_name: 'Scarlett',
                last_name: 'Wilson',
                date_of_birth: '1965-09-01',
                gender: 'female',
                address: '4356 Pine St, Oak Park, IL, 60302',
                phone_number: '7085551111',
                email: 'scarlettw65@gmail.com',
                emergency_contact_name: 'Aria Wilson',
                emergency_contact_phone: '7085552222'
            });
            await createPatient({
                first_name: 'Natalie',
                last_name: 'Johnson',
                date_of_birth: '1980-11-01',
                gender: 'female',
                address: '6789 Main St, Los Angeles, CA, 90001',
                phone_number: '2135551111',
                email: 'nataliej80@gmail.com',
                emergency_contact_name: 'Scarlett Johnson',
                emergency_contact_phone: '2135552222'
            });
            await createPatient({
                first_name: 'Charlotte',
                last_name: 'Williams',
                date_of_birth: '1985-04-01',
                gender: 'female',
                address: '1234 Park Ave, Dallas, TX, 75201',
                phone_number: '2146551111',
                email: 'charlottew85@gmail.com',
                emergency_contact_name: 'Natalie Williams',
                emergency_contact_phone: '2146552222'
            });
            await createPatient({
                first_name: 'Aurora',
                last_name: 'Smith',
                date_of_birth: '1995-06-01',
                gender: 'female',
                address: '7452 Maple St, Dallas, TX, 75201',
                phone_number: '2146553333',
                email: 'auroras95@gmail.com',
                emergency_contact_name: 'Avery Smith',
                emergency_contact_phone: '2146554444'
            });
            await createPatient({
                first_name: 'Evelyn',
                last_name: 'Brown',
                date_of_birth: '1997-07-01',
                gender: 'female',
                address: '6343 Pine St, Los Angeles, CA, 90001',
                phone_number: '2135556666',
                email: 'evelynb97@gmail.com',
                emergency_contact_name: 'Aurora Brown',
                emergency_contact_phone: '2135557777'
            });
            await createPatient({
                first_name: 'Isabelle',
                last_name: 'Davis',
                date_of_birth: '1999-12-01',
                gender: 'female',
                address: '5234 Elm St, San Francisco, CA, 94102',
                phone_number: '4155551111',
                email: 'isabelled99@gmail.com',
                emergency_contact_name: 'Evelyn Davis',
                emergency_contact_phone: '4155552222'
            });
            await createPatient({
                first_name: 'Aria',
                last_name: 'Miller',
                date_of_birth: '1997-06-01',
                gender: 'female',
                address: '9463 Pine St, Chicago, IL, 60601',
                phone_number: '3125559999',
                email: 'ariam97@gmail.com',
                emergency_contact_name: 'Isabelle Miller',
                emergency_contact_phone: '3125560000'
            });
            await createPatient({
                first_name: 'Natalie',
                last_name: 'Wilson',
                date_of_birth: '2000-11-01',
                gender: 'female',
                address: '6789 Elm St, Seattle, WA, 98102',
                phone_number: '2065551111',
                email: 'nataliew00@gmail.com',
                emergency_contact_name: 'Aria Wilson',
                emergency_contact_phone: '2065552222'
            });
            await createPatient({
                first_name: 'Eleanor',
                last_name: 'Anderson',
                date_of_birth: '1999-05-01',
                gender: 'female',
                address: '4356 Oak St, Chicago, IL, 60601',
                phone_number: '3125553333',
                email: 'eleanora99@gmail.com',
                emergency_contact_name: 'Natalie Anderson',
                emergency_contact_phone: '3125554444'
            });
            await createPatient({
                first_name: 'Avery',
                last_name: 'Thomas',
                date_of_birth: '1998-06-01',
                gender: 'female',
                address: '7452 Elm St, Evanston, IL, 60201',
                phone_number: '8477551111',
                email: 'averyt98@gmail.com',
                emergency_contact_name: 'Eleanor Thomas',
                emergency_contact_phone: '8477552222'
            });
            await createPatient({
                first_name: 'Scarlett',
                last_name: 'Johnson',
                date_of_birth: '1997-09-01',
                gender: 'female',
                address: '6343 Oak St, Plano, TX, 75075',
                phone_number: '9727551111',
                email: 'scarlettj97@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '9727552222'
            });
            await createPatient({
                first_name: 'Evelyn',
                last_name: 'Davis',
                date_of_birth: '1998-07-01',
                gender: 'female',
                address: '5234 Pine St, Wheaton, IL, 60187',
                phone_number: '6307551111',
                email: 'evelynd98@gmail.com',
                emergency_contact_name: 'Scarlett Davis',
                emergency_contact_phone: '6307552222'
            });
            await createPatient({
                first_name: 'Isabelle',
                last_name: 'Anderson',
                date_of_birth: '1999-12-01',
                gender: 'female',
                address: '9463 Elm St, Irving, TX, 75062',
                phone_number: '2147551111',
                email: 'isabellea99@gmail.com',
                emergency_contact_name: 'Evelyn Anderson',
                emergency_contact_phone: '2147552222'
            });
            await createPatient({
                first_name: 'Aurora',
                last_name: 'Wilson',
                date_of_birth: '1997-06-01',
                gender: 'female',
                address: '6789 Pine St, Atlanta, GA, 30301',
                phone_number: '4045551111',
                email: 'auroraw97@gmail.com',
                emergency_contact_name: 'Isabelle Wilson',
                emergency_contact_phone: '4045552222'
            });
            await createPatient({
                first_name: 'Natalie',
                last_name: 'Johnson',
                date_of_birth: '2000-11-01',
                gender: 'female',
                address: '4356 Oak St, Washington, DC, 20001',
                phone_number: '2025551111',
                email: 'nataliej00@gmail.com',
                emergency_contact_name: 'Aurora Johnson',
                emergency_contact_phone: '2025552222'
            });
            await createPatient({
                first_name: 'Aria',
                last_name: 'Thomas',
                date_of_birth: '1997-06-01',
                gender: 'female',
                address: '9463 Elm St, Boston, MA, 02101',
                phone_number: '6175751111',
                email: 'ariat97@gmail.com',
                emergency_contact_name: 'Natalie Thomas',
                emergency_contact_phone: '6175752222'
            });
            await createPatient({
                first_name: 'Scarlett',
                last_name: 'Davis',
                date_of_birth: '1997-09-01',
                gender: 'female',
                address: '6343 Pine St, Philadelphia, PA, 19101',
                phone_number: '2158751111',
                email: 'scarlettd97@gmail.com',
                emergency_contact_name: 'Aria Davis',
                emergency_contact_phone: '2158752222'
            });
            await createPatient({
                first_name: 'Evelyn',
                last_name: 'Anderson',
                date_of_birth: '1998-07-01',
                gender: 'female',
                address: '5234 Elm St, Houston, TX, 77001',
                phone_number: '7137551111',
                email: 'evelynand98@gmail.com',
                emergency_contact_name: 'Scarlett Anderson',
                emergency_contact_phone: '7137552222'
            });
            await createPatient({
                first_name: 'Isabelle',
                last_name: 'Wilson',
                date_of_birth: '1999-12-01',
                gender: 'female',
                address: '6789 Pine St, Miami, FL, 33101',
                phone_number: '3057551111',
                email: 'isabellew99@gmail.com',
                emergency_contact_name: 'Evelyn Wilson',
                emergency_contact_phone: '3057552222'
            });
            await createPatient({
                first_name: 'Avery',
                last_name: 'Johnson',
                date_of_birth: '1998-06-01',
                gender: 'female',
                address: '9463 Elm St, Dallas, TX, 75201',
                phone_number: '2148751111',
                email: 'averyj98@gmail.com',
                emergency_contact_name: 'Isabelle Johnson',
                emergency_contact_phone: '2148752222'
            });
            await createPatient({
                first_name: 'Natalie',
                last_name: 'Thomas',
                date_of_birth: '2000-11-01',
                gender: 'female',
                address: '4356 Oak St, Naperville, IL, 60540',
                phone_number: '6307551111',
                email: 'nataliet00@gmail.com',
                emergency_contact_name: 'Avery Thomas',
                emergency_contact_phone: '6307552222'
            });
            await createPatient({
                first_name: 'Aurora',
                last_name: 'Davis',
                date_of_birth: '1997-06-01',
                gender: 'female',
                address: '6789 Pine St, San Francisco, CA, 94102',
                phone_number: '4154751111',
                email: 'aurorad97@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '4154752222'
            });
            await createPatient({
                first_name: 'Olivia',
                last_name: 'Brown',
                date_of_birth: '1997-06-01',
                gender: 'female',
                address: '6789 Pine St, San Francisco, CA, 94102',
                phone_number: '4154751111',
                email: 'oliviabrown97@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '4154752222'
            });
            await createPatient({
                first_name: 'Mia',
                last_name: 'Miller',
                date_of_birth: '1999-12-01',
                gender: 'female',
                address: '6789 Pine St, San Francisco, CA, 94102',
                phone_number: '4154751111',
                email: 'miamiller99@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '4154752222'
            });
            await createPatient({
                first_name: 'Ethan',
                last_name: 'Johnson',
                date_of_birth: '1997-06-01',
                gender: 'male',
                address: '6789 Pine St, San Francisco, CA, 94102',
                phone_number: '4154751111',
                email: 'ethanjohnson97@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '4154752222'
            });
            await createPatient({
                first_name: 'Liam',
                last_name: 'Wilson',
                date_of_birth: '1997-06-01',
                gender: 'male',
                address: '5234 Elm St, Houston, TX, 77001',
                phone_number: '7137551111',
                email: 'liamwilson97@gmail.com',
                emergency_contact_name: 'Isabelle Johnson',
                emergency_contact_phone: '7137552222'
            });
            await createPatient({
                first_name: 'Emma',
                last_name: 'Young',
                date_of_birth: '2000-11-01',
                gender: 'female',
                address: '4356 Oak St, Naperville, IL, 60540',
                phone_number: '6307551111',
                email: 'emmayoung00@gmail.com',
                emergency_contact_name: 'Avery Thomas',
                emergency_contact_phone: '6307552222'
            });
            await createPatient({
                first_name: 'Oliver',
                last_name: 'Martin',
                date_of_birth: '1999-12-01',
                gender: 'male',
                address: '6789 Pine St, Miami, FL, 33101',
                phone_number: '3057551111',
                email: 'olivermartin99@gmail.com',
                emergency_contact_name: 'Isabelle Wilson',
                emergency_contact_phone: '3057552222'
            });
            await createPatient({
                first_name: 'Ava',
                last_name: 'Anderson',
                date_of_birth: '1998-06-01',
                gender: 'female',
                address: '9463 Elm St, Dallas, TX, 75201',
                phone_number: '2148751111',
                email: 'avaanderson98@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '2148752222'
            });
            await createPatient({
                first_name: 'Jackson',
                last_name: 'Thomas',
                date_of_birth: '1997-06-01',
                gender: 'male',
                address: '8345 Oak St, Chicago, IL, 60601',
                phone_number: '7087651111',
                email: 'jacksonthomas97@gmail.com',
                emergency_contact_name: 'Isabelle Wilson',
                emergency_contact_phone: '7087652222'
            });
            await createPatient({
                first_name: 'Logan',
                last_name: 'Hill',
                date_of_birth: '1998-06-01',
                gender: 'male',
                address: '5234 Elm St, Atlanta, GA, 30301',
                phone_number: '4047651111',
                email: 'loganhill98@gmail.com',
                emergency_contact_name: 'Isabelle Wilson',
                emergency_contact_phone: '4047652222'
            });
            await createPatient({
                first_name: 'Mila',
                last_name: 'Clark',
                date_of_birth: '1999-12-01',
                gender: 'female',
                address: '6789 Pine St, Phoenix, AZ, 85001',
                phone_number: '6027651111',
                email: 'milaclark99@gmail.com',
                emergency_contact_name: 'Avery Thomas',
                emergency_contact_phone: '6027652222'
            });
            await createPatient({
                first_name: 'Evelyn',
                last_name: 'Mitchell',
                date_of_birth: '1997-06-01',
                gender: 'female',
                address: '2367 Elm St, Washington, DC, 20001',
                phone_number: '2027651111',
                email: 'evelynmitchell97@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '2027652222'
            });
            await createPatient({
                first_name: 'Liam',
                last_name: 'Simpson',
                date_of_birth: '1998-06-01',
                gender: 'male',
                address: '9463 Elm St, Chicago, IL, 60601',
                phone_number: '7087651111',
                email: 'liamsimpson98@gmail.com',
                emergency_contact_name: 'Isabelle Johnson',
                emergency_contact_phone: '7087652222'
            });
            await createPatient({
                first_name: 'Emma',
                last_name: 'Perez',
                date_of_birth: '1999-12-01',
                gender: 'female',
                address: '6789 Pine St, Chicago, IL, 60601',
                phone_number: '7087651111',
                email: 'emmaperez99@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087652222'
            });
            await createPatient({
                first_name: 'Oliver',
                last_name: 'Green',
                date_of_birth: '1997-06-01',
                gender: 'male',
                address: '5234 Elm St, Chicago, IL, 60601',
                phone_number: '7087651111',
                email: 'olivergreen97@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '7087652222'
            });await createPatient({
                first_name: 'Avery',
                last_name: 'Young',
                date_of_birth: '1999-12-01',
                gender: 'female',
                address: '6789 Pine St, Chicago, IL, 60601',
                phone_number: '7087651111',
                email: 'averyyoung99@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087652222'
            });
            await createPatient({
                first_name: 'Mia',
                last_name: 'Smith',
                date_of_birth: '1998-06-01',
                gender: 'female',
                address: '9463 Elm St, Chicago, IL, 60601',
                phone_number: '7087651111',
                email: 'miasmith98@gmail.com',
                emergency_contact_name: 'Isabelle Johnson',
                emergency_contact_phone: '7087652222'
            });
            await createPatient({
                first_name: 'Avery',
                last_name: 'Johnson',
                date_of_birth: '1999-12-01',
                gender: 'female',
                address: '6789 Pine St, Chicago, IL, 60601',
                phone_number: '7087651111',
                email: 'averyjohnson99@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087652222'
            });
            await createPatient({
                first_name: 'Natalie',
                last_name: 'Davis',
                date_of_birth: '1997-06-01',
                gender: 'female',
                address: '5234 Elm St, Chicago, IL, 60601',
                phone_number: '7087651111',
                email: 'nataliedavis97@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '7087652222'
            });
            await createPatient({
                first_name: 'Isabelle',
                last_name: 'Johnson',
                date_of_birth: '1998-06-01',
                gender: 'female',
                address: '9458 Main St, Houston, TX, 77002',
                phone_number: '7087653333',
                email: 'isabellejohnson98@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087654444'
            });
            await createPatient({
                first_name: 'Olivia',
                last_name: 'Smith',
                date_of_birth: '1999-06-01',
                gender: 'female',
                address: '8364 Oak St, Chicago, IL, 60601',
                phone_number: '7087651111',
                email: 'oliviasmith99@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '7087652222'
            });
            await createPatient({
                first_name: 'Mia',
                last_name: 'Johnson',
                date_of_birth: '1998-06-01',
                gender: 'female',
                address: '6438 Main St, Phoenix, AZ, 85001',
                phone_number: '7087653333',
                email: 'miajohnson98@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087654444'
            });
            await createPatient({
                first_name: 'Emma',
                last_name: 'Brown',
                date_of_birth: '1962-06-01',
                gender: 'female',
                address: '6789 Pine St, Chicago, IL, 60601',
                phone_number: '7087651111',
                email: 'emmabrown62@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087652222'
            });
            await createPatient({
                first_name: 'Liam',
                last_name: 'Johnson',
                date_of_birth: '1986-06-01',
                gender: 'male',
                address: '5234 Elm St, Chicago, IL, 60601',
                phone_number: '7087651111',
                email: 'liamjohnson86@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '7087652222'
            });
            await createPatient({
                first_name: 'Ava',
                last_name: 'Johnson',
                date_of_birth: '2002-06-01',
                gender: 'female',
                address: '9458 Main St, Houston, TX, 77002',
                phone_number: '7087653333',
                email: 'avajohnson02@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087654444'
            });
            await createPatient({
                first_name: 'William',
                last_name: 'Brown',
                date_of_birth: '1970-06-01',
                gender: 'male',
                address: '6789 Pine St, Chicago, IL, 60601',
                phone_number: '7087651111',
                email: 'williambrown70@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087652222'
            });
            await createPatient({
                first_name: 'Ethan',
                last_name: 'Kim',
                date_of_birth: '1995-06-01',
                gender: 'male',
                address: '5234 Elm St, Chicago, IL, 60601',
                phone_number: '7087651111',
                email: 'ethankim95@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '7087652222'
            });
            await createPatient({
                first_name: 'Emily',
                last_name: 'Garcia',
                date_of_birth: '1989-06-01',
                gender: 'female',
                address: '9458 Main St, Houston, TX, 77002',
                phone_number: '7087653333',
                email: 'emilygarcia89@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087654444'
            });
            await createPatient({
                first_name: 'Isabella',
                last_name: 'Rodriguez',
                date_of_birth: '1998-06-01',
                gender: 'female',
                address: '9458 Main St, Los Angeles, CA, 90001',
                phone_number: '7087655555',
                email: 'isabellarodriguez98@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087656666'
            });
            await createPatient({
                first_name: 'Michael',
                last_name: 'Martinez',
                date_of_birth: '1985-06-01',
                gender: 'male',
                address: '6789 Pine St, Chicago, IL, 60601',
                phone_number: '7087657777',
                email: 'michaelmartinez85@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '7087658888'
            });
            await createPatient({
                first_name: 'Aria',
                last_name: 'Hernandez',
                date_of_birth: '1999-06-01',
                gender: 'female',
                address: '5234 Elm St, Chicago, IL, 60601',
                phone_number: '7087659999',
                email: 'ariahernandez99@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087650000'
            });
            await createPatient({
                first_name: 'Liam',
                last_name: 'Young',
                date_of_birth: '1997-06-01',
                gender: 'male',
                address: '1234 Oak St, Atlanta, GA, 30301',
                phone_number: '7087651111',
                email: 'liamyoung97@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '7087652222'
            });
            await createPatient({
                first_name: 'Olivia',
                last_name: 'Lewis',
                date_of_birth: '1991-06-01',
                gender: 'female',
                address: '1234 Maple St, Phoenix, AZ, 85001',
                phone_number: '7087653333',
                email: 'olivialewis91@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087654444'
            });
            await createPatient({
                first_name: 'William',
                last_name: 'Brown',
                date_of_birth: '1993-06-01',
                gender: 'male',
                address: '1234 Elm St, Seattle, WA, 98101',
                phone_number: '7087655555',
                email: 'williambrown93@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '7087656666'
            });
            await createPatient({
                first_name: 'Emma',
                last_name: 'Green',
                date_of_birth: '1995-06-01',
                gender: 'female',
                address: '1234 Main St, Miami, FL, 33101',
                phone_number: '7087657777',
                email: 'emmagreen95@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087658888'
            });
            await createPatient({
                first_name: 'Noah',
                last_name: 'Adams',
                date_of_birth: '1992-06-01',
                gender: 'male',
                address: '1234 Market St, Denver, CO, 80101',
                phone_number: '7087659999',
                email: 'noahadams92@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '7087650000'
            });
            await createPatient({
                first_name: 'Aaliyah',
                last_name: 'Singh',
                date_of_birth: '1995-06-01',
                gender: 'female',
                address: '1234 W Lake St, Chicago, IL, 60601',
                phone_number: '7087651111',
                email: 'aaliyahsingh95@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087652222'
            });
            await createPatient({
                first_name: 'Ethan',
                last_name: 'Kim',
                date_of_birth: '1997-06-01',
                gender: 'male',
                address: '1234 S State St, Chicago, IL, 60605',
                phone_number: '7087653333',
                email: 'ethankim97@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '7087654444'
            });
            await createPatient({
                first_name: 'Ava',
                last_name: 'Gonzalez',
                date_of_birth: '1999-06-01',
                gender: 'female',
                address: '1234 N Michigan Ave, Chicago, IL, 60601',
                phone_number: '7087655555',
                email: 'avagonzalez99@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087656666'
            });
            await createPatient({
                first_name: 'Liam',
                last_name: 'Rodriguez',
                date_of_birth: '1997-06-01',
                gender: 'male',
                address: '1234 E Wacker Dr, Chicago, IL, 60601',
                phone_number: '7087657777',
                email: 'liamrodriguez97@gmail.com',
                emergency_contact_name: 'Natalie Davis',
                emergency_contact_phone: '7087658888'
            });
            await createPatient({
                first_name: 'Isabella',
                last_name: 'Martinez',
                date_of_birth: '1999-06-01',
                gender: 'female',
                address: '1234 W Harrison St, Chicago, IL, 60601',
                phone_number: '7087659999',
                email: 'isabellamartinez99@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7087660000'
            });
            await createPatient({
                first_name: 'Emma',
                last_name: 'Lee',
                date_of_birth: '1997-06-01',
                gender: 'female',
                address: '1234 S Michigan Ave, Chicago, IL, 60601',
                phone_number: '7087661111',
                email: 'emmalee97@gmail.com',
                emergency_contact_name: 'Nathan Lee',
                emergency_contact_phone: '7087662222'
            });
            await createPatient({
                first_name: 'Oliver',
                last_name: 'Brown',
                date_of_birth: '1997-06-01',
                gender: 'male',
                address: '8262 Oak St, Chicago, IL, 60601',
                phone_number: '7087663333',
                email: 'oliverbrown97@gmail.com',
                emergency_contact_name: 'Nathan Brown',
                emergency_contact_phone: '7087663333'
            });
            await createPatient({
                first_name: 'Sophia',
                last_name: 'Davis',
                date_of_birth: '1999-06-01',
                gender: 'female',
                address: '4567 W Madison St, Chicago, IL, 60601',
                phone_number: '7087665555',
                email: 'sophiadavis99@gmail.com',
                emergency_contact_name: 'Michael Davis',
                emergency_contact_phone: '7087666666'
            });
            await createPatient({
                first_name: 'Isabelle',
                last_name: 'Gonzalez',
                date_of_birth: '1997-06-01',
                gender: 'female',
                address: '1235 S Wabash Ave, Chicago, IL, 60601',
                phone_number: '7087669999',
                email: 'isabellegonzalez97@gmail.com',
                emergency_contact_name: 'Miguel Gonzalez',
                emergency_contact_phone: '7087671111'
            });
            await createPatient({
                first_name: 'Parker',
                last_name: 'Kim',
                date_of_birth: '1999-06-01',
                gender: 'male',
                address: '2221 S Michigan Ave, Chicago, IL, 60601',
                phone_number: '7087672222',
                email: 'parkerkim99@gmail.com',
                emergency_contact_name: 'Ji-hyun Kim',
                emergency_contact_phone: '7087673333'
            });
            await createPatient({
                first_name: 'Natalie',
                last_name: 'Singh',
                date_of_birth: '1997-06-01',
                gender: 'female',
                address: '3331 N Michigan Ave, Chicago, IL, 60601',
                phone_number: '7087674444',
                email: 'nataliesingh97@gmail.com',
                emergency_contact_name: 'Amar Singh',
                emergency_contact_phone: '7087675555'
            });
            await createPatient({
                first_name: 'Jasmine',
                last_name: 'Rodriguez',
                date_of_birth: '1998-06-01',
                gender: 'female',
                address: '1234 W Belmont Ave, Chicago, IL, 60601',
                phone_number: '7087676666',
                email: 'jasminerodriguez98@gmail.com',
                emergency_contact_name: 'Juan Rodriguez',
                emergency_contact_phone: '7087677777'
            });
            await createPatient({
                first_name: 'Ethan',
                last_name: 'Brown',
                date_of_birth: '1997-06-01',
                gender: 'male',
                address: '4567 N Ashland Ave, Chicago, IL, 60601',
                phone_number: '7087678888',
                email: 'ethanbrown97@gmail.com',
                emergency_contact_name: 'Emily Brown',
                emergency_contact_phone: '7087679999'
            });
            await createPatient({
                first_name: 'Avery',
                last_name: 'Johnson',
                date_of_birth: '1995-06-01',
                gender: 'female',
                address: '5678 S State St, Chicago, IL, 60601',
                phone_number: '7087680000',
                email: 'averyjohnson95@gmail.com',
                emergency_contact_name: 'Marcus Johnson',
                emergency_contact_phone: '7087681111'
            });
            await createPatient({
                first_name: 'Natalie',
                last_name: 'Williams',
                date_of_birth: '1993-06-01',
                gender: 'female',
                address: '6789 E 63rd St, Chicago, IL, 60601',
                phone_number: '7087682222',
                email: 'nataliewilliams93@gmail.com',
                emergency_contact_name: 'Michael Williams',
                emergency_contact_phone: '7087683333'
            });
            await createPatient({
                first_name: 'Olivia',
                last_name: 'Davis',
                date_of_birth: '1991-06-01',
                gender: 'female',
                address: '7890 N Lake Shore Dr, Chicago, IL, 60601',
                phone_number: '7087684444',
                email: 'oliviadavis91@gmail.com',
                emergency_contact_name: 'William Davis',
                emergency_contact_phone: '7087685555'
            });
            await createPatient({
                first_name: 'Isabella',
                last_name: 'Brown',
                date_of_birth: '1989-06-01',
                gender: 'female',
                address: '1234 W Madison St, Chicago, IL, 60601',
                phone_number: '7087686666',
                email: 'isabellabrown89@gmail.com',
                emergency_contact_name: 'Robert Brown',
                emergency_contact_phone: '7087687777'
            });
            await createPatient({
                first_name: 'Mia',
                last_name: 'Johnson',
                date_of_birth: '1987-06-01',
                gender: 'female',
                address: '4321 Main St, Phoenix, AZ, 85001',
                phone_number: '6024688888',
                email: 'miajohnson87@gmail.com',
                emergency_contact_name: 'David Johnson',
                emergency_contact_phone: '6024689999'
            });
            await createPatient({
                first_name: 'Ava',
                last_name: 'Miller',
                date_of_birth: '1985-06-01',
                gender: 'female',
                address: '6789 S Michigan Ave, Chicago, IL, 60601',
                phone_number: '7087680000',
                email: 'avamiller85@gmail.com',
                emergency_contact_name: 'John Miller',
                emergency_contact_phone: '7087681111'
            });
            await createPatient({
                first_name: 'Liam',
                last_name: 'Davis',
                date_of_birth: '1983-06-01',
                gender: 'male',
                address: '1234 Elm St, Houston, TX, 77001',
                phone_number: '7136888888',
                email: 'liamdavis83@gmail.com',
                emergency_contact_name: 'Emily Davis',
                emergency_contact_phone: '7136889999'
            });await createPatient({
                first_name: 'Emily',
                last_name: 'Brown',
                date_of_birth: '1981-06-01',
                gender: 'female',
                address: '4321 W Harrison St, Chicago, IL, 60601',
                phone_number: '7087677777',
                email: 'emilybrown81@gmail.com',
                emergency_contact_name: 'Michael Brown',
                emergency_contact_phone: '7087678888'
            });
            await createPatient({
                first_name: 'Isabella',
                last_name: 'Gonzalez',
                date_of_birth: '1999-06-01',
                gender: 'female',
                address: '5678 S Main St, Phoenix, AZ, 85001',
                phone_number: '6024443333',
                email: 'isabellagonzalez99@gmail.com',
                emergency_contact_name: 'Juan Gonzalez',
                emergency_contact_phone: '6024444444'
            });
            await createPatient({
                first_name: 'William',
                last_name: 'Perez',
                date_of_birth: '1998-05-01',
                gender: 'male',
                address: '5678 S Main St, Houston, TX, 77001',
                phone_number: '8322221111',
                email: 'williamperez98@gmail.com',
                emergency_contact_name: 'Juan Perez',
                emergency_contact_phone: '8322222222'
            });
            await createPatient({
                first_name: 'Ava',
                last_name: 'Gonzalez',
                date_of_birth: '1999-08-01',
                gender: 'female',
                address: '9101 W Madison St, Chicago, IL, 60601',
                phone_number: '7087678888',
                email: 'avagonzalez99@gmail.com',
                emergency_contact_name: 'Isabel Gonzalez',
                emergency_contact_phone: '7087679999'
            });
            await createPatient({
                first_name: 'Michael',
                last_name: 'Kim',
                date_of_birth: '1978-03-01',
                gender: 'male',
                address: '123 S 1st St, Seattle, WA, 98104',
                phone_number: '2061112222',
                email: 'michaelkim78@gmail.com',
                emergency_contact_name: 'Jenny Kim',
                emergency_contact_phone: '2061113333'
            });
            await createPatient({
                first_name: 'Emma',
                last_name: 'Hernandez',
                date_of_birth: '2003-12-01',
                gender: 'female',
                address: '7700 S Western Ave, Chicago, IL, 60620',
                phone_number: '7086554444',
                email: 'emmahernandez03@gmail.com',
                emergency_contact_name: 'Ricardo Hernandez',
                emergency_contact_phone: '7086555555'
            });
            await createPatient({
                first_name: 'Olivia',
                last_name: 'Parker',
                date_of_birth: '1950-06-01',
                gender: 'female',
                address: '3300 N Central Ave, Phoenix, AZ, 85012',
                phone_number: '6029876543',
                email: 'oliviaparker50@gmail.com',
                emergency_contact_name: 'William Parker',
                emergency_contact_phone: '6029876544'
            });
            await createPatient({
                first_name: 'Aiden',
                last_name: 'Kim',
                date_of_birth: '2010-02-01',
                gender: 'male',
                address: '5200 S Lake Shore Dr, Chicago, IL, 60615',
                phone_number: '7086553322',
                email: 'aidenkim10@gmail.com',
                emergency_contact_name: 'Ji-Yeon Kim',
                emergency_contact_phone: '7086553323'
            });
            await createPatient({
                first_name: 'Evelyn',
                last_name: 'Gonzalez',
                date_of_birth: '1980-04-22',
                gender: 'female',
                address: '6601 S Stony Island Ave, Chicago, IL, 60649',
                phone_number: '7086553321',
                email: 'evelyngonzalez80@gmail.com',
                emergency_contact_name: 'Juan Gonzalez',
                emergency_contact_phone: '7086553320'
            });
            await createPatient({
                first_name: 'Marcus',
                last_name: 'Kim',
                date_of_birth: '1998-10-01',
                gender: 'male',
                address: '1373 W University Dr, Tempe, AZ, 85281',
                phone_number: '4805551234',
                email: 'marcus98kim@gmail.com',
                emergency_contact_name: 'Ji Kim',
                emergency_contact_phone: '4805554321'
            });
            await createPatient({
                first_name: 'Nia',
                last_name: 'Ramirez',
                date_of_birth: '2000-05-17',
                gender: 'female',
                address: '1725 N Halsted St, Chicago, IL, 60614',
                phone_number: '3125551234',
                email: 'nia2000ramirez@gmail.com',
                emergency_contact_name: 'Juan Ramirez',
                emergency_contact_phone: '3125554321'
            });
            await createPatient({
                first_name: 'Miguel',
                last_name: 'Garcia',
                date_of_birth: '1983-12-10',
                gender: 'male',
                address: '8262 Oak St, Evanston, IL, 60202',
                phone_number: '8475556789',
                email: 'miguel83garcia@gmail.com',
                emergency_contact_name: 'Isabel Garcia',
                emergency_contact_phone: '8475559876'
            });
            await createPatient({
                first_name: 'Fatima',
                last_name: 'Mohammed',
                date_of_birth: '1975-06-20',
                gender: 'female',
                address: '567 W Madison St, Chicago, IL, 60661',
                phone_number: '8471234567',
                email: 'fatimamohammed75@gmail.com',
                emergency_contact_name: 'Ahmed Mohammed',
                emergency_contact_phone: '8471237890'
            });
            await createPatient({
                first_name: 'Leah',
                last_name: 'Parker',
                date_of_birth: '2000-02-05',
                gender: 'female',
                address: '8262 Oak St, Oak Park, IL, 60302',
                phone_number: '7081234567',
                email: 'leahparker00@gmail.com',
                emergency_contact_name: 'Sarah Parker',
                emergency_contact_phone: '7081237890'
            });
            await createPatient({
                first_name: 'Jasmine',
                last_name: 'Kim',
                date_of_birth: '1982-07-22',
                gender: 'female',
                address: '1234 W Madison St, Chicago, IL, 60607',
                phone_number: '3129871234',
                email: 'jasminekim82@gmail.com',
                emergency_contact_name: 'Michael Kim',
                emergency_contact_phone: '3129876543'
            });
            await createPatient({
                first_name: 'David',
                last_name: 'Gonzalez',
                date_of_birth: '1999-03-17',
                gender: 'male',
                address: '789 S Oak Park Ave, Oak Park, IL, 60302',
                phone_number: '7084561278',
                email: 'davidgonzalez99@gmail.com',
                emergency_contact_name: 'Juan Gonzalez',
                emergency_contact_phone: '7084127896'
            });
            await createPatient({
                first_name: 'Maria',
                last_name: 'Rodriguez',
                date_of_birth: '1956-12-05',
                gender: 'female',
                address: '567 W North Ave, Chicago, IL, 60610',
                phone_number: '7187451293',
                email: 'mariarodriguez56@gmail.com',
                emergency_contact_name: 'Juan Rodriguez',
                emergency_contact_phone: '7189876543'
            });
            await createPatient({
                first_name: 'William',
                last_name: 'Johnson',
                date_of_birth: '2002-09-15',
                gender: 'male',
                address: '1234 S Oak Park Ave, Oak Park, IL, 60302',
                phone_number: '7184678492',
                email: 'wjohnson02@gmail.com',
                emergency_contact_name: 'Evelyn Johnson',
                emergency_contact_phone: '7184958672'
            });
            await createPatient({
                first_name: 'Sophia',
                last_name: 'Rodriguez',
                date_of_birth: '1980-03-14',
                gender: 'female',
                address: '7353 W George St, Chicago, IL, 60656',
                phone_number: '3122984756',
                email: 'srodriguez80@gmail.com',
                emergency_contact_name: 'Juan Rodriguez',
                emergency_contact_phone: '3123567890'
            });
            await createPatient({
                first_name: 'Nina',
                last_name: 'Liu',
                date_of_birth: '1960-01-05',
                gender: 'female',
                address: '6012 Forest Ave, Dallas, TX, 75204',
                phone_number: '2146376448',
                email: 'nliu60@gmail.com',
                emergency_contact_name: 'Ling Liu',
                emergency_contact_phone: '2142313445'
            });
            await createPatient({
                first_name: 'Monica',
                last_name: 'Rodriguez',
                date_of_birth: '1985-01-17',
                gender: 'female',
                address: '948 W Loyola Ave, Chicago, IL, 60626',
                phone_number: '7736574839',
                email: 'mrodriguez85@gmail.com',
                emergency_contact_name: 'Rodriguez Monica',
                emergency_contact_phone: '7736574839'
                });
            await createPatient({
                first_name: 'Martha',
                last_name: 'Santos',
                date_of_birth: '1983-12-07',
                gender: 'female',
                address: '5921 N Lake Shore Dr, Chicago, IL, 60660',
                phone_number: '7732124948',
                email: 'msantos83@gmail.com',
                emergency_contact_name: 'Martha Santos',
                emergency_contact_phone: '7732124948'
                });
            await createPatient({
                first_name: 'Rashida',
                last_name: 'Henderson',
                date_of_birth: '1983-03-12',
                gender: 'female',
                address: '6312 W Fullerton Ave, Chicago, IL, 60707',
                phone_number: '7738686972',
                email: 'rhenderson83@gmail.com',
                emergency_contact_name: 'Rashida Henderson',
                emergency_contact_phone: '7738686972'
                });
            await createPatient({
                first_name: 'Emma',
                last_name: 'Johnson',
                date_of_birth: '1980-03-24',
                gender: 'female',
                address: '3927 N Lincoln Ave, Chicago, IL, 60613',
                phone_number: '7736038492',
                email: 'ejohnson80@gmail.com',
                emergency_contact_name: 'Johnson Family',
                emergency_contact_phone: '7736038492'
                });
            await createPatient({
                first_name: 'Jacqueline',
                last_name: 'Mendoza',
                date_of_birth: '1961-03-12',
                gender: 'female',
                address: '5821 N Harlem Ave, Chicago, IL, 60631',
                phone_number: '7738254736',
                email: 'jmendoza61@gmail.com',
                emergency_contact_name: 'Javier Mendoza',
                emergency_contact_phone: '7738254736'
                });
            await createPatient({
                first_name: 'Marcella',
                last_name: 'Zheng',
                date_of_birth: '1948-02-19',
                gender: 'female',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'mzheng48@gmail.com',
                emergency_contact_name: 'Marcella Zheng',
                emergency_contact_phone: '7379522652'
                });       
            await createPatient({
                first_name: 'Karen',
                last_name: 'Garcia',
                date_of_birth: '1977-06-21',
                gender: 'female',
                address: '3204 W North Ave, Chicago, IL, 60651',
                phone_number: '8723040615',
                email: 'kgarcia77@gmail.com',
                emergency_contact_name: 'Karen Garcia',
                emergency_contact_phone: '8723040615'
                });
            await createPatient({
                first_name: "Evelyn",
                last_name: "Rojas",
                date_of_birth: "1938-06-23",
                gender: "female",
                address: "1035 S Oak Park Ave, Oak Park, IL 60304",
                phone_number: "8472658589",
                email: "erojas38@gmail.com",
                emergency_contact_name: "Evelyn Rojas",
                emergency_contact_phone: "8472658589"
                });
            await createPatient({
                first_name: 'Sophia',
                last_name: 'Lee',
                date_of_birth: '1998-08-11',
                gender: 'female',
                address: '8356 W Lake St, Chicago, IL 60607',
                phone_number: '7734418603',
                email: 'slee98@gmail.com',
                emergency_contact_name: 'Sophia Lee',
                emergency_contact_phone: '7734418603'
                });
            await createPatient({
                first_name: 'Tyree',
                last_name: 'Gonzalez',
                date_of_birth: '1983-11-08',
                gender: 'male',
                address: '2126 W Belmont Ave, Chicago, IL, 60618',
                phone_number: '8474561238',
                email: 'tgonzalez83@gmail.com',
                emergency_contact_name: 'Tyree Gonzalez',
                emergency_contact_phone: '8474561238'
                });
                await createPatient({
                    first_name: 'Caroline',
                    last_name: 'Perez',
                    date_of_birth: '1977-12-02',
                    gender: 'female',
                    address: '1131 S Kedzie Ave, Chicago, IL, 60623',
                    phone_number: '7375563834',
                    email: 'cperez77@gmail.com',
                    emergency_contact_name: 'Caroline Perez',
                    emergency_contact_phone: '7375563834'
                    });
                    
                    

            console.log('Finished creating patient.');
        } catch (error) {
            console.error('Error when creating patient!');
            console.log(error);
        }
    };

    // Method: createInitialStaff;
    async function createInitialStaff() {
        console.log('Starting to create Staff...')
        try {
            await createStaff({
                name: 'Joseph Salmon',
                title: 'Physician',
                specialty: 'Internal Medicine',
                provider_id: 1537,
                email: 'jsalmon@healthhive.com',
                phone_number: '8886462524'
            });

            console.log('Finished creating staff.');
        } catch (error) {
            console.error('Error when creating staff!');
            console.log(error);
        }
    };

    //Method: createInitialTreatmentPlan
    async function createInitialTreatmentPlan() {
        console.log('Starting to create treatment plan...')
        try {
            await createTreatmentPlan({
                plan: 'Example',
                patient_id: 1,
                provider_id: 1537,
            });

            console.log('Finished creating treatment plan.');
        } catch (error) {
            console.error('Error when creating treatment plan!');
            console.log(error);
        }
    };

    // Method: createInitialAppointment;
    async function createInitialAppointment() {
        console.log('Starting to create appointment...')
        try {
            await createAppointment({
                date: '2023-01-05',
                time: '15:00',
                location: 'Internal Medicine',
                patient_id: 1,
                staff_id: 1,
                treatment_Id: 1
            });
            console.log('Finished creating appointment.');
        } catch (error) {
            console.error('Error when creating appointment!');
            console.log(error);
        }
    };

    // Method: createInitialMedicalRecord;
    async function createInitialMedicalRecord() {
        console.log('Starting to create medical record...')
        try {
            await createMedicalRecord({
                patient_id: 1,
                name: 'John Smith',
                diagnosis: 'HBP Example',
                symptoms: 'fainting',
                status: 'alive'
            });
            console.log('Finished creating medical record.');
        } catch (error) {
            console.error('Error when creating medical record!');
            console.log(error);
        }
    };

    // Method: createInitialMedication;
    async function createInitialMedication() {
        console.log('Starting to create medication...')
        try {
            await createMedication({
                name: 'Amlodipine Besylate',
                dosage_form: 'tablet',
                route: 'oral',
                sig: '5mg BID',
                indication: 'Hypertension',
                day_supply: '30',
                start_date: '2022-08-15',
                length_of_therapy: '12 Months',
                refills: 3,
                pharmacy: 'CVS Health',
                treatment_id: 1,
                provider_id: 1537
            });
            console.log('Finished creating medication.');
        } catch (error) {
            console.error('Error when creating medication!');
            console.log(error);
        }
    };

    // Method: createInitialProcedure;
    async function createInitialProcedure() {
        console.log('Starting to create procedure...')
        try {
            await createProcedure({
                name: 'Blood Testing',
                description: "A blood test at a hospital involves drawing a sample of blood from a vein in the arm. The process typically starts with identifying the patient and verifying their information. The healthcare provider then cleans the area where the blood will be drawn, and inserts a needle into a vein. The blood is collected into a vial and then sent to a laboratory for analysis. The results of the blood test can provide information on various aspects of a patient's health, such as blood cell counts, cholesterol levels, and markers for disease. The test results are usually available within a few days to a week.",
                date_performed: '2022-11-15',
                patient_id: 1,
                treatment_id: 1,
                staff_id: 1
            });
            console.log('Finished creating procedure.');
        } catch (error) {
            console.error('Error when creating procedure!');
            console.log(error);
        }
    };

    // Method: createInitialProcedureStaff;
    async function createInitialProcedureStaff() {
        console.log('Starting to create procedure staff...')
        try {
            await createProcedureStaff({
                procedure_id: 1,
                staff_id: 1
                    // use an array for 1+
            });
            console.log('Finished creating procedure staff.');
        } catch (error) {
            console.error('Error when creating procedure staff!');
            console.log(error);
        }
    };

    // Rebuild DB:
    async function rebuildDB() {
        try {
            client.connect();
            console.log('Running DB function...')
            await dropTables();
            await createTables();
            await createInitialUsers();
            await createInitialPatient();
            await createInitialStaff();
            await createInitialTreatmentPlan();
            await createInitialAppointment();
            await createInitialMedicalRecord();
            await createInitialMedication();
            await createInitialProcedure();
            await createInitialProcedureStaff();
        } catch (error) {
            console.log('Error during rebuildDB!')
            console.log(error.detail);
        }
    };

    // Test DB:
    async function testDB() {
        try {
            console.log('Starting to test database...');

            // User Testing;
            console.log('Calling getAllUsers...')
            const users = await getAllUsers();
            console.log('User results: ', users)

            // Patient Testing;
            console.log('Calling getAllPatient...')
            const patient = await getAllPatient();
            console.log('User results: ', patient)

            // console.log('Calling getPatientId...')
            // const patientId = await getPatientById(1);
            // console.log('patientId results: ', patientId)

            // console.log('Calling getPatientByLastName...')
            // const patientLN = await getPatientByLastName('Smith');
            // console.log('patientLN results: ', patientLN)

            // console.log('Calling getPatientByDateOfBirth...')
            // const patientDOB = await getPatientByDateOfBirth('1997-06-15');
            // console.log('patientDOB results: ', patientDOB)

            // console.log('Calling getPatientByAddress...')
            // const patientAdy = await getPatientByAddress('283 W Kennedy Dr, Chicago, IL, 60605');
            // console.log('patientAdy results: ', patientAdy)

            // console.log('Calling getPatientByPhoneNumber...')
            // const patientPhone = await getPatientByPhoneNumber('7084684948');
            // console.log('patientPhone results: ', patientPhone)

            // console.log('Calling getPatientByEmail...')
            // const patientEmail = await getPatientByEmail('jsmith97@gmail.com');
            // console.log('patientEmail results: ', patientEmail)

            // console.log('Calling getPatientByEmergencyContactName...')
            // const patientEmeCont = await getPatientByEmergencyContactName('Sheryl Smith');
            // console.log('patientcont results: ', patientEmeCont)

            // console.log('Calling getPatientByEmergencyContactPhone...')
            // const patientEmPho = await getPatientByEmergencyContactPhone('7081664345');
            // console.log('patientphone results: ', patientEmPho)

            // Staff Testing;
            console.log('Calling getAllStaff...')
            const staff = await getAllStaff();
            console.log('Staff results: ', staff)

            // console.log('Calling getStaffById...')
            // const staffId = await getStaffById(1);
            // console.log('Staff results: ', staffId)

            // console.log('Calling getStaffByTitle...')
            // const staffTitle = await getStaffByTitle('Physician');
            // console.log('Staff results: ', staffTitle)

            // console.log('Calling getStaffBySpecialty...')
            // const staffSpecia = await getStaffBySpecialty('Internal Medicine');
            // console.log('Staff results: ', staffSpecia)

            // console.log('Calling getStaffByProviderId...')
            // const staffProviderId = await getStaffByProviderId(1537);
            // console.log('Staff results: ', staffProviderId)

            // Treatment Plan Testing;
            console.log('Calling getAllTreatmentPlan...')
            const treatment = await getAllTreatmentPlan();
            console.log('Treatment results: ', treatment)

            // console.log('Calling treatmentId...')
            // const treatmentId = await getTreatmentPlanById(1);
            // console.log('Treatment results: ', treatmentId)

            // console.log('Calling getTreatmentPlanByProviderId...')
            // const treatmentProvider = await getTreatmentPlanByProviderId(1537);
            // console.log('Treatment results: ', treatmentProvider)

            // console.log('Calling getTreatmentPlanByPatientId...')
            // const treatmentPatient = await getTreatmentPlanByPatientId(1);
            // console.log('Treatment results: ', treatmentPatient)
            
            // Appointment Testing;
            console.log('Calling getAllAppointment...')
            const appointment = await getAllAppointment();
            console.log('appointment results: ', appointment)

            // console.log('Calling appointmentdate...')
            // const appointmentdate = await getAppointmentByDate('2023-01-05');
            // console.log('appointment results: ', appointmentdate)

            // console.log('Calling appointmentId...')
            // const appointmentId = await getAppointmentById(1);
            // console.log('appointment results: ', appointmentId)

            // console.log('Calling getAlappointmentPatientIdlAppointment...')
            // const appointmentPatientId = await getAppointmentByPatientId(1);
            // console.log('appointment results: ', appointmentPatientId)

            // console.log('Calling appointmentStaff...')
            // const appointmentStaff= await getAppointmentByStaffId(1);
            // console.log('appointment results: ', appointmentStaff)

            // console.log('Calling appointmentTreatment...')
            // const appointmentTreatment = await getAppointmentByTreatmentId(1);
            // console.log('appointment results: ', appointmentTreatment)

            // console.log('Calling destroy Appointment...')
            // const appointmentdestroyed = await destroyAppointment(1);
            // console.log('destroyed appointment results: ', appointmentdestroyed)
            // console.log("appointments", appointment)

            
            // Medical Record Testing;
            console.log('Calling getAllMedicalRecord...');
            const medicalRecord = await getAllMedicalRecord();
            console.log('medical record results: ', medicalRecord);

            // console.log('Calling getMedicalRecordById...');
            // const medicalRecordId = await getMedicalRecordById(1);
            // console.log('medical record Id results: ', medicalRecordId);

            // console.log('Calling getMedicalRecordByPatientId...');
            // const medicalRecordPatientId = await getMedicalRecordByPatientId(1);
            // console.log('medical record patientId results: ', medicalRecordPatientId);

            // Medication Testing
            console.log('Calling getAllMedication...');
            const medication = await getAllMedication();
            console.log('medication results: ', medication);

            // console.log('Calling getMedicationById...');
            // const medicationById = await getMedicationById(1);
            // console.log('medication results: ', medicationById);

            // console.log('Calling getMedicationByPharmacy...');
            // const medicationPharm = await getMedicationByPharmacy('CVS Health');
            // console.log('medicationPharm results: ', medicationPharm);

            // console.log('Calling getMedicationByTreatmentId...');
            // const medicationTreatment = await getMedicationByTreatmentId(1);
            // console.log('medicationTreatment results: ', medicationTreatment);

            // console.log('Calling getMedicationByProviderId...');
            // const medicationProvider = await getMedicationByProviderId(1537);
            // console.log('medicationProvider results: ', medicationProvider);

            // Procedure Testing
            console.log('Calling getAllProcedure...')
            const procedure = await getAllProcedure();
            console.log('procedure results: ', procedure)

            // console.log('Calling getProcedureById...')
            // const procedureId = await getProcedureById(1);
            // console.log('procedure results: ', procedureId)

            // console.log('Calling getProcedureByPatientId...')
            // const procedurePatientId = await getProcedureByPatientId(1);
            // console.log('procedurePatientId results: ', procedurePatientId)

            // console.log('Calling getProcedureByTreatmentId...')
            // const procedureTreat = await getProcedureByTreatmentId(1);
            // console.log('procedureTreat results: ', procedureTreat)

            // console.log('Calling getProcedureByStaffId...')
            // const procedureStaff = await getProcedureByStaffId(1);
            // console.log('procedureStaff results: ', procedureStaff)

            // Procedure Staff Testing
            console.log('Calling getAllProcedureStaff...')
            const procedureStaff = await getAllProcedureStaff();
            console.log('procedureStaff results: ', procedureStaff)

            // console.log('Calling getProcedureStaffById...')
            // const procedureStaffId = await getProcedureStaffById(1);
            // console.log('procedureStaffId results: ', procedureStaffId)

            // console.log('Calling getProcedureStaffByStaffId...')
            // const procedureStaffByStaffId = await getProcedureStaffByStaffId(1);
            // console.log('procedure results: ', procedureStaffByStaffId)

        } catch (error) {
            console.log('Error during testDB!');
            console.log(error);
            console.error(error);
            console.error(error.message)
        }
    };

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end())