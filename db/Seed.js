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
                phone_number: '2154667845',
                email: 'scarlettd97@gmail.com',
                emergency_contact_name: 'Aria Davis',
                emergency_contact_phone: '2154684545'
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
                first_name: 'Avan',
                last_name: 'Gonzalez',
                date_of_birth: '1979-06-01',
                gender: 'female',
                address: '1234 N Michigan Ave, Chicago, IL, 60601',
                phone_number: '7087655555',
                email: 'avagonzalez79@gmail.com',
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
                first_name: 'Marcie',
                last_name: 'Zheng',
                date_of_birth: '1968-02-19',
                gender: 'female',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'mzheng68@gmail.com',
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
            await createPatient({
                first_name: 'Karen',
                last_name: 'Hernandez',
                date_of_birth: '1952-07-08',
                gender: 'female',
                address: '4027 W North Ave, Chicago, IL 60647',
                phone_number: '7328880400',
                email: 'khernandez52@gmail.com',
                emergency_contact_name: 'Karen Hernandez',
                emergency_contact_phone: '7328880400'
                });
            await createPatient({
                first_name: 'Erick',
                last_name: 'Garcia',
                date_of_birth: '1997-08-22',
                gender: 'male',
                address: '2425 W Augusta Blvd, Chicago, IL 60622',
                phone_number: '7373989290',
                email: 'erickgarcia97@gmail.com',
                emergency_contact_name: 'Erick Garcia',
                emergency_contact_phone: '7373989290'
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
                first_name: 'John',
                last_name: 'Doe',
                date_of_birth: '1970-05-12',
                gender: 'male',
                address: '619 N Main St, Evanston, IL, 60201',
                phone_number: '2108456789',
                email: 'johndoe70@gmail.com',
                emergency_contact_name: 'John Doe',
                emergency_contact_phone: '2108456789'
                });
            await createPatient({
                first_name: 'Jane',
                last_name: 'Smith',
                date_of_birth: '1992-09-23',
                gender: 'female',
                address: '135 W Wise Rd, Schaumburg, IL, 60193',
                phone_number: '3108456789',
                email: 'janesmith92@gmail.com',
                emergency_contact_name: 'Jane Smith',
                emergency_contact_phone: '3108456789'
                });
            await createPatient({
                first_name: 'Joan',
                last_name: 'Robinson',
                date_of_birth: '1989-07-12',
                gender: 'female',
                address: '1503 N Kostner Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'joanr89@gmail.com',
                emergency_contact_name: 'Joan Robinson',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Jacqueline',
                last_name: 'Perez',
                date_of_birth: '1954-10-08',
                gender: 'female',
                address: '7517 N Monticello Ave, Skokie, IL, 60076',
                phone_number: '6385930451',
                email: 'jperez54@gmail.com',
                emergency_contact_name: 'Jacqueline Perez',
                emergency_contact_phone: '6385930451'
                });
            await createPatient({
                first_name: 'Curtis',
                last_name: 'Elliott',
                date_of_birth: '1954-10-29',
                gender: 'male',
                address: '1538 N Kedzie Ave, Chicago, IL, 60651',
                phone_number: '7379526652',
                email: 'celliott54@gmail.com',
                emergency_contact_name: 'Curtis Elliott',
                emergency_contact_phone: '7379526652'
                });
            await createPatient({
                first_name: 'Mariah',
                last_name: 'Garcia',
                date_of_birth: '1987-02-19',
                gender: 'female',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'mgarcia87@gmail.com',
                emergency_contact_name: 'Mariah Garcia',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Lori',
                last_name: 'Robinson',
                date_of_birth: '1954-06-03',
                gender: 'female',
                address: '3862 W 65th St, Chicago, IL, 60629',
                phone_number: '9733542651',
                email: 'lrobin54@gmail.com',
                emergency_contact_name: 'Lori Robinson',
                emergency_contact_phone: '9733542651'
                });
            await createPatient({
                first_name: 'Evelyn',
                last_name: 'Santiago',
                date_of_birth: '1987-11-12',
                gender: 'female',
                address: '2213 S Racine Ave, Chicago, IL, 60608',
                phone_number: '9735158643',
                email: 'evelyn87@gmail.com',
                emergency_contact_name: 'Evelyn Santiago',
                emergency_contact_phone: '9735158643'
                });
            await createPatient({
                first_name: 'Tiffany',
                last_name: 'Gonzalez',
                date_of_birth: '1992-07-01',
                gender: 'female',
                address: '3104 N Nagle Ave, Chicago, IL, 60634',
                phone_number: '7241938574',
                email: 'tgonzalez92@gmail.com',
                emergency_contact_name: 'Tiffany Gonzalez',
                emergency_contact_phone: '7241938574'
                });
            await createPatient({
                first_name: 'Michael',
                last_name: 'Chang',
                date_of_birth: '1954-07-12',
                gender: 'male',
                address: '2800 N Main St, San Antonio, TX 78212',
                phone_number: '7379522652',
                email: 'mchang54@gmail.com',
                emergency_contact_name: 'Michael Chang',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Evelyn',
                last_name: 'Johnson',
                date_of_birth: '1982-11-23',
                gender: 'female',
                address: '3394 W Franklin St, Chicago, IL 60624',
                phone_number: '7379522652',
                email: 'ejohnson82@gmail.com',
                emergency_contact_name: 'Evelyn Johnson',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Emily',
                last_name: 'Lee',
                date_of_birth: '2004-04-23',
                gender: 'female',
                address: '1623 S Los Angeles St, Los Angeles, CA 90015',
                phone_number: '7379522652',
                email: 'elee04@gmail.com',
                emergency_contact_name: 'Emily Lee',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Jasmine',
                last_name: 'Nguyen',
                date_of_birth: '1997-06-05',
                gender: 'female',
                address: '3200 W Devon Ave, Chicago, IL 60659',
                phone_number: '3322246432',
                email: 'jasminenguyen97@gmail.com',
                emergency_contact_name: 'Jasmine Nguyen',
                emergency_contact_phone: '3322246432'
                });
            await createPatient({
                first_name: 'Sofia',
                last_name: 'Garcia',
                date_of_birth: '1999-12-01',
                gender: 'female',
                address: '917 S Grand Ave, Los Angeles, CA 90015',
                phone_number: '2134622244',
                email: 'sofiagarcia99@gmail.com',
                emergency_contact_name: 'Sofia Garcia',
                emergency_contact_phone: '2134622244'
            });
            await createPatient({
                first_name: 'Oscar',
                last_name: 'Rivera',
                date_of_birth: '2002-03-16',
                gender: 'male',
                address: '2505 W Fullerton Ave, Chicago, IL 60647',
                phone_number: '7735559988',
                email: 'oscarr@gmail.com',
                emergency_contact_name: 'Oscar Rivera',
                emergency_contact_phone: '7735559988'
            });
            await createPatient({
                first_name: 'Mikayla',
                last_name: 'Zamora',
                date_of_birth: '1949-01-10',
                gender: 'female',
                address: '5205 N Sheridan Rd, Chicago, IL, 60640',
                phone_number: '9258146948',
                email: 'mzamora49@gmail.com',
                emergency_contact_name: 'Mikayla Zamora',
                emergency_contact_phone: '9258146948'
                });
            await createPatient({
                first_name: 'Ricardo',
                last_name: 'Martinez',
                date_of_birth: '1968-12-02',
                gender: 'male',
                address: '2331 E 75th St, Chicago, IL, 60649',
                phone_number: '7379522652',
                email: 'ricardom68@gmail.com',
                emergency_contact_name: 'Ricardo Martinez',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Kaitlyn',
                last_name: 'Bryant',
                date_of_birth: '1982-07-08',
                gender: 'female',
                address: '2655 W Augusta Blvd, Chicago, IL, 60622',
                phone_number: '7379522652',
                email: 'kaitlynb82@gmail.com',
                emergency_contact_name: 'Kaitlyn Bryant',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Mariona',
                last_name: 'Zheng',
                date_of_birth: '1978-02-19',
                gender: 'female',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'mzheng78@gmail.com',
                emergency_contact_name: 'Marcella Zheng',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Marcionia',
                last_name: 'Zheng',
                date_of_birth: '1998-02-19',
                gender: 'female',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'mzheng98@gmail.com',
                emergency_contact_name: 'Marcella Zheng',
                emergency_contact_phone: '7379522652'
            });
            await createPatient({
                first_name: 'Marcella',
                last_name: 'Zheng',
                date_of_birth: '1955-02-19',
                gender: 'female',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'mzheng55@gmail.com',
                emergency_contact_name: 'Marcella Zheng',
                emergency_contact_phone: '7379522652'
            });
            await createPatient({
                first_name: 'Lillie',
                last_name: 'Leon',
                date_of_birth: '1955-01-24',
                gender: 'female',
                address: '2239 W Fullerton Ave, Chicago, IL, 60647',
                phone_number: '2919142021',
                email: 'lillie.leon@gmail.com',
                emergency_contact_name: 'Lillie Leon',
                emergency_contact_phone: '2919142021'
                });
            await createPatient({
                first_name: 'Marvin',
                last_name: 'Santos',
                date_of_birth: '1956-05-17',
                gender: 'male',
                address: '5413 Littleton Rd, Littleton, CO, 80120',
                phone_number: '8384723400',
                email: 'msantos56@hotmail.com',
                emergency_contact_name: 'Marvin Santos',
                emergency_contact_phone: '8384723400'
            });
            await createPatient({
                first_name: 'Lorene',
                last_name: 'Santiago',
                date_of_birth: '1962-12-15',
                gender: 'female',
                address: '1414 N Lake Shore Dr, Chicago, IL, 60610',
                phone_number: '5648037155',
                email: 'lorene.santiago@gmail.com',
                emergency_contact_name: 'Lorene Santiago',
                emergency_contact_phone: '5648037155'
            });
            await createPatient({
                first_name: 'Nash',
                last_name: 'Hodge',
                date_of_birth: '1968-07-10',
                gender: 'male',
                address: '1904 S Dearborn St, Chicago, IL, 60616',
                phone_number: '7169079967',
                email: 'nhodge68@gmail.com',
                emergency_contact_name: 'Nash Hodge',
                emergency_contact_phone: '7169079967'
                });
            await createPatient({
                first_name: 'Lila',
                last_name: 'Diaz',
                date_of_birth: '1962-09-08',
                gender: 'female',
                address: '1501 N Elm St, Wheaton, IL, 60187',
                phone_number: '8324907743',
                email: 'ldiaz62@gmail.com',
                emergency_contact_name: 'Lila Diaz',
                emergency_contact_phone: '8324907743'
            });
            await createPatient({
                first_name: 'Mohammed',
                last_name: 'Bryant',
                date_of_birth: '1977-03-12',
                gender: 'male',
                address: '2102 S Archer Ave, Chicago, IL, 60616',
                phone_number: '7570299971',
                email: 'mbryant77@gmail.com',
                emergency_contact_name: 'Mohammed Bryant',
                emergency_contact_phone: '7570299971'
            });
            await createPatient({
                first_name: 'Rita',
                last_name: 'Wong',
                date_of_birth: '1977-05-16',
                gender: 'female',
                address: '2600 N Lake Shore Dr, Chicago, IL, 60614',
                phone_number: '2126339400',
                email: 'ritawong77@gmail.com',
                emergency_contact_name: 'Rita Wong',
                emergency_contact_phone: '2126339400'
                });
            await createPatient({
                first_name: 'Michael',
                last_name: 'Johnson',
                date_of_birth: '1986-09-12',
                gender: 'male',
                address: '6415 W Belmont Ave, Chicago, IL, 60634',
                phone_number: '6304336478',
                email: 'michaelj86@gmail.com',
                emergency_contact_name: 'Michael Johnson',
                emergency_contact_phone: '6304336478'
            });
            await createPatient({
                first_name: 'Julia',
                last_name: 'Smith',
                date_of_birth: '1993-06-02',
                gender: 'female',
                address: '5701 N Lincoln Ave, Chicago, IL, 60659',
                phone_number: '3127060867',
                email: 'juliasmith93@gmail.com',
                emergency_contact_name: 'Julia Smith',
                emergency_contact_phone: '3127060867'
            });
            await createPatient({
                first_name: 'Elizabeth',
                last_name: 'Gonzalez',
                date_of_birth: '1999-08-15',
                gender: 'female',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '6747452312',
                email: 'egonzalez99@gmail.com',
                emergency_contact_name: 'Elizabeth Gonzalez',
                emergency_contact_phone: '6747452312'
                });
            await createPatient({
                first_name: 'Omar',
                last_name: 'Lee',
                date_of_birth: '1999-12-23',
                gender: 'male',
                address: '4444 W Peterson Ave, Chicago, IL, 60646',
                phone_number: '3435265567',
                email: 'olee99@gmail.com',
                emergency_contact_name: 'Omar Lee',
                emergency_contact_phone: '3435265567'
                });
            await createPatient({
                first_name: 'Isabel',
                last_name: 'Parker',
                date_of_birth: '1999-06-02',
                gender: 'female',
                address: '1234 N Lincoln Ave, Chicago, IL, 60601',
                phone_number: '8902345678',
                email: 'iparker99@gmail.com',
                emergency_contact_name: 'Isabel Parker',
                emergency_contact_phone: '8902345678'
                });
            await createPatient({
                first_name: 'Carlos',
                last_name: 'Johnson',
                date_of_birth: '1999-04-01',
                gender: 'male',
                address: '5678 W Belmont Ave, Chicago, IL, 60657',
                phone_number: '5678901234',
                email: 'cjohnson99@gmail.com',
                emergency_contact_name: 'Carlos Johnson',
                emergency_contact_phone: '5678901234'
                });
            await createPatient({
                first_name: 'Theresa',
                last_name: 'Henderson',
                date_of_birth: '1994-12-17',
                gender: 'female',
                address: '3336 W Augusta Blvd, Chicago, IL 60651',
                phone_number: '3478961235',
                email: 'thenderson94@gmail.com',
                emergency_contact_name: 'Theresa Henderson',
                emergency_contact_phone: '3478961235'
                });
            await createPatient({
                first_name: 'Nicholas',
                last_name: 'Johnson',
                date_of_birth: '2001-07-19',
                gender: 'male',
                address: '1234 Elm St, Dallas, TX 75301',
                phone_number: '6789012345',
                email: 'njohnson01@gmail.com',
                emergency_contact_name: 'Nicholas Johnson',
                emergency_contact_phone: '6789012345'
                });
            await createPatient({
                first_name: 'Maria',
                last_name: 'Gonzalez',
                date_of_birth: '1998-03-11',
                gender: 'female',
                address: '5678 Main St, New York, NY 10001',
                phone_number: '2345678901',
                email: 'mgonzalez98@gmail.com',
                emergency_contact_name: 'Maria Gonzalez',
                emergency_contact_phone: '2345678901'
                });
                
            await createPatient({
                first_name: 'William',
                last_name: 'Rodriguez',
                date_of_birth: '1996-05-24',
                gender: 'male',
                address: '9101 Market St, Philadelphia, PA 19101',
                phone_number: '3456789012',
                email: 'wrodriguez96@gmail.com',
                emergency_contact_name: 'William Rodriguez',
                emergency_contact_phone: '3456789012'
                });
            await createPatient({
                first_name: 'Nina',
                last_name: 'Lopez',
                date_of_birth: '1987-06-11',
                gender: 'female',
                address: '1233 W Belmont Ave, Chicago, IL, 60657',
                phone_number: '2174114851',
                email: 'nlopez87@gmail.com',
                emergency_contact_name: 'Nina Lopez',
                emergency_contact_phone: '2174114851'
                });
            await createPatient({
                first_name: 'David',
                last_name: 'Kim',
                date_of_birth: '1994-12-31',
                gender: 'male',
                address: '3711 N Sheffield Ave, Chicago, IL, 60613',
                phone_number: '2178638594',
                email: 'dkim94@gmail.com',
                emergency_contact_name: 'David Kim',
                emergency_contact_phone: '2178638594'
                });  
            await createPatient({
                first_name: 'Sophie',
                last_name: 'Smith',
                date_of_birth: '1999-03-12',
                gender: 'female',
                address: '859 N LaSalle Dr, Chicago, IL, 60610',
                phone_number: '3124563894',
                email: 'ssmith99@gmail.com',
                emergency_contact_name: 'Sophie Smith',
                emergency_contact_phone: '3124563894'
                });
            await createPatient({
                first_name: 'John',
                last_name: 'Brown',
                date_of_birth: '1991-08-17',
                gender: 'male',
                address: '333 W Wacker Dr, Chicago, IL, 60606',
                phone_number: '3124567891',
                email: 'jbrown91@gmail.com',
                emergency_contact_name: 'John Brown',
                emergency_contact_phone: '3124567891'
                });
            await createPatient({
                first_name: 'Diego',
                last_name: 'Henderson',
                date_of_birth: '1947-04-01',
                gender: 'male',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'dhenderson47@gmail.com',
                emergency_contact_name: 'Diego Henderson',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Ava',
                last_name: 'Hernandez',
                date_of_birth: '1956-05-23',
                gender: 'female',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'ahernandez56@gmail.com',
                emergency_contact_name: 'Ava Hernandez',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Ethan',
                last_name: 'Young',
                date_of_birth: '1965-06-13',
                gender: 'male',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'eyoung65@gmail.com',
                emergency_contact_name: 'Ethan Young',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Sophia',
                last_name: 'Garcia',
                date_of_birth: '1974-07-03',
                gender: 'female',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'sgarcia74@gmail.com',
                emergency_contact_name: 'Sophia Garcia',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Mason',
                last_name: 'Martinez',
                date_of_birth: '1983-08-23',
                gender: 'male',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'mmartinez83@gmail.com',
                emergency_contact_name: 'Mason Martinez',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Josue',
                last_name: 'Liu',
                date_of_birth: '1959-05-12',
                gender: 'male',
                address: '107 W Lake St, Northlake, IL, 60164',
                phone_number: '8476050366',
                email: 'jliu59@gmail.com',
                emergency_contact_name: 'Josue Liu',
                emergency_contact_phone: '8476050366'
                });
            await createPatient({
                first_name: 'Maggie',
                last_name: 'Kim',
                date_of_birth: '1977-06-23',
                gender: 'female',
                address: '4444 W Armitage Ave, Chicago, IL, 60639',
                phone_number: '7738401937',
                email: 'mkim77@gmail.com',
                emergency_contact_name: 'Maggie Kim',
                emergency_contact_phone: '7738401937'
                });
            await createPatient({
                first_name: 'David',
                last_name: 'Garcia',
                date_of_birth: '1984-09-08',
                gender: 'male',
                address: '2222 N Clark St, Chicago, IL, 60614',
                phone_number: '7736309821',
                email: 'dgarcia84@gmail.com',
                emergency_contact_name: 'David Garcia',
                emergency_contact_phone: '7736309821'
                });
            await createPatient({
                first_name: 'Sophia',
                last_name: 'Martinez',
                date_of_birth: '1992-11-15',
                gender: 'female',
                address: '5151 N Ravenswood Ave, Chicago, IL, 60640',
                phone_number: '7739201836',
                email: 'smartinez92@gmail.com',
                emergency_contact_name: 'Sophia Martinez',
                emergency_contact_phone: '7739201836'
                });
            await createPatient({
                first_name: 'Alexander',
                last_name: 'Williams',
                date_of_birth: '1999-07-01',
                gender: 'male',
                address: '1212 N Damen Ave, Chicago, IL, 60622',
                phone_number: '7736205831',
                email: 'awilliams99@gmail.com',
                emergency_contact_name: 'Alexander Williams',
                emergency_contact_phone: '7736205831'
                });
            await createPatient({
                first_name: 'Maurice',
                last_name: 'Chung',
                date_of_birth: '1969-04-08',
                gender: 'male',
                address: '4865 Elm St, Northbrook, IL, 60062',
                phone_number: '4696347587',
                email: 'mchung69@gmail.com',
                emergency_contact_name: 'Maurice Chung',
                emergency_contact_phone: '4696347587'
                });
            await createPatient({
                first_name: 'Evelyn',
                last_name: 'Kim',
                date_of_birth: '1958-07-12',
                gender: 'female',
                address: '5623 Madison Ave, Skokie, IL, 60077',
                phone_number: '2747394865',
                email: 'ekim58@gmail.com',
                emergency_contact_name: 'Evelyn Kim',
                emergency_contact_phone: '2747394865'
                });
            await createPatient({
                first_name: 'Juan',
                last_name: 'Gonzalez',
                date_of_birth: '1951-03-17',
                gender: 'male',
                address: '2936 Main St, Evanston, IL, 60202',
                phone_number: '5723497586',
                email: 'jgonzalez51@gmail.com',
                emergency_contact_name: 'Juan Gonzalez',
                emergency_contact_phone: '5723497586'
                });
            await createPatient({
                first_name: 'Maria',
                last_name: 'Garcia',
                date_of_birth: '1947-06-19',
                gender: 'female',
                address: '3287 Green Bay Rd, North Chicago, IL, 60064',
                phone_number: '5369874153',
                email: 'mgarcia47@gmail.com',
                emergency_contact_name: 'Maria Garcia',
                emergency_contact_phone: '5369874153'
                });
            await createPatient({
                first_name: 'Ralph',
                last_name: 'Foster',
                date_of_birth: '1962-11-01',
                gender: 'male',
                address: '4567 N Lake Shore Dr, Chicago, IL, 60657',
                phone_number: '9384675123',
                email: 'rfoster62@gmail.com',
                emergency_contact_name: 'Ralph Foster',
                emergency_contact_phone: '9384675123'
                });
            await createPatient({
                first_name: 'Eliza',
                last_name: 'Johnson',
                date_of_birth: '1961-08-17',
                gender: 'female',
                address: '4051 N Winthrop Ave, Chicago, IL, 60613',
                phone_number: '7379503387',
                email: 'ejohnson61@gmail.com',
                emergency_contact_name: 'Eliza Johnson',
                emergency_contact_phone: '7379503387'
                });
            await createPatient({
                first_name: 'Eduardo',
                last_name: 'Santos',
                date_of_birth: '1955-06-02',
                gender: 'male',
                address: '2307 W Belmont Ave, Chicago, IL, 60618',
                phone_number: '7379504376',
                email: 'esantos55@gmail.com',
                emergency_contact_name: 'Eduardo Santos',
                emergency_contact_phone: '7379504376'
                });
            await createPatient({
                first_name: 'Ava',
                last_name: 'Baker',
                date_of_birth: '1956-11-01',
                gender: 'female',
                address: '5731 N Lincoln Ave, Chicago, IL, 60659',
                phone_number: '7379502367',
                email: 'abaker56@gmail.com',
                emergency_contact_name: 'Ava Baker',
                emergency_contact_phone: '7379502367'
                });
            await createPatient({
                first_name: 'Lucas',
                last_name: 'Torres',
                date_of_birth: '1968-03-05',
                gender: 'male',
                address: '4654 N Pulaski Rd, Chicago, IL, 60641',
                phone_number: '7379503345',
                email: 'ltorres68@gmail.com',
                emergency_contact_name: 'Lucas Torres',
                emergency_contact_phone: '7379503345'
                });
            await createPatient({
                first_name: 'Sophia',
                last_name: 'Perez',
                date_of_birth: '1963-05-15',
                gender: 'female',
                address: '4867 N Kedzie Ave, Chicago, IL, 60625',
                phone_number: '7379502345',
                email: 'sperez63@gmail.com',
                emergency_contact_name: 'Sophia Perez',
                emergency_contact_phone: '7379502345'
                });
            await createPatient({
                first_name: 'Juan',
                last_name: 'Garcia',
                date_of_birth: '1960-12-01',
                gender: 'male',
                address: '3613 N Milwaukee Ave, Chicago, IL, 60641',
                phone_number: '7379502378',
                email: 'jgarcia60@gmail.com',
                emergency_contact_name: 'Juan Garcia',
                emergency_contact_phone: '7379502378'
                });
            await createPatient({
                first_name: 'Erik',
                last_name: 'Rios',
                date_of_birth: '1987-05-17',
                gender: 'male',
                address: '3303 N Lake Shore Dr, Chicago, IL, 60657',
                phone_number: '2069431724',
                email: 'erios87@gmail.com',
                emergency_contact_name: 'Erik Rios',
                emergency_contact_phone: '2069431724'
                });
            await createPatient({
                first_name: 'Mia',
                last_name: 'Kim',
                date_of_birth: '1958-12-14',
                gender: 'female',
                address: '110 W Kinzie St, Chicago, IL, 60654',
                phone_number: '9223398667',
                email: 'mkim58@gmail.com',
                emergency_contact_name: 'Mia Kim',
                emergency_contact_phone: '9223398667'
                });
            await createPatient({
                first_name: 'Karen',
                last_name: 'Wong',
                date_of_birth: '1980-08-06',
                gender: 'female',
                address: '345 W Fullerton Ave, Chicago, IL, 60614',
                phone_number: '8385857386',
                email: 'kwong80@gmail.com',
                emergency_contact_name: 'Karen Wong',
                emergency_contact_phone: '8385857386'
                });
            await createPatient({
                first_name: 'John',
                last_name: 'Garcia',
                date_of_birth: '1994-06-24',
                gender: 'male',
                address: '2901 N Sheffield Ave, Chicago, IL, 60657',
                phone_number: '4024291719',
                email: 'jgarcia94@gmail.com',
                emergency_contact_name: 'John Garcia',
                emergency_contact_phone: '4024291719'
                });
            await createPatient({
                first_name: 'Riley',
                last_name: 'Jackson',
                date_of_birth: '1999-01-19',
                gender: 'male',
                address: '823 W Grand Ave, Chicago, IL, 60622',
                phone_number: '4779361115',
                email: 'rjackson99@gmail.com',
                emergency_contact_name: 'Riley Jackson',
                emergency_contact_phone: '4779361115'
                });
            await createPatient({
                first_name: 'Emma',
                last_name: 'Lee',
                date_of_birth: '2001-03-12',
                gender: 'female',
                address: '1133 N Orleans St, Chicago, IL, 60610',
                phone_number: '1174291637',
                email: 'elee01@gmail.com',
                emergency_contact_name: 'Emma Lee',
                emergency_contact_phone: '1174291637'
                });
            await createPatient({
                first_name: 'Ismael',
                last_name: 'Perez',
                date_of_birth: '1958-06-23',
                gender: 'male',
                address: '7348 N California Ave, Chicago, IL, 60645',
                phone_number: '6245071388',
                email: 'iperez58@gmail.com',
                emergency_contact_name: 'Ismael Perez',
                emergency_contact_phone: '6245071388'
                });
            await createPatient({
                first_name: 'Samantha',
                last_name: 'Wang',
                date_of_birth: '1998-11-03',
                gender: 'female',
                address: '5501 N 7th Ave, Phoenix, AZ, 85013',
                phone_number: '5887182596',
                email: 'swang98@gmail.com',
                emergency_contact_name: 'Samantha Wang',
                emergency_contact_phone: '5887182596'
                });
            await createPatient({
                first_name: 'Nathan',
                last_name: 'Gonzalez',
                date_of_birth: '2002-03-25',
                gender: 'male',
                address: '902 S Main St, Fort Worth, TX, 76104',
                phone_number: '7095249860',
                email: 'ngonzalez02@gmail.com',
                emergency_contact_name: 'Nathan Gonzalez',
                emergency_contact_phone: '7095249860'
                });
            await createPatient({
                first_name: 'Evelyn',
                last_name: 'Jones',
                date_of_birth: '1962-01-08',
                gender: 'female',
                address: '1247 S Cloverdale Ave, Los Angeles, CA, 90019',
                phone_number: '9385066598',
                email: 'ejones62@gmail.com',
                emergency_contact_name: 'Evelyn Jones',
                emergency_contact_phone: '9385066598'
                });
            await createPatient({
                first_name: 'Sophia',
                last_name: 'Smith',
                date_of_birth: '2001-09-13',
                gender: 'female',
                address: '4444 W Grand Ave, Chicago, IL, 60639',
                phone_number: '6789034512',
                email: 'ssmith01@gmail.com',
                emergency_contact_name: 'Sophia Smith',
                emergency_contact_phone: '6789034512'
                });
            await createPatient({
                first_name: 'Jazmine',
                last_name: 'Henderson',
                date_of_birth: '1947-04-01',
                gender: 'female',
                address: '2239 E 75th St, Chicago, IL, 60649',
                phone_number: '8473603345',
                email: 'jhenderson47@gmail.com',
                emergency_contact_name: 'Jazmine Henderson',
                emergency_contact_phone: '8473603345'
                });
            await createPatient({
                first_name: 'Brayden',
                last_name: 'Chen',
                date_of_birth: '1971-07-24',
                gender: 'male',
                address: '11236 S Western Ave, Chicago, IL, 60643',
                phone_number: '7736248857',
                email: 'bchen71@gmail.com',
                emergency_contact_name: 'Brayden Chen',
                emergency_contact_phone: '7736248857'
                });
            await createPatient({
                first_name: 'Ava',
                last_name: 'Garcia',
                date_of_birth: '1999-11-05',
                gender: 'female',
                address: '2637 N Magnolia Ave, Chicago, IL, 60614',
                phone_number: '2245567892',
                email: 'agarcia99@gmail.com',
                emergency_contact_name: 'Ava Garcia',
                emergency_contact_phone: '2245567892'
                });
            await createPatient({
                first_name: 'Ethan',
                last_name: 'Kim',
                date_of_birth: '1997-06-12',
                gender: 'male',
                address: '6304 W Fullerton Ave, Chicago, IL, 60639',
                phone_number: '7708743321',
                email: 'ekim97@gmail.com',
                emergency_contact_name: 'Ethan Kim',
                emergency_contact_phone: '7708743321'
                });
            await createPatient({
                first_name: 'Isabelle',
                last_name: 'Lee',
                date_of_birth: '1995-01-15',
                gender: 'female',
                address: '5522 N Kedzie Ave, Chicago, IL, 60625',
                phone_number: '3125567891',
                email: 'ilee95@gmail.com',
                emergency_contact_name: 'Isabelle Lee',
                emergency_contact_phone: '3125567891'
                });
            await createPatient({
                first_name: 'Michael',
                last_name: 'Smith',
                date_of_birth: '1978-09-26',
                gender: 'male',
                address: '1203 Maple St, Des Moines, IA, 50314',
                phone_number: '7344488451',
                email: 'michaelsmith78@gmail.com',
                emergency_contact_name: 'Michael Smith',
                emergency_contact_phone: '7344488451'
                });
            await createPatient({
                first_name: 'Ashley',
                last_name: 'Johnson',
                date_of_birth: '1982-04-12',
                gender: 'female',
                address: '722 E Washington St, Phoenix, AZ, 85006',
                phone_number: '6245597382',
                email: 'ashleyj82@gmail.com',
                emergency_contact_name: 'Ashley Johnson',
                emergency_contact_phone: '6245597382'
                });
            await createPatient({
                first_name: 'William',
                last_name: 'Brown',
                date_of_birth: '1976-07-17',
                gender: 'male',
                address: '2215 W Grace St, Richmond, VA, 23220',
                phone_number: '8048643950',
                email: 'williamb76@gmail.com',
                emergency_contact_name: 'William Brown',
                emergency_contact_phone: '8048643950'
                });
            await createPatient({
                first_name: 'Jennifer',
                last_name: 'Davis',
                date_of_birth: '1981-03-15',
                gender: 'female',
                address: '3456 N Lincoln Ave, Denver, CO, 80205',
                phone_number: '7207652398',
                email: 'jenniferd81@gmail.com',
                emergency_contact_name: 'Jennifer Davis',
                emergency_contact_phone: '7207652398'
                });
            await createPatient({
                first_name: 'John',
                last_name: 'Miller',
                date_of_birth: '1979-06-22',
                gender: 'male',
                address: '1234 S Main St, Houston, TX, 77002',
                phone_number: '8175964310',
                email: 'johnm79@gmail.com',
                emergency_contact_name: 'John Miller',
                emergency_contact_phone: '8175964310'
                });
            await createPatient({
                first_name: 'Elizabeth',
                last_name: 'Wilson',
                date_of_birth: '1983-08-19',
                gender: 'female',
                address: '5678 W Main St, Seattle, WA, 98104',
                phone_number: '2069984135',
                email: 'elizabethw83@gmail.com',
                emergency_contact_name: 'Elizabeth Wilson',
                emergency_contact_phone: '2069984135'
                });
            await createPatient({
                first_name: 'Jasmine',
                last_name: 'Garcia',
                date_of_birth: '1988-01-17',
                gender: 'female',
                address: '1231 W Devon Ave, Chicago, IL, 60660',
                phone_number: '6479071429',
                email: 'jasminegarcia88@gmail.com',
                emergency_contact_name: 'Juan Garcia',
                emergency_contact_phone: '8479561234'
                });
            await createPatient({
                first_name: 'Ethan',
                last_name: 'Wang',
                date_of_birth: '1983-11-19',
                gender: 'male',
                address: '9986 N Mayfield Ave, Chicago, IL, 60656',
                phone_number: '8479060708',
                email: 'ethanwang83@gmail.com',
                emergency_contact_name: 'Linda Wang',
                emergency_contact_phone: '8479060708'
                });
            await createPatient({
                first_name: 'Emily',
                last_name: 'Kim',
                date_of_birth: '1977-06-02',
                gender: 'female',
                address: '1216 S Kedzie Ave, Chicago, IL, 60623',
                phone_number: '7082506089',
                email: 'emilykim77@gmail.com',
                emergency_contact_name: 'James Kim',
                emergency_contact_phone: '7082506089'
                });
            await createPatient({
                first_name: 'Nicholas',
                last_name: 'Nguyen',
                date_of_birth: '1989-03-05',
                gender: 'male',
                address: '5522 N Damen Ave, Chicago, IL, 60625',
                phone_number: '7089761234',
                email: 'nicholasnguyen89@gmail.com',
                emergency_contact_name: 'Tina Nguyen',
                emergency_contact_phone: '7089761234'
                });
            await createPatient({
                first_name: 'Ava',
                last_name: 'Lee',
                date_of_birth: '1992-08-24',
                gender: 'female',
                address: '2312 W Belmont Ave, Chicago, IL, 60618',
                phone_number: '7089357890',
                email: 'avalee92@gmail.com',
                emergency_contact_name: 'Peter Lee',
                emergency_contact_phone: '7089357890'
                });
            await createPatient({
                first_name: 'Liam',
                last_name: 'Martinez',
                date_of_birth: '1981-12-11',
                gender: 'male',
                address: '9876 N Western Ave, Chicago, IL, 60645',
                phone_number: '7089456789',
                email: 'liammartinez81@gmail.com',
                emergency_contact_name: 'Maria Martinez',
                emergency_contact_phone: '7089456789'
                });
            await createPatient({
                    first_name: 'Avery',
                    last_name: 'Johnson',
                    date_of_birth: '1974-06-03',
                    gender: 'male',
                    address: '6055 W Belmont Ave, Chicago, IL 60634',
                    phone_number: '7735416756',
                    email: 'ajohnson74@gmail.com',
                    emergency_contact_name: 'Caroline Johnson',
                    emergency_contact_phone: '7735668854'
                });
            await createPatient({
                first_name: 'Adam',
                last_name: 'Williams',
                date_of_birth: '1991-12-20',
                gender: 'male',
                address: '1601 E 53rd St, Chicago, IL 60615',
                phone_number: '7738772216',
                email: 'awilliams91@gmail.com',
                emergency_contact_name: 'Beth Williams',
                emergency_contact_phone: '7738994488'
            });
            await createPatient({
                first_name: 'Ava',
                last_name: 'Jones',
                date_of_birth: '1989-01-15',
                gender: 'female',
                address: '4858 N Lake Shore Dr, Chicago, IL 60640',
                phone_number: '7738221144',
                email: 'ajones89@gmail.com',
                emergency_contact_name: 'Charles Jones',
                emergency_contact_phone: '7738332299'
            });
            await createPatient({
                first_name: 'Ashley',
                last_name: 'Brown',
                date_of_birth: '1996-04-19',
                gender: 'female',
                address: '2555 W Peterson Ave, Chicago, IL 60659',
                phone_number: '7739115566',
                email: 'abrown96@gmail.com',
                emergency_contact_name: 'Daniel Brown',
                emergency_contact_phone: '7739227788'
            });
            await createPatient({
                first_name: 'Austin',
                last_name: 'Davis',
                date_of_birth: '1992-08-02',
                gender: 'male',
                address: '5151 N Broadway St, Chicago, IL 60640',
                phone_number: '7739441133',
                email: 'adavis92@gmail.com',
                emergency_contact_name: 'Emily Davis',
                emergency_contact_phone: '7739552211'
            });
            await createPatient({
                first_name: 'Aiden',
                last_name: 'Miller',
                date_of_birth: '1998-03-05',
                gender: 'male',
                address: '1501 W Fullerton Ave, Chicago, IL 60614',
                phone_number: '7739664455',
                email: 'amiller98@gmail.com',
                emergency_contact_name: 'Frances Miller',
                emergency_contact_phone: '7739776611'
            });
            await createPatient({
                first_name: 'Brianna',
                last_name: 'Brown',
                date_of_birth: '1982-06-21',
                gender: 'female',
                address: '102 S Michigan Ave, Chicago, IL 60603',
                phone_number: '7739521265',
                email: 'bbrown82@gmail.com',
                emergency_contact_name: 'Ethan Green',
                emergency_contact_phone: '7739521265'
            });  
            await createPatient({
                first_name: 'Brittany',
                last_name: 'Baker',
                date_of_birth: '1990-03-02',
                gender: 'female',
                address: '1819 N Racine Ave, Chicago, IL 60657',
                phone_number: '7739521265',
                email: 'bbaker90@gmail.com',
                emergency_contact_name: 'Emma White',
                emergency_contact_phone: '7739521265'
            });
            await createPatient({
                first_name: 'Benjamin',
                last_name: 'Bailey',
                date_of_birth: '1995-12-01',
                gender: 'male',
                address: '4747 W Fullerton Ave, Chicago, IL 60639',
                phone_number: '7739521265',
                email: 'bbailey95@gmail.com',
                emergency_contact_name: 'Alex Rodriguez',
                emergency_contact_phone: '7739521265'
            });
            await createPatient({
                first_name: 'Brandon',
                last_name: 'Brooks',
                date_of_birth: '1997-08-11',
                gender: 'male',
                address: '57 W Grand Ave, Chicago, IL 60654',
                phone_number: '7739521265',
                email: 'bbrooks97@gmail.com',
                emergency_contact_name: 'Avery Jones',
                emergency_contact_phone: '7739521265'
            });
            await createPatient({
                first_name: 'Bryant',
                last_name: 'Byrd',
                date_of_birth: '1999-05-05',
                gender: 'male',
                address: '2828 N Ashland Ave, Chicago, IL 60657',
                phone_number: '7739521265',
                email: 'bbyrd99@gmail.com',
                emergency_contact_name: 'Abby Smith',
                emergency_contact_phone: '7739521265'
            });
            await createPatient({
                first_name: 'Bridgette',
                last_name: 'Black',
                date_of_birth: '1992-01-22',
                gender: 'female',
                address: '3133 N Clark St, Chicago, IL 60657',
                phone_number: '7739521265',
                email: 'bblack92@gmail.com',
                emergency_contact_name: 'Adam Johnson',
                emergency_contact_phone: '7739521265'
            });
            await createPatient({
                first_name: 'Caroline',
                last_name: 'Chang',
                date_of_birth: '1958-06-15',
                gender: 'female',
                address: '1234 Elm St, Chicago, IL 60601',
                phone_number: '3125551023',
                email: 'cchang58@gmail.com',
                emergency_contact_name: 'David Chang',
                emergency_contact_phone: '3125551023'
                });
            await createPatient({
                first_name: 'Curtis',
                last_name: 'Collins',
                date_of_birth: '1980-05-07',
                gender: 'male',
                address: '4321 Oak St, Chicago, IL 60601',
                phone_number: '3125551024',
                email: 'ccollins80@gmail.com',
                emergency_contact_name: 'Caroline Collins',
                emergency_contact_phone: '3125551024'
            });
            await createPatient({
                first_name: 'Claire',
                last_name: 'Carpenter',
                date_of_birth: '1994-03-19',
                gender: 'female',
                address: '2468 Maple St, Chicago, IL 60601',
                phone_number: '3125551025',
                email: 'ccarpenter94@gmail.com',
                emergency_contact_name: 'Curtis Carpenter',
                emergency_contact_phone: '3125551025'
            });
            await createPatient({
                first_name: 'Caleb',
                last_name: 'Campbell',
                date_of_birth: '1986-01-12',
                gender: 'male',
                address: '1212 Pine St, Chicago, IL 60601',
                phone_number: '3125551026',
                email: 'ccampbell86@gmail.com',
                emergency_contact_name: 'Claire Campbell',
                emergency_contact_phone: '3125551026'
            });
            await createPatient({
                first_name: 'Cindy',
                last_name: 'Chen',
                date_of_birth: '1976-09-23',
                gender: 'female',
                address: '2345 Cedar St, Chicago, IL 60601',
                phone_number: '3125551027',
                email: 'cchen76@gmail.com',
                emergency_contact_name: 'Caleb Chen',
                emergency_contact_phone: '3125551027'
            });
            await createPatient({
                first_name: 'Craig',
                last_name: 'Carter',
                date_of_birth: '1968-07-29',
                gender: 'male',
                address: '3456 Birch St, Chicago, IL 60601',
                phone_number: '3125551028',
                email: 'ccarter68@gmail.com',
                emergency_contact_name: 'Cindy Carter',
                emergency_contact_phone: '3125551028'
            });
            await createPatient({
                first_name: 'Damon',
                last_name: 'Nguyen',
                date_of_birth: '1957-11-12',
                gender: 'male',
                address: '3034 W Montrose Ave, Chicago, IL, 60618',
                phone_number: '2145354132',
                email: 'damonnguyen57@gmail.com',
                emergency_contact_name: 'Hoa Nguyen',
                emergency_contact_phone: '6479521132'
                });
            await createPatient({
                first_name: 'Daniel',
                last_name: 'Kim',
                date_of_birth: '1989-07-23',
                gender: 'male',
                address: '1723 N Keystone Ave, Evanston, IL, 60201',
                phone_number: '8479522652',
                email: 'dkim89@gmail.com',
                emergency_contact_name: 'Jin Kim',
                emergency_contact_phone: '2249522652'
            });
            await createPatient({
                first_name: 'Daphne',
                last_name: 'Ramirez',
                date_of_birth: '1999-04-19',
                gender: 'female',
                address: '8234 W Howard St, Skokie, IL, 60077',
                phone_number: '2249522652',
                email: 'dramirez99@gmail.com',
                emergency_contact_name: 'Josie Ramirez',
                emergency_contact_phone: '2249522652'
            });
            await createPatient({
                first_name: 'David',
                last_name: 'Hernandez',
                date_of_birth: '1981-12-31',
                gender: 'male',
                address: '2334 W Montrose Ave, Chicago, IL, 60618',
                phone_number: '8479522652',
                email: 'dhernandez81@gmail.com',
                emergency_contact_name: 'Lena Hernandez',
                emergency_contact_phone: '2249522652'
            });
            await createPatient({
                first_name: 'Debra',
                last_name: 'Garcia',
                date_of_birth: '1974-06-23',
                gender: 'female',
                address: '3034 W Montrose Ave, Chicago, IL, 60618',
                phone_number: '2249522652',
                email: 'dgarcia74@gmail.com',
                emergency_contact_name: 'Juan Garcia',
                emergency_contact_phone: '2249522652'
            });
            await createPatient({
                first_name: 'Derek',
                last_name: 'Clark',
                date_of_birth: '2002-01-19',
                gender: 'male',
                address: '1234 W Howard St, Skokie, IL, 60077',
                phone_number: '2249522652',
                email: 'dclark02@gmail.com',
                emergency_contact_name: 'Janet Clark',
                emergency_contact_phone: '2249522652'
            });
            await createPatient({
                first_name: 'Derek',
                last_name: 'Parker',
                date_of_birth: '1967-07-01',
                gender: 'male',
                address: '1023 W Division St, Chicago, IL 60642',
                phone_number: '3314148765',
                email: 'dparker67@gmail.com',
                emergency_contact_name: 'Debra Parker',
                emergency_contact_phone: '3314148766'
                });
            await createPatient({
                first_name: 'Daisy',
                last_name: 'Johnson',
                date_of_birth: '1981-03-08',
                gender: 'female',
                address: '4321 N Western Ave, Chicago, IL 60618',
                phone_number: '2223334445',
                email: 'dajohnson81@gmail.com',
                emergency_contact_name: 'David Johnson',
                emergency_contact_phone: '2223334446'
            });
            await createPatient({
                first_name: 'Daniel',
                last_name: 'Brown',
                date_of_birth: '1974-05-12',
                gender: 'male',
                address: '2345 N Milwaukee Ave, Chicago, IL 60647',
                phone_number: '1112223333',
                email: 'dbrown74@gmail.com',
                emergency_contact_name: 'Denise Brown',
                emergency_contact_phone: '1112223334'
            });
            await createPatient({
                first_name: 'Diana',
                last_name: 'Davis',
                date_of_birth: '1978-01-24',
                gender: 'female',
                address: '1234 S State St, Chicago, IL 60605',
                phone_number: '4442223333',
                email: 'ddavis78@gmail.com',
                emergency_contact_name: 'David Davis',
                emergency_contact_phone: '4442223334'
            });
            await createPatient({
                first_name: 'David',
                last_name: 'Johnson',
                date_of_birth: '1982-06-02',
                gender: 'male',
                address: '5678 W Madison St, Chicago, IL 60661',
                phone_number: '5552223333',
                email: 'djohnson82@gmail.com',
                emergency_contact_name: 'Donna Johnson',
                emergency_contact_phone: '5552223334'
            });
            await createPatient({
                first_name: 'Derek',
                last_name: 'Smith',
                date_of_birth: '1980-11-15',
                gender: 'male',
                address: '9012 S Halsted St, Chicago, IL 60620',
                phone_number: '6662223333',
                email: 'dsmith80@gmail.com',
                emergency_contact_name: 'Diana Smith',
                emergency_contact_phone: '6662223334'
            });
            await createPatient({
                first_name: 'Eddie',
                last_name: 'Johnson',
                date_of_birth: '1968-03-07',
                gender: 'male',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379572652',
                email: 'ejohnson68@gmail.com',
                emergency_contact_name: 'Evelyn Johnson',
                emergency_contact_phone: '7379572652'
                });
            await createPatient({
                first_name: 'Ella',
                last_name: 'Wright',
                date_of_birth: '1978-05-13',
                gender: 'female',
                address: '1223 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379572652',
                email: 'ewright78@gmail.com',
                emergency_contact_name: 'Ethan Wright',
                emergency_contact_phone: '7379572652'
            });
            await createPatient({
                first_name: 'Ethan',
                last_name: 'Jones',
                date_of_birth: '1988-07-19',
                gender: 'male',
                address: '1323 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379572652',
                email: 'ejones88@gmail.com',
                emergency_contact_name: 'Ella Jones',
                emergency_contact_phone: '7379572652'
            });
            await createPatient({
                first_name: 'Evelyn',
                last_name: 'Smith',
                date_of_birth: '1998-09-25',
                gender: 'female',
                address: '1423 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379572652',
                email: 'esmith98@gmail.com',
                emergency_contact_name: 'Eddie Smith',
                emergency_contact_phone: '7379572652'
            });
            await createPatient({
                first_name: 'Erick',
                last_name: 'Brown',
                date_of_birth: '2008-11-01',
                gender: 'male',
                address: '1523 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379572652',
                email: 'ebrown08@gmail.com',
                emergency_contact_name: 'Evelyn Brown',
                emergency_contact_phone: '7379572652'
            });
            await createPatient({
                first_name: 'Eve',
                last_name: 'Davis',
                date_of_birth: '2018-01-07',
                gender: 'female',
                address: '1623 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379572652',
                email: 'edavis18@gmail.com',
                emergency_contact_name: 'Erick Davis',
                emergency_contact_phone: '7379572652'
            });
            await createPatient({
                first_name: 'Felix',
                last_name: 'Lopez',
                date_of_birth: '1969-03-15',
                gender: 'male',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'flopez69@gmail.com',
                emergency_contact_name: 'Francisco Lopez',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Frances',
                last_name: 'Mendoza',
                date_of_birth: '1980-05-20',
                gender: 'female',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'fmendoza80@gmail.com',
                emergency_contact_name: 'Fernando Mendoza',
                emergency_contact_phone: '7379522652'
            });
                await createPatient({
                first_name: 'Fidel',
                last_name: 'Garcia',
                date_of_birth: '1988-07-10',
                gender: 'male',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'fgarcia88@gmail.com',
                emergency_contact_name: 'Fernanda Garcia',
                emergency_contact_phone: '7379522652'
            });
            await createPatient({
                first_name: 'Flora',
                last_name: 'Rodriguez',
                date_of_birth: '1961-11-01',
                gender: 'female',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'frodriguez61@gmail.com',
                emergency_contact_name: 'Freddy Rodriguez',
                emergency_contact_phone: '7379522652'
            });
            await createPatient({
                first_name: 'Fernanda',
                last_name: 'Martinez',
                date_of_birth: '1993-06-07',
                gender: 'female',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'fmartinez93@gmail.com',
                emergency_contact_name: 'Frank Martinez',
                emergency_contact_phone: '7379522652'
            });    
            await createPatient({
                first_name: 'Freddy',
                last_name: 'Sanchez',
                date_of_birth: '1974-12-25',
                gender: 'male',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'fsanchez74@gmail.com',
                emergency_contact_name: 'Felipe Sanchez',
                emergency_contact_phone: '7379522652'
            });
            await createPatient({
                first_name: 'Gary',
                last_name: 'Smith',
                date_of_birth: '1960-07-05',
                gender: 'male',
                address: '1234 Main St, San Francisco, CA 94102',
                phone_number: '4155556789',
                email: 'gsmith@gmail.com',
                emergency_contact_name: 'Gary Smith Sr.',
                emergency_contact_phone: '4155556788'
                });
            await createPatient({
                first_name: 'Gloria',
                last_name: 'Johnson',
                date_of_birth: '1965-01-12',
                gender: 'female',
                address: '567 Elm St, Dallas, TX 75201',
                phone_number: '2145556789',
                email: 'gjohnson@gmail.com',
                emergency_contact_name: 'Gloria Johnson Sr.',
                emergency_contact_phone: '2145556788'
            });
            await createPatient({
                first_name: 'Greg',
                last_name: 'Brown',
                date_of_birth: '1970-06-01',
                gender: 'male',
                address: '901 Maple Ave, Seattle, WA 98104',
                phone_number: '2065556789',
                email: 'gbrown@gmail.com',
                emergency_contact_name: 'Greg Brown Sr.',
                emergency_contact_phone: '2065556788'
            });
            await createPatient({
                first_name: 'Gary',
                last_name: 'Davis',
                date_of_birth: '1975-03-15',
                gender: 'male',
                address: '1234 Main St, Atlanta, GA 30303',
                phone_number: '4045556789',
                email: 'gdavis@gmail.com',
                emergency_contact_name: 'Gary Davis Sr.',
                emergency_contact_phone: '4045556788'
            });
            await createPatient({
                first_name: 'Grace',
                last_name: 'Miller',
                date_of_birth: '1980-05-25',
                gender: 'female',
                address: '567 Elm St, Miami, FL 33131',
                phone_number: '3055556789',
                email: 'gmiller@gmail.com',
                emergency_contact_name: 'Grace Miller Sr.',
                emergency_contact_phone: '3055556788'
            });
            await createPatient({
                first_name: 'Gordon',
                last_name: 'Wilson',
                date_of_birth: '1985-02-28',
                gender: 'male',
                address: '901 Maple Ave, Denver, CO 80202',
                phone_number: '3035556789',
                email: 'gwilson@gmail.com',
                emergency_contact_name: 'Gordon Wilson Sr.',
                emergency_contact_phone: '3035556788'
            });
            await createPatient({
                first_name: 'Harold',
                last_name: 'Johnson',
                date_of_birth: '1978-04-08',
                gender: 'male',
                address: '2704 W Division St, Chicago, IL, 60622',
                phone_number: '7372688255',
                email: 'hjohnson78@gmail.com',
                emergency_contact_name: 'Helen Johnson',
                emergency_contact_phone: '7372688255'
                });
            await createPatient({
                first_name: 'Hazel',
                last_name: 'Brown',
                date_of_birth: '1962-06-18',
                gender: 'female',
                address: '1550 N Damen Ave, Chicago, IL, 60622',
                phone_number: '7372688255',
                email: 'hbrown62@gmail.com',
                emergency_contact_name: 'Herbert Brown',
                emergency_contact_phone: '7372688255'
            });
            await createPatient({
                first_name: 'Harper',
                last_name: 'Davis',
                date_of_birth: '2000-09-22',
                gender: 'female',
                address: '1901 W Cermak Rd, Chicago, IL, 60608',
                phone_number: '7372688255',
                email: 'hdavis00@gmail.com',
                emergency_contact_name: 'Heather Davis',
                emergency_contact_phone: '7372688255'
            });
            await createPatient({
                first_name: 'Harrison',
                last_name: 'Miller',
                date_of_birth: '1984-12-15',
                gender: 'male',
                address: '1755 W North Ave, Chicago, IL, 60622',
                phone_number: '7372688255',
                email: 'hmiller84@gmail.com',
                emergency_contact_name: 'Henry Miller',
                emergency_contact_phone: '7372688255'
            });
            await createPatient({
                first_name: 'Haley',
                last_name: 'Wilson',
                date_of_birth: '1996-03-12',
                gender: 'female',
                address: '1550 W Grand Ave, Chicago, IL, 60622',
                phone_number: '7372688255',
                email: 'hwilson96@gmail.com',
                emergency_contact_name: 'Holly Wilson',
                emergency_contact_phone: '7372688255'
            });
            await createPatient({
                first_name: 'Hank',
                last_name: 'Taylor',
                date_of_birth: '1991-01-20',
                gender: 'male',
                address: '2704 W Division St, Chicago, IL, 60622',
                phone_number: '7372688255',
                email: 'htaylor91@gmail.com',
                emergency_contact_name: 'Harold Taylor',
                emergency_contact_phone: '7372688255'
            });
            await createPatient({
                first_name: 'Isla',
                last_name: 'Wang',
                date_of_birth: '1974-06-18',
                gender: 'female',
                address: '1832 E 95th St, Chicago, IL, 60619',
                phone_number: '8375973640',
                email: 'iwang74@gmail.com',
                emergency_contact_name: 'Ian Wang',
                emergency_contact_phone: '8375973640'
                });
            await createPatient({
                first_name: 'Ian',
                last_name: 'Mendoza',
                date_of_birth: '1977-11-26',
                gender: 'male',
                address: '1417 S Canal St, Chicago, IL, 60607',
                phone_number: '6629488519',
                email: 'imendoza77@gmail.com',
                emergency_contact_name: 'Iris Mendoza',
                emergency_contact_phone: '6629488519'
            });
            await createPatient({
                first_name: 'Iris',
                last_name: 'Chen',
                date_of_birth: '1980-01-08',
                gender: 'female',
                address: '2239 N Milwaukee Ave, Chicago, IL, 60647',
                phone_number: '9807334621',
                email: 'ichen80@gmail.com',
                emergency_contact_name: 'Isaac Chen',
                emergency_contact_phone: '9807334621'
            });
            await createPatient({
                first_name: 'Isaac',
                last_name: 'Khan',
                date_of_birth: '1982-05-17',
                gender: 'male',
                address: '2504 N Lake Shore Dr, Chicago, IL, 60614',
                phone_number: '5908342735',
                email: 'ikhan82@gmail.com',
                emergency_contact_name: 'Ivy Khan',
                emergency_contact_phone: '5908342735'
            });
            await createPatient({
                first_name: 'Ivy',
                last_name: 'Carr',
                date_of_birth: '1984-09-23',
                gender: 'female',
                address: '1021 S Wabash Ave, Chicago, IL, 60605',
                phone_number: '3897452631',
                email: 'icarr84@gmail.com',
                emergency_contact_name: 'Ismael Carr',
                emergency_contact_phone: '3897452631'
            });
            await createPatient({
                first_name: 'Ismael',
                last_name: 'Gonzalez',
                date_of_birth: '1987-12-04',
                gender: 'male',
                address: '1251 N LaSalle Dr, Chicago, IL, 60610',
                phone_number: '2907854613',
                email: 'igonzalez87@gmail.com',
                emergency_contact_name: 'Irina Gonzalez',
                emergency_contact_phone: '2907854613'
            });
            await createPatient({
                first_name: 'James',
                last_name: 'Fernandez',
                date_of_birth: '1956-07-11',
                gender: 'male',
                address: '1117 S State St, Chicago, IL, 60605',
                phone_number: '7315220652',
                email: 'jfernandez56@gmail.com',
                emergency_contact_name: 'Isabel Fernandez',
                emergency_contact_phone: '7315220652'
                });
            await createPatient({
                first_name: 'Julie',
                last_name: 'Perez',
                date_of_birth: '1958-08-20',
                gender: 'female',
                address: '5317 W Belmont Ave, Chicago, IL, 60641',
                phone_number: '7315220652',
                email: 'jperez58@gmail.com',
                emergency_contact_name: 'Juan Perez',
                emergency_contact_phone: '7315220652'
                });
            await createPatient({
                first_name: 'John',
                last_name: 'Kim',
                date_of_birth: '1962-09-15',
                gender: 'male',
                address: '2120 N Ashland Ave, Chicago, IL, 60614',
                phone_number: '7315220652',
                email: 'jkim62@gmail.com',
                emergency_contact_name: 'Jane Kim',
                emergency_contact_phone: '7315220652'
                });
            await createPatient({
                first_name: 'Jessica',
                last_name: 'Park',
                date_of_birth: '1966-10-06',
                gender: 'female',
                address: '3626 W Lawrence Ave, Chicago, IL, 60625',
                phone_number: '7315220652',
                email: 'jpark66@gmail.com',
                emergency_contact_name: 'John Park',
                emergency_contact_phone: '7315220652'
                });
            await createPatient({
                first_name: 'Jim',
                last_name: 'Lee',
                date_of_birth: '1960-11-02',
                gender: 'male',
                address: '4711 N Broadway St, Chicago, IL, 60640',
                phone_number: '7315220652',
                email: 'jlee60@gmail.com',
                emergency_contact_name: 'Jasmine Lee',
                emergency_contact_phone: '7315220652'
                });
            await createPatient({
                first_name: 'Jackie',
                last_name: 'Smith',
                date_of_birth: '1964-12-12',
                gender: 'female',
                address: '2517 N Halsted St, Chicago, IL, 60614',
                phone_number: '7315220652',
                email: 'jsmith64@gmail.com',
                emergency_contact_name: 'James Smith',
                emergency_contact_phone: '7315220652'
                });
            await createPatient({
                first_name: 'Karen',
                last_name: 'Davies',
                date_of_birth: '1947-06-02',
                gender: 'female',
                address: '24 W Lake St, Northlake, IL, 60164',
                phone_number: '8476253298',
                email: 'kdavies47@gmail.com',
                emergency_contact_name: 'Karen Davies',
                emergency_contact_phone: '8476253298'
                });
                await createPatient({
                first_name: 'Keith',
                last_name: 'Webb',
                date_of_birth: '1952-09-12',
                gender: 'male',
                address: '1224 S Dearborn St, Chicago, IL, 60605',
                phone_number: '3126529847',
                email: 'kwebb52@gmail.com',
                emergency_contact_name: 'Keith Webb',
                emergency_contact_phone: '3126529847'
                });
            await createPatient({
                first_name: 'Kimberly',
                last_name: 'Burke',
                date_of_birth: '1957-04-17',
                gender: 'female',
                address: '1402 N Kedzie Ave, Chicago, IL, 60651',
                phone_number: '7739522463',
                email: 'kburke57@gmail.com',
                emergency_contact_name: 'Kimberly Burke',
                emergency_contact_phone: '7739522463'
                });
            await createPatient({
                first_name: 'Kirsten',
                last_name: 'Mills',
                date_of_birth: '1962-08-11',
                gender: 'female',
                address: '202 S Arlington Heights Rd, Arlington Heights, IL, 60005',
                phone_number: '8472593642',
                email: 'kmills62@gmail.com',
                emergency_contact_name: 'Kirsten Mills',
                emergency_contact_phone: '8472593642'
                });
            await createPatient({
                first_name: 'Kurt',
                last_name: 'Henderson',
                date_of_birth: '1967-12-23',
                gender: 'male',
                address: '2323 W Devon Ave, Chicago, IL, 60659',
                phone_number: '7736254987',
                email: 'khenderson67@gmail.com',
                emergency_contact_name: 'Kurt Henderson',
                emergency_contact_phone: '7736254987'
                });
            await createPatient({
                first_name: 'Karen',
                last_name: 'Baker',
                date_of_birth: '1972-03-19',
                gender: 'female',
                address: '534 N La Salle Dr, Chicago, IL, 60654',
                phone_number: '3129562378',
                email: 'kbaker72@gmail.com',
                emergency_contact_name: 'Karen Baker',
                emergency_contact_phone: '3129562378'
                });
            await createPatient({
                first_name: 'Lana',
                last_name: 'Kang',
                date_of_birth: '1947-05-02',
                gender: 'female',
                address: '1823 S Michigan Ave, Chicago, IL 60616',
                phone_number: '7345128963',
                email: 'lkang47@gmail.com',
                emergency_contact_name: 'Lana Kang',
                emergency_contact_phone: '7345128963'
                });
            await createPatient({
                first_name: 'Liam',
                last_name: 'Nguyen',
                date_of_birth: '1948-11-19',
                gender: 'male',
                address: '823 W North Ave, Chicago, IL 60610',
                phone_number: '7398765412',
                email: 'lnguyen48@gmail.com',
                emergency_contact_name: 'Liam Nguyen',
                emergency_contact_phone: '7398765412'
                });
            await createPatient({
                first_name: 'Lucas',
                last_name: 'Park',
                date_of_birth: '1946-07-24',
                gender: 'male',
                address: '3123 N Ashland Ave, Chicago, IL 60657',
                phone_number: '7387654512',
                email: 'lpark46@gmail.com',
                emergency_contact_name: 'Lucas Park',
                emergency_contact_phone: '7387654512'
                });
            await createPatient({
                first_name: 'Leah',
                last_name: 'Kim',
                date_of_birth: '1944-03-05',
                gender: 'female',
                address: '4523 S Archer Ave, Chicago, IL 60609',
                phone_number: '7341258963',
                email: 'lkim44@gmail.com',
                emergency_contact_name: 'Leah Kim',
                emergency_contact_phone: '7341258963'
                });
            await createPatient({
                first_name: 'Lila',
                last_name: 'Brown',
                date_of_birth: '1949-06-14',
                gender: 'female',
                address: '5123 W Chicago Ave, Chicago, IL 60651',
                phone_number: '7345678912',
                email: 'lbrown49@gmail.com',
                emergency_contact_name: 'Lila Brown',
                emergency_contact_phone: '7345678912'
                });
            await createPatient({
                first_name: 'Lionel',
                last_name: 'Jones',
                date_of_birth: '1947-12-08',
                gender: 'male',
                address: '1223 N Halsted St, Chicago, IL 60610',
                phone_number: '7398745612',
                email: 'ljones47@gmail.com',
                emergency_contact_name: 'Lionel Jones',
                emergency_contact_phone: '7398745612'
                });
            await createPatient({
                first_name: 'Maddison',
                last_name: 'Lewis',
                date_of_birth: '1999-08-19',
                gender: 'female',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'mlewis99@gmail.com',
                emergency_contact_name: 'Martha Lewis',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Maurice',
                last_name: 'Henderson',
                date_of_birth: '1998-11-19',
                gender: 'male',
                address: '1723 N Keystone Ave, Evanston, IL, 60651',
                phone_number: '7379522652',
                email: 'mhenderson98@gmail.com',
                emergency_contact_name: 'Martha Henderson',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Makayla',
                last_name: 'Rogers',
                date_of_birth: '2000-07-19',
                gender: 'female',
                address: '1723 N Keystone Ave, Schaumburg, IL, 60651',
                phone_number: '7379522652',
                email: 'mrogers00@gmail.com',
                emergency_contact_name: 'Maggie Rogers',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Maurice',
                last_name: 'Brown',
                date_of_birth: '1997-09-19',
                gender: 'male',
                address: '1723 N Keystone Ave, Naperville, IL, 60651',
                phone_number: '7379522652',
                email: 'mbrown97@gmail.com',
                emergency_contact_name: 'Maggie Brown',
                emergency_contact_phone: '7379522652'
                });
            await createPatient({
                first_name: 'Megan',
                last_name: 'Johnson',
                date_of_birth: '1998-05-19',
                gender: 'female',
                address: '1723 N Keystone Ave, Northbrook, IL, 60651',
                phone_number: '7379522652',
                email: 'mjohnson98@gmail.com',
                emergency_contact_name: 'Martha Johnson',
                emergency_contact_phone: '7379522652'
            });
            await createPatient({
                first_name: 'Mia',
                last_name: 'Smith',
                date_of_birth: '1999-06-19',
                gender: 'female',
                address: '1723 N Keystone Ave, Skokie, IL, 60651',
                phone_number: '7379522652',
                email: 'msmith99@gmail.com',
                emergency_contact_name: 'Martha Smith',
                emergency_contact_phone: '7379522652'
            });
            await createPatient({
                first_name: 'Nathan',
                last_name: 'Martinez',
                date_of_birth: '1957-06-08',
                gender: 'male',
                address: '7315 W Madison St, Chicago, IL, 60661',
                phone_number: '3129044838',
                email: 'nmartinez57@gmail.com',
                emergency_contact_name: 'Nora Martinez',
                emergency_contact_phone: '3129044838'
            });
            await createPatient({
                first_name: 'Nico',
                last_name: 'Hernandez',
                date_of_birth: '1967-12-18',
                gender: 'male',
                address: '6633 N Kedzie Ave, Chicago, IL, 60645',
                phone_number: '3122904298',
                email: 'nhernandez67@gmail.com',
                emergency_contact_name: 'Nina Hernandez',
                emergency_contact_phone: '3122904298'
            });
            await createPatient({
                first_name: 'Noah',
                last_name: 'Gonzalez',
                date_of_birth: '1977-03-20',
                gender: 'male',
                address: '5232 W Grand Ave, Chicago, IL, 60639',
                phone_number: '3129563298',
                email: 'ngonzalez77@gmail.com',
                emergency_contact_name: 'Nora Gonzalez',
                emergency_contact_phone: '3129563298'
            });
            await createPatient({
                first_name: 'Nina',
                last_name: 'Sanchez',
                date_of_birth: '1987-08-19',
                gender: 'female',
                address: '4050 W Armitage Ave, Chicago, IL, 60639',
                phone_number: '3122907838',
                email: 'nsanchez87@gmail.com',
                emergency_contact_name: 'Nico Sanchez',
                emergency_contact_phone: '3122907838'
            });
                await createPatient({
                first_name: 'Nora',
                last_name: 'Perez',
                date_of_birth: '1997-01-25',
                gender: 'female',
                address: '3250 N Oak Park Ave, Chicago, IL, 60634',
                phone_number: '3123467838',
                email: 'nperez97@gmail.com',
                emergency_contact_name: 'Nathan Perez',
                emergency_contact_phone: '3123467838'
            });
            await createPatient({
                first_name: 'Natalie',
                last_name: 'Rivera',
                date_of_birth: '2007-09-13',
                gender: 'female',
                address: '2424 W North Ave, Chicago, IL, 60647',
                phone_number: '3129044838',
                email: 'nrivera07@gmail.com',
                emergency_contact_name: 'Nico Rivera',
                emergency_contact_phone: '3129044838'
            });
            await createPatient({
                first_name: 'Olivia',
                last_name: 'Nguyen',
                date_of_birth: '1956-06-15',
                gender: 'female',
                address: '2451 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7735581272',
                email: 'onguyen56@gmail.com',
                emergency_contact_name: 'Oliver Nguyen',
                emergency_contact_phone: '7735581272'
            });
            await createPatient({
                first_name: 'Owen',
                last_name: 'Park',
                date_of_birth: '1950-07-07',
                gender: 'male',
                address: '1935 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7357095148',
                email: 'opark50@gmail.com',
                emergency_contact_name: 'Oliver Park',
                emergency_contact_phone: '7357095148'
            });
            await createPatient({
                first_name: 'Olivier',
                last_name: 'Kim',
                date_of_birth: '1962-01-12',
                gender: 'male',
                address: '1757 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7385567642',
                email: 'okim62@gmail.com',
                emergency_contact_name: 'Olivia Kim',
                emergency_contact_phone: '7385567642'
            });
            await createPatient({
                first_name: 'Orlando',
                last_name: 'Lee',
                date_of_birth: '1958-03-05',
                gender: 'male',
                address: '2021 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7397058764',
                email: 'olee58@gmail.com',
                emergency_contact_name: 'Olivia Lee',
                emergency_contact_phone: '7397058764'
            });
            await createPatient({
                first_name: 'Oscar',
                last_name: 'Brown',
                date_of_birth: '1954-11-22',
                gender: 'male',
                address: '2341 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7355793608',
                email: 'obrown54@gmail.com',
                emergency_contact_name: 'Oliver Brown',
                emergency_contact_phone: '7355793608'
            });
            await createPatient({
                first_name: 'Olivia',
                last_name: 'Wilson',
                date_of_birth: '1956-08-18',
                gender: 'female',
                address: '2211 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7735780456',
                email: 'owilson56@gmail.com',
                emergency_contact_name: 'Oliver Wilson',
                emergency_contact_phone: '7735780456'
            });
            await createPatient({
                first_name: 'Pamie',
                last_name: 'Parker',
                date_of_birth: '1952-07-12',
                gender: 'female',
                address: '3007 N Lake Shore Dr, Chicago, IL, 60657',
                phone_number: '3312765652',
                email: 'pparker52@gmail.com',
                emergency_contact_name: 'Philip Parker',
                emergency_contact_phone: '3312765652'
                });
            await createPatient({
                first_name: 'Paulie',
                last_name: 'Patterson',
                date_of_birth: '1979-01-06',
                gender: 'male',
                address: '4205 W Armitage Ave, Chicago, IL, 60639',
                phone_number: '7954226652',
                email: 'ppatterson79@gmail.com',
                emergency_contact_name: 'Patricia Patterson',
                emergency_contact_phone: '7954226652'
                });
            await createPatient({
                first_name: 'Pettie',
                last_name: 'Perez',
                date_of_birth: '1948-09-13',
                gender: 'male',
                address: '5107 S King Dr, Chicago, IL, 60637',
                phone_number: '5678922652',
                email: 'pperez48@gmail.com',
                emergency_contact_name: 'Patricia Perez',
                emergency_contact_phone: '5678922652'
                });
            await createPatient({
                first_name: 'Patria',
                last_name: 'Phillips',
                date_of_birth: '1980-04-19',
                gender: 'female',
                address: '6209 S Kedzie Ave, Chicago, IL, 60629',
                phone_number: '2345622652',
                email: 'pphillips80@gmail.com',
                emergency_contact_name: 'Paul Phillips',
                emergency_contact_phone: '2345622652'
                });
            await createPatient({
                first_name: 'Phil',
                last_name: 'Pierce',
                date_of_birth: '1982-08-06',
                gender: 'male',
                address: '7307 S Ashland Ave, Chicago, IL, 60620',
                phone_number: '6789122652',
                email: 'ppierce82@gmail.com',
                emergency_contact_name: 'Patricia Pierce',
                emergency_contact_phone: '6789122652'
                });
            await createPatient({
                first_name: 'Patrick',
                last_name: 'Porter',
                date_of_birth: '1967-02-12',
                gender: 'male',
                address: '8405 W Roosevelt Rd, Chicago, IL, 60620',
                phone_number: '23456722652',
                email: 'pporter67@gmail.com',
                emergency_contact_name: 'Pauline Porter',
                emergency_contact_phone: '23456722652'
                });
            await createPatient({
                first_name: 'Pamela',
                last_name: 'Parker',
                date_of_birth: '1942-07-12',
                gender: 'female',
                address: '3007 N Lake Shore Dr, Chicago, IL, 60657',
                phone_number: '3312765652',
                email: 'pparker42@gmail.com',
                emergency_contact_name: 'Philip Parker',
                emergency_contact_phone: '3312765652'
                });
            await createPatient({
                first_name: 'Paul',
                last_name: 'Patterson',
                date_of_birth: '1949-01-06',
                gender: 'male',
                address: '4205 W Armitage Ave, Chicago, IL, 60639',
                phone_number: '7954226652',
                email: 'ppatterson49@gmail.com',
                emergency_contact_name: 'Patricia Patterson',
                emergency_contact_phone: '7954226652'
                });
            await createPatient({
                first_name: 'Peter',
                last_name: 'Perez',
                date_of_birth: '1958-09-13',
                gender: 'male',
                address: '5107 S King Dr, Chicago, IL, 60637',
                phone_number: '5678922652',
                email: 'pperez58@gmail.com',
                emergency_contact_name: 'Patricia Perez',
                emergency_contact_phone: '5678922652'
                });
            await createPatient({
                first_name: 'Patricia',
                last_name: 'Phillips',
                date_of_birth: '1960-04-19',
                gender: 'female',
                address: '6209 S Kedzie Ave, Chicago, IL, 60629',
                phone_number: '2345622652',
                email: 'pphillips60@gmail.com',
                emergency_contact_name: 'Paul Phillips',
                emergency_contact_phone: '2345622652'
                });
            await createPatient({
                first_name: 'Phillip',
                last_name: 'Pierce',
                date_of_birth: '1962-08-06',
                gender: 'male',
                address: '7307 S Ashland Ave, Chicago, IL, 60620',
                phone_number: '6789122652',
                email: 'ppierce62@gmail.com',
                emergency_contact_name: 'Patricia Pierce',
                emergency_contact_phone: '6789122652'
                });
            await createPatient({
                first_name: 'Patrick',
                last_name: 'Porter',
                date_of_birth: '1967-02-12',
                gender: 'male',
                address: '8405 W Roosevelt Rd, Chicago, IL, 60620',
                phone_number: '23456456652',
                email: 'pporter67@gmail.com',
                emergency_contact_name: 'Pauline Porter',
                emergency_contact_phone: '23459872652'
                });
            await createPatient({
                first_name: 'Quincy',
                last_name: 'Young',
                date_of_birth: '1978-07-23',
                gender: 'male',
                address: '3507 N Ashland Ave, Chicago, IL, 60657',
                phone_number: '8476543478',
                email: 'qyoung78@gmail.com',
                emergency_contact_name: 'Nina Young',
                emergency_contact_phone: '8474545678'
                });
            await createPatient({
                first_name: 'Quincy',
                last_name: 'Green',
                date_of_birth: '1978-07-23',
                gender: 'male',
                address: '1947 W Grand Ave, Chicago, IL, 60612',
                phone_number: '8474512378',
                email: 'qgreen78@gmail.com',
                emergency_contact_name: 'Maggie Green',
                emergency_contact_phone: '8474323478'
                });
            await createPatient({
                first_name: 'Qian',
                last_name: 'Park',
                date_of_birth: '1980-11-18',
                gender: 'female',
                address: '5725 N Broadway St, Chicago, IL, 60660',
                phone_number: '8474586578',
                email: 'qpark80@gmail.com',
                emergency_contact_name: 'Tiffany Park',
                emergency_contact_phone: '8474545678'
                });
            await createPatient({
                first_name: 'Quinn',
                last_name: 'Simmons',
                date_of_birth: '1981-01-12',
                gender: 'male',
                address: '2919 N Clark St, Chicago, IL, 60657',
                phone_number: '8868523478',
                emergency_contact_name: 'Eliza Simmons',
                emergency_contact_phone: '8474535478',
                email: 'qsimmons81@gmail.com'
                });
            await createPatient({
                first_name: 'Quinn',
                last_name: 'Brown',
                date_of_birth: '1981-01-12',
                gender: 'male',
                address: '4525 N Lake Shore Dr, Chicago, IL, 60640',
                phone_number: '8474623478',
                emergency_contact_name: 'Victoria Brown',
                emergency_contact_phone: '8474523456',
                email: 'qbrown81@gmail.com'
                });
            await createPatient({
                first_name: 'Qian',
                last_name: 'Williams',
                date_of_birth: '1983-07-17',
                gender: 'female',
                address: '4839 N Kedzie Ave, Chicago, IL, 60625',
                phone_number: '8474523478',
                emergency_contact_name: 'Mia Williams',
                emergency_contact_phone: '8474523478',
                email: 'qwilliams83@gmail.com'
                });
            await createPatient({
                first_name: 'Randy',
                last_name: 'Nguyen',
                date_of_birth: '1958-09-11',
                gender: 'male',
                address: '1235 S Wabash Ave, Chicago, IL, 60605',
                phone_number: '4857392654',
                email: 'rnguyen58@gmail.com',
                emergency_contact_name: 'Jason Nguyen',
                emergency_contact_phone: '4857392655'
                });
            await createPatient({
                first_name: 'Rosa',
                last_name: 'Park',
                date_of_birth: '1981-12-02',
                gender: 'female',
                address: '836 N Michigan Ave, Evanston, IL, 60201',
                phone_number: '9857369854',
                email: 'rpark81@gmail.com',
                emergency_contact_name: 'John Park',
                emergency_contact_phone: '9857369855'
            });
            await createPatient({
                first_name: 'Ryan',
                last_name: 'Kim',
                date_of_birth: '1994-06-22',
                gender: 'male',
                address: '622 S Dearborn St, Schaumburg, IL, 60193',
                phone_number: '9857369856',
                email: 'rkim94@gmail.com',
                emergency_contact_name: 'Janice Kim',
                emergency_contact_phone: '9857369857'
            });
            await createPatient({
                first_name: 'Rachel',
                last_name: 'Garcia',
                date_of_birth: '1992-08-18',
                gender: 'female',
                address: '1145 S Main St, Naperville, IL, 60540',
                phone_number: '9857369858',
                email: 'rgarcia92@gmail.com',
                emergency_contact_name: 'Jose Garcia',
                emergency_contact_phone: '9857369859'
            });
            await createPatient({
                first_name: 'Rebecca',
                last_name: 'Smith',
                date_of_birth: '1983-05-12',
                gender: 'female',
                address: '722 W Front St, Northbrook, IL, 60062',
                phone_number: '9857369860',
                email: 'rsmith83@gmail.com',
                emergency_contact_name: 'William Smith',
                emergency_contact_phone: '9857369861'
            });
            await createPatient({
                first_name: 'Robert',
                last_name: 'Jones',
                date_of_birth: '1977-11-03',
                gender: 'male',
                address: '933 W Howard St, Skokie, IL, 60076',
                phone_number: '9857369862',
                email: 'rjones77@gmail.com',
                emergency_contact_name: 'Emily Jones',
                emergency_contact_phone: '9857369863'
            });
            await createPatient({
                    first_name: 'Shawn',
                    last_name: 'Garner',
                    date_of_birth: '1953-11-24',
                    gender: 'male',
                    address: '1723 E Balmoral Ave, Chicago, IL, 60601',
                    phone_number: '6573829574',
                    email: 'sgarner53@gmail.com',
                    emergency_contact_name: 'Sophia Garner',
                    emergency_contact_phone: '6573829574'
                });
            await createPatient({
                first_name: 'Samantha',
                last_name: 'Butler',
                date_of_birth: '1980-06-19',
                gender: 'female',
                address: '1723 W Lockwood Ave, Chicago, IL, 60601',
                phone_number: '6573829575',
                email: 'sbutler80@gmail.com',
                emergency_contact_name: 'Steven Butler',
                emergency_contact_phone: '6573829575'
            });
            await createPatient({
                first_name: 'Sophie',
                last_name: 'Chapman',
                date_of_birth: '1982-12-13',
                gender: 'female',
                address: '1723 N Ashland Ave, Chicago, IL, 60601',
                phone_number: '6573829576',
                email: 'schapman82@gmail.com',
                emergency_contact_name: 'Sophie Chapman',
                emergency_contact_phone: '6573829576'
            });
            await createPatient({
                first_name: 'Steven',
                last_name: 'Edwards',
                date_of_birth: '1988-05-06',
                gender: 'male',
                address: '1723 W Grand Ave, Chicago, IL, 60601',
                phone_number: '6573829577',
                email: 'sedwards88@gmail.com',
                emergency_contact_name: 'Steven Edwards',
                emergency_contact_phone: '6573829577'
            });
            await createPatient({
                first_name: 'Sophia',
                last_name: 'Gonzalez',
                date_of_birth: '1999-01-01',
                gender: 'female',
                address: '1723 S Halsted St, Chicago, IL, 60601',
                phone_number: '6573829578',
                email: 'sgonzalez99@gmail.com',
                emergency_contact_name: 'Sophia Gonzalez',
                emergency_contact_phone: '6573829578'
            });
            await createPatient({
                first_name: 'Sebastian',
                last_name: 'Harper',
                date_of_birth: '1998-03-19',
                gender: 'male',
                address: '1723 N Lincoln Ave, Chicago, IL, 60601',
                phone_number: '6573829579',
                email: 'sharper98@gmail.com',
                emergency_contact_name: 'Sebastian Harper',
                emergency_contact_phone: '6573829579'
            });
            await createPatient({
                first_name: 'Tara',
                last_name: 'Ramirez',
                date_of_birth: '1987-06-17',
                gender: 'female',
                address: '4343 W Belmont Ave, Chicago, IL, 60641',
                phone_number: '3305048397',
                email: 'tramirez87@gmail.com',
                emergency_contact_name: 'Antonio Ramirez',
                emergency_contact_phone: '3305365722'
            });
            await createPatient({
                first_name: 'Ursula',
                last_name: 'Parker',
                date_of_birth: '1981-05-22',
                gender: 'female',
                address: '1723 N Keystone Ave, Chicago, IL, 60651',
                phone_number: '7379522652',
                email: 'uparker81@gmail.com',
                emergency_contact_name: 'Liam Parker',
                emergency_contact_phone: '7379522655'
                });
            await createPatient({
                first_name: 'Uriah',
                last_name: 'Fields',
                date_of_birth: '1968-10-06',
                gender: 'male',
                address: '1234 Elm St, New York, NY, 10001',
                phone_number: '7379555652',
                email: 'ufields68@gmail.com',
                emergency_contact_name: 'Ava Fields',
                emergency_contact_phone: '7379555657'
                });
            await createPatient({
                first_name: 'Uma',
                last_name: 'Rodriguez',
                date_of_birth: '1954-08-17',
                gender: 'female',
                address: '5678 Oak St, Los Angeles, CA, 90001',
                phone_number: '7379577652',
                email: 'urodriguez54@gmail.com',
                emergency_contact_name: 'Diego Rodriguez',
                emergency_contact_phone: '7379577657'
                });
            await createPatient({
                first_name: 'Uriel',
                last_name: 'Brown',
                date_of_birth: '2000-12-01',
                gender: 'male',
                address: '9123 Pine St, Houston, TX, 77001',
                phone_number: '7379544652',
                email: 'ubrown00@gmail.com',
                emergency_contact_name: 'Sophia Brown',
                emergency_contact_phone: '7379544657'
                });
            await createPatient({
                first_name: 'Ursa',
                last_name: 'Garcia',
                date_of_birth: '1993-03-19',
                gender: 'female',
                address: '2468 Elm St, Miami, FL, 33001',
                phone_number: '7379555652',
                email: 'ugarcia93@gmail.com',
                emergency_contact_name: 'Diego Garcia',
                emergency_contact_phone: '7379555657'
                });
            await createPatient({
                first_name: 'Ulrich',
                last_name: 'Smith',
                date_of_birth: '1977-07-04',
                gender: 'male',
                address: '1357 Oak St, Seattle, WA, 98101',
                phone_number: '7379556652',
                email: 'usmith77@gmail.com',
                emergency_contact_name: 'Ava Smith',
                emergency_contact_phone: '7379556657'
                });
            await createPatient({
                first_name: 'Violet',
                last_name: 'Turner',
                date_of_birth: '1999-06-22',
                gender: 'female',
                address: '3124 W 57th St, Chicago, IL, 60632',
                phone_number: '9172236595',
                email: 'violet.turner@hotmail.com',
                emergency_contact_name: 'Evelyn Turner',
                emergency_contact_phone: '9174412875'
                });
            await createPatient({
                first_name: 'Victor',
                last_name: 'Rivera',
                date_of_birth: '1962-11-17',
                gender: 'male',
                address: '4245 N Milwaukee Ave, Chicago, IL, 60641',
                phone_number: '3128655487',
                email: 'vrivera62@gmail.com',
                emergency_contact_name: 'Maria Rivera',
                emergency_contact_phone: '3128655487'
                });
            await createPatient({
                first_name: 'Vivian',
                last_name: 'Gonzalez',
                date_of_birth: '1984-01-21',
                gender: 'female',
                address: '1423 W Madison St, Chicago, IL, 60607',
                phone_number: '3128655487',
                email: 'vivian.gonzalez@hotmail.com',
                emergency_contact_name: 'David Gonzalez',
                emergency_contact_phone: '3128655487'
                });
            await createPatient({
                first_name: 'Vernon',
                last_name: 'Robinson',
                date_of_birth: '1991-12-05',
                gender: 'male',
                address: '3104 N Clark St, Chicago, IL, 60657',
                phone_number: '3128655487',
                email: 'vernon.robinson@gmail.com',
                emergency_contact_name: 'Linda Robinson',
                emergency_contact_phone: '3128655487'
                });
            await createPatient({
                first_name: 'Violeta',
                last_name: 'Lopez',
                date_of_birth: '1977-03-17',
                gender: 'female',
                address: '4623 N Lincoln Ave, Chicago, IL, 60625',
                phone_number: '3128655487',
                email: 'violeta.lopez@hotmail.com',
                emergency_contact_name: 'Luis Lopez',
                emergency_contact_phone: '3128655487'
                });
            await createPatient({
                first_name: 'Virgil',
                last_name: 'Parker',
                date_of_birth: '1986-05-02',
                gender: 'male',
                address: '1923 W Belmont Ave, Chicago, IL, 60657',
                phone_number: '3128655487',
                email: 'virgil.parker@gmail.com',
                emergency_contact_name: 'Tina Parker',
                emergency_contact_phone: '3128655487'
                });
            await createPatient({
                first_name: 'Wendy',
                last_name: 'Flynn',
                date_of_birth: '1973-11-19',
                gender: 'female',
                address: '716 W Jackson St, Arlington Heights, IL, 60005',
                phone_number: '7329243651',
                email: 'wflynn73@gmail.com',
                emergency_contact_name: 'Ethan Flynn',
                emergency_contact_phone: '7329243652'
            });
            await createPatient({
                first_name: 'Warren',
                last_name: 'Kim',
                date_of_birth: '1956-06-12',
                gender: 'male',
                address: '904 E Fairview Ave, Elgin, IL, 60123',
                phone_number: '7376204851',
                email: 'wkim56@gmail.com',
                emergency_contact_name: 'Avery Kim',
                emergency_contact_phone: '7376204852'
            });
            await createPatient({
                first_name: 'Wade',
                last_name: 'Smith',
                date_of_birth: '1977-01-08',
                gender: 'male',
                address: '8422 W Madison St, Northbrook, IL, 60062',
                phone_number: '7376344851',
                email: 'wsmith77@gmail.com',
                emergency_contact_name: 'Carly Smith',
                emergency_contact_phone: '7376344852'
            });
            await createPatient({
                first_name: 'Willa',
                last_name: 'Brown',
                date_of_birth: '1975-04-17',
                gender: 'female',
                address: '421 N Maple St, Naperville, IL, 60540',
                phone_number: '7376214751',
                email: 'wbrown75@gmail.com',
                emergency_contact_name: 'Nash Brown',
                emergency_contact_phone: '7376214752'
            });
            await createPatient({
                first_name: 'Wesley',
                last_name: 'Johnson',
                date_of_birth: '1981-12-22',
                gender: 'male',
                address: '5624 W Belmont Ave, Chicago, IL, 60634',
                phone_number: '7376234851',
                email: 'wjohnson81@gmail.com',
                emergency_contact_name: 'Avery Johnson',
                emergency_contact_phone: '7376234852'
            });
            await createPatient({
                first_name: 'Wyatt',
                last_name: 'Davis',
                date_of_birth: '1984-08-19',
                gender: 'male',
                address: '907 S Main St, Wheeling, IL, 60090',
                phone_number: '7376204861',
                email: 'wdavis84@gmail.com',
                emergency_contact_name: 'Mia Davis',
                emergency_contact_phone: '7376204862'
            });
            await createPatient({
                first_name: 'Xander',
                last_name: 'Henderson',
                date_of_birth: '1999-07-17',
                gender: 'male',
                address: '879 W Belden Ave, Chicago, IL 60614',
                phone_number: '9673790381',
                email: 'xanderhenderson99@gmail.com',
                emergency_contact_name: 'Lila Henderson',
                emergency_contact_phone: '9673790381'
                });
            await createPatient({
                first_name: 'Ximena',
                last_name: 'Lopez',
                date_of_birth: '2002-05-23',
                gender: 'female',
                address: '5492 S Racine Ave, Chicago, IL 60609',
                phone_number: '7384019364',
                email: 'ximenaLopez02@gmail.com',
                emergency_contact_name: 'Diego Lopez',
                emergency_contact_phone: '7384019364'
                });
            await createPatient({
                first_name: 'Xander',
                last_name: 'Garcia',
                date_of_birth: '2000-01-19',
                gender: 'male',
                address: '6947 W Addison St, Chicago, IL 60634',
                phone_number: '5687021963',
                email: 'xandergarcia00@gmail.com',
                emergency_contact_name: 'Maria Garcia',
                emergency_contact_phone: '5687021963'
                });
            await createPatient({
                first_name: 'Xiomara',
                last_name: 'Rodriguez',
                date_of_birth: '2003-03-05',
                gender: 'female',
                address: '3255 N Ashland Ave, Chicago, IL 60657',
                phone_number: '9580321579',
                email: 'xiomararodriguez03@gmail.com',
                emergency_contact_name: 'Juan Rodriguez',
                emergency_contact_phone: '9580321579'
                });
            await createPatient({
                first_name: 'Xanthe',
                last_name: 'Johnson',
                date_of_birth: '2001-12-08',
                gender: 'female',
                address: '5052 S Western Ave, Chicago, IL 60609',
                phone_number: '6502345187',
                email: 'xanthejohnson01@gmail.com',
                emergency_contact_name: 'John Johnson',
                emergency_contact_phone: '6502345187'
                });
            await createPatient({
                first_name: 'Xander',
                last_name: 'Davis',
                date_of_birth: '1998-06-12',
                gender: 'male',
                address: '4567 W Belmont Ave, Chicago, IL 60641',
                phone_number: '9587654321',
                email: 'xanderdavis98@gmail.com',
                emergency_contact_name: 'Olivia Davis',
                emergency_contact_phone: '9587654321'
                });
            await createPatient({
                first_name: 'Yasmin',
                last_name: 'Wang',
                date_of_birth: '1987-06-15',
                gender: 'female',
                address: '963 S Main St, Lombard, IL, 60148',
                phone_number: '3023940162',
                email: 'ywang87@gmail.com',
                emergency_contact_name: 'Hailey Wang',
                emergency_contact_phone: '3023940161'
                });
            await createPatient({
                first_name: 'Yvette',
                last_name: 'Garcia',
                date_of_birth: '1983-11-19',
                gender: 'female',
                address: '1657 W Fullerton Ave, Chicago, IL, 60614',
                phone_number: '3168240167',
                email: 'ygarcia83@gmail.com',
                emergency_contact_name: 'Lucas Garcia',
                emergency_contact_phone: '3168240166'
                });
            await createPatient({
                first_name: 'Yolanda',
                last_name: 'Parker',
                date_of_birth: '1982-03-12',
                gender: 'female',
                address: '2458 W Devon Ave, Chicago, IL, 60659',
                phone_number: '3123450168',
                email: 'yparker82@gmail.com',
                emergency_contact_name: 'Haley Parker',
                emergency_contact_phone: '3123450169'
                });
            await createPatient({
                first_name: 'Yuri',
                last_name: 'Wong',
                date_of_birth: '1987-01-30',
                gender: 'male',
                address: '4040 N Lincoln Ave, Chicago, IL, 60618',
                phone_number: '3123450170',
                email: 'ywong87@gmail.com',
                emergency_contact_name: 'Maggie Wong',
                emergency_contact_phone: '3123450171'
                });
            await createPatient({
                first_name: 'Yvonne',
                last_name: 'Gonzalez',
                date_of_birth: '1986-04-17',
                gender: 'female',
                address: '4753 W Belmont Ave, Chicago, IL, 60641',
                phone_number: '3123450172',
                email: 'ygonzalez86@gmail.com',
                emergency_contact_name: 'Jenna Gonzalez',
                emergency_contact_phone: '3123450173'
                });
            await createPatient({
                first_name: 'Yvette',
                last_name: 'Hernandez',
                date_of_birth: '1983-09-14',
                gender: 'female',
                address: '1823 N Damen Ave, Chicago, IL, 60647',
                phone_number: '3123450174',
                email: 'yhernandez83@gmail.com',
                emergency_contact_name: 'Maurice Hernandez',
                emergency_contact_phone: '3123450175'
                });
            await createPatient({
                first_name: 'Zara',
                last_name: 'Rodriguez',
                date_of_birth: '1986-07-05',
                gender: 'female',
                address: '3029 SW 26th St, Miami, FL 33133',
                phone_number: '3053346752',
                email: 'zararodriguez@hotmail.com',
                emergency_contact_name: 'Juan Rodriguez',
                emergency_contact_phone: '3057786352'
                });
            await createPatient({
                first_name: 'Zack',
                last_name: 'Nguyen',
                date_of_birth: '1985-11-12',
                gender: 'male',
                address: '4209 N Lincoln Ave, Chicago, IL 60618',
                phone_number: '7732145986',
                email: 'zacknguyen85@gmail.com',
                emergency_contact_name: 'Linh Nguyen',
                emergency_contact_phone: '7732145986'
                });
            await createPatient({
                first_name: 'Zoe',
                last_name: 'Kim',
                date_of_birth: '1987-05-21',
                gender: 'female',
                address: '7075 E Camelback Rd, Scottsdale, AZ 85251',
                phone_number: '4802145963',
                email: 'zoekim87@yahoo.com',
                emergency_contact_name: 'Jin Kim',
                emergency_contact_phone: '4802145963'
                });
            await createPatient({
                first_name: 'Zion',
                last_name: 'Garcia',
                date_of_birth: '1986-01-22',
                gender: 'male',
                address: '8657 W 95th St, Hickory Hills, IL 60457',
                phone_number: '7083346752',
                email: 'ziongarcia86@gmail.com',
                emergency_contact_name: 'Isabel Garcia',
                emergency_contact_phone: '7083346752'
                });
            await createPatient({
                first_name: 'Zena',
                last_name: 'Gonzalez',
                date_of_birth: '1984-09-12',
                gender: 'female',
                address: '6640 N Lincoln Ave, Chicago, IL 60659',
                phone_number: '7739946582',
                email: 'zenagonzalez84@hotmail.com',
                emergency_contact_name: 'Miguel Gonzalez',
                emergency_contact_phone: '7739946582'
                });
            await createPatient({
                first_name: 'Zander',
                last_name: 'Johnson',
                date_of_birth: '1988-06-25',
                gender: 'male',
                address: '2657 N Lincoln Ave, Chicago, IL 60614',
                phone_number: '7732659845',
                email: 'zanderjohnson88@gmail.com',
                emergency_contact_name: 'Sophia Johnson',
                emergency_contact_phone: '7732659845'
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
            await createStaff({
                name: 'Elizabeth Nguyen',
                title: 'Anesthesiologist',
                specialty: 'Anesthesiology',
                provider_id: 1538,
                email: 'nguyen@healthhive.com',
                phone_number: '3386462524'
            });
            await createStaff({
                name: 'Megan Kim',
                title: 'Anesthesiologist',
                specialty: 'Anesthesiology',
                provider_id: 1872,
                email: 'mkim@healthhive.com',
                phone_number: '3386992524'
             });
            await createStaff({
                name: 'Kimberly Ramirez',
                title: 'Anesthesiologist',
                specialty: 'Anesthesiology',
                provider_id: 1447,
                email: 'kramirez@healthhive.com',
                phone_number: '3389876532'
            });
            await createStaff({
                name: 'David Smith',
                title: 'Anesthesiologist',
                specialty: 'Anesthesia',
                provider_id: 1783,
                email: 'dsmith@healthhive.com',
                phone_number: '3387459821'
            });
            await createStaff({
                name: 'Samantha Kim',
                title: 'Anesthesiologist',
                specialty: 'Anesthesiology',
                provider_id: 1723,
                email: 'skim@healthhive.com',
                phone_number: '3386298574'
            });
            await createStaff({
                name: 'Dr. Elizabeth Chen',
                title: 'Cardiologist',
                specialty: 'Cardiology',
                provider_id: 2586,
                email: 'echen@healthhive.com',
                phone_number: '3386495706'
            });
            await createStaff({
                name: 'Susan Kim',
                title: 'Cardiologist',
                specialty: 'Cardiology',
                provider_id: 2655,
                email: 'skim@healthhive.com',
                phone_number: '3386223918'
            });
            await createStaff({
                name: 'Ava Kim',
                title: 'Cardiologist',
                specialty: 'Cardiology',
                provider_id: 2514,
                email: 'akim@healthhive.com',
                phone_number: '3386146253'
            });
            await createStaff({
                name: 'Janet Kim',
                title: 'Dermatologist',
                specialty: 'Dermatology',
                provider_id: 3567,
                email: 'jkim@healthhive.com',
                phone_number: '3388641234'
            });
            await createStaff({
                name: 'Caroline Green',
                title: 'Dermatologist',
                specialty: 'Dermatology',
                provider_id: 3456,
                email: 'cgreen@healthhive.com',
                phone_number: '3386745234'
            });
            await createStaff({
                name: 'Michael Lee',
                title: 'Dermatologist',
                specialty: 'Dermatology',
                provider_id: 3901,
                email: 'mlee@healthhive.com',
                phone_number: '3381234567'
            });
            await createStaff({
                name: 'Nina Patel',
                title: 'Dermatologist',
                specialty: 'Dermatology',
                provider_id: 3579,
                email: 'npatel@healthhive.com',
                phone_number: '3385555555'
            });
            await createStaff({
                name: 'Olivia Smith',
                title: 'Dermatologist',
                specialty: 'Dermatology',
                provider_id: 3777,
                email: 'osmith@healthhive.com',
                phone_number: '3388888888'
            });
            await createStaff({
                name: 'Karen Johnson',
                title: 'Physician',
                specialty: 'Emergency Medicine',
                provider_id: 4567,
                email: 'kjohnson@healthhive.com',
                phone_number: '3388646548'
            });
            await createStaff({
                name: 'Megan Foster',
                title: 'Physician',
                specialty: 'Emergency Medicine',
                provider_id: 4937,
                email: 'mfoster@healthhive.com',
                phone_number: '3386386552'
            });
            await createStaff({
                name: 'Megan Brown',
                title: 'Physician',
                specialty: 'Emergency Medicine',
                provider_id: 4568,
                email: 'mbrown@healthhive.com',
                phone_number: '3386575890'
            });
            await createStaff({
                name: 'Ava Johnson',
                title: 'Physician',
                specialty: 'Emergency Medicine',
                provider_id: 4579,
                email: 'ajohnson@healthhive.com',
                phone_number: '3386575891'
            });
            await createStaff({
                name: 'Nathan Lee',
                title: 'Physician',
                specialty: 'Emergency Medicine',
                provider_id: 4589,
                email: 'nlee@healthhive.com',
                phone_number: '3386575892'
            });
            await createStaff({
                name: 'Carla Kim',
                title: 'Physician',
                specialty: 'Emergency Medicine',
                provider_id: 4672,
                email: 'ckim@healthhive.com',
                phone_number: '3386462524'
            });
            await createStaff({
                name: 'Trevor Green',
                title: 'Physician',
                specialty: 'Emergency Medicine',
                provider_id: 4385,
                email: 'tgreen@healthhive.com',
                phone_number: '3386462524'
            });
            await createStaff({
                name: 'Nina Patel',
                title: 'Physician',
                specialty: 'Emergency Medicine',
                provider_id: 4986,
                email: 'npatel@healthhive.com',
                phone_number: '3386462524'
            });
            await createStaff({
                name: 'Ralph Kim',
                title: 'Physician',
                specialty: 'Emergency Medicine',
                provider_id: 4678,
                email: 'rkim@healthhive.com',
                phone_number: '3386123456'
            });
            await createStaff({
                name: 'Amanda Lee',
                title: 'Family Medicine Physician',
                specialty: 'Family Medicine',
                provider_id: 5456,
                email: 'alee@healthhive.com',
                phone_number: '3388641239'
            });
            await createStaff({
                name: 'Michael Chen',
                title: 'Family Medicine Physician',
                specialty: 'Family Medicine',
                provider_id: 5343,
                email: 'mchen@healthhive.com',
                phone_number: '3388648765'
            });
            await createStaff({
                name: 'Caroline Williams',
                title: 'Family Medicine Physician',
                specialty: 'Family Medicine',
                provider_id: 5537,
                email: 'cwilliams@healthhive.com',
                phone_number: '8886462524'
            });
            await createStaff({
                name: 'Olivia Lee',
                title: 'Family Medicine Physician',
                specialty: 'Family Medicine',
                provider_id: 5382,
                email: 'olee@healthhive.com',
                phone_number: '8886462524'
            });
            await createStaff({
                name: 'Ethan Brown',
                title: 'Family Medicine Physician',
                specialty: 'Family Medicine',
                provider_id: 5201,
                email: 'ebrown@healthhive.com',
                phone_number: '8886462524'
            });
             await createStaff({
                name: 'Isabelle Green',
                title: 'Family Medicine Physician',
                specialty: 'Family Medicine',
                provider_id: 5125,
                email: 'igreen@healthhive.com',
                phone_number: '8886462524'
            });
            await createStaff({
                name: 'Raphael Giles',
                title: 'Family Medicine',
                specialty: 'Family Medicine',
                provider_id: 5723,
                email: 'rgiles@healthhive.com',
                phone_number: '3386130024'
            });
            await createStaff({
                name: 'Aria Powell',
                title: 'Family Medicine',
                specialty: 'Family Medicine',
                provider_id: 5780,
                email: 'apowell@healthhive.com',
                phone_number: '3386130025'
            });
            await createStaff({
                name: 'Ethan Rodriguez',
                title: 'Family Medicine',
                specialty: 'Family Medicine',
                provider_id: 5589,
                email: 'erodriguez@healthhive.com',
                phone_number: '3386130026'
            });
            await createStaff({
                name: 'David Chen',
                title: 'Gastroenterologist',
                specialty: 'Gastroenterology',
                provider_id: 6013,
                email: 'dchen@healthhive.com',
                phone_number: '3386013123'
            }); 
            await createStaff({
                name: 'Samantha Brown',
                title: 'Gastroenterologist',
                specialty: 'Gastroenterology',
                provider_id: 5637,
                email: 'sbrown@healthhive.com',
                phone_number: '3386387678'
            });
            await createStaff({
                name: 'Gregory Ortiz',
                title: 'Gastroenterologist',
                specialty: 'Gastroenterology',
                provider_id: 5913,
                email: 'gortiz@healthhive.com',
                phone_number: '3386388897'
            });
            await createStaff({
                name: "Megan Chen",
                title: "Gynecologist",
                specialty: "Gynecology",
                provider_id: 6123,
                email: "mchen@healthhive.com",
                phone_number: "3386462524"
            });
            await createStaff({
                name: "Jason Lee",
                title: "Gynecologist",
                specialty: "Gynecology",
                provider_id: 6456,
                email: "jlee@healthhive.com",
                phone_number: "3386558899"
            });
            await createStaff({
                name: 'Sarah Wright',
                title: 'Neurologist',
                specialty: 'Neurology',
                provider_id: 6837,
                email: 'swright@healthhive.com',
                phone_number: '3385557780'
            });
            await createStaff({
                name: 'Liam Kim',
                title: 'Neurologist',
                specialty: 'Neurology',
                provider_id: 6537,
                email: 'lkim@healthhive.com',
                phone_number: '3386462524'
            });
            await createStaff({
                name: 'Avery Chen',
                title: 'Neurologist',
                specialty: 'Neurology',
                provider_id: 6547,
                email: 'achen@healthhive.com',
                phone_number: '3386463524'
            });
            await createStaff({
                name: 'Megan Stone',
                title: 'Nurse Practitioner',
                specialty: 'Emergency Room',
                provider_id: 7537,
                email: 'mstone@healthhive.com',
                phone_number: '3386462524'
            });
            await createStaff({
                name: 'Jane Doe',
                title: 'Nurse',
                specialty: 'Surgical Assistant',
                provider_id: null,
                email: 'jdoe@healthhive.com',
                phone_number: '3386731259'
            });
            await createStaff({
                name: 'Maggie Jenkins',
                title: 'Nurse',
                specialty: 'RN',
                provider_id: null,
                email: 'mjenkins@healthhive.com',
                phone_number: '3387369874'
            });
            await createStaff({
                name: 'David Lopez',
                title: 'Nurse',
                specialty: 'Emergency Room',
                provider_id: null,
                email: 'dlopez@healthhive.com',
                phone_number: '3387369876'
            });
            await createStaff({
                name: 'Nina Chen',
                title: 'Nurse',
                specialty: 'Pediatrics',
                provider_id: null,
                email: 'nchen@healthhive.com',
                phone_number: '3387482536'
            });
            await createStaff({
                name: 'Sarah Thompson',
                title: 'Nurse',
                specialty: 'Surgical',
                provider_id: null,
                email: 'sthompson@healthhive.com',
                phone_number: '3382341236'
            });
            await createStaff({
                name: 'Kimberly James',
                title: 'Nurse',
                specialty: 'Emergency Room',
                provider_id: null,
                email: 'kjames@healthhive.com',
                phone_number: '3386167521'
            });
            await createStaff({
                name: 'Ashley Smith',
                title: 'Nurse',
                specialty: 'Surgical Assistant',
                provider_id: null,
                email: 'asmith@healthhive.com',
                phone_number: '3386293547'
            });
            await createStaff({
                name: 'Jason Brown',
                title: 'Nurse',
                specialty: 'Critical Care',
                provider_id: null,
                email: 'jbrown@healthhive.com',
                phone_number: '3386478962'
            });
            await createStaff({
                name: 'Sophie Lee',
                title: 'Nurse',
                specialty: 'RN',
                provider_id: null,
                email: 'slee@healthhive.com',
                phone_number: '3386151733'
            });
            await createStaff({
                name: 'Karen Wilson',
                title: 'Nurse',
                specialty: 'ER',
                provider_id: null,
                email: 'kwilson@healthhive.com',
                phone_number: '3386151734'
            });
            await createStaff({
                name: 'Linda Chen',
                title: 'Nurse',
                specialty: 'NP',
                provider_id: 7678,
                email: 'lchen@healthhive.com',
                phone_number: '3386151735'
            });
            await createStaff({
                name: 'Marisol Nguyen',
                title: 'Nurse',
                specialty: 'Emergency Room Nurse',
                provider_id: null,
                email: 'mnguyen@healthhive.com',
                phone_number: '3386223949'
            });
            await createStaff({
                name: 'Nina Rodriguez',
                title: 'Nurse',
                specialty: 'RN',
                provider_id: null,
                email: 'nrodriguez@healthhive.com',
                phone_number: '3386223950'
            });
            await createStaff({
                name: 'Bradley Kim',
                title: 'Nurse',
                specialty: 'Surgical Assistant',
                provider_id: null,
                email: 'bkim@healthhive.com',
                phone_number: '3386223951'
            });
            await createStaff({
                name: 'Sabrina Collins',
                title: 'Nurse',
                specialty: 'NP',
                provider_id: 7832,
                email: 'scollins@healthhive.com',
                phone_number: '3386223952'
            });
            await createStaff({
                name: 'Hazel Hayes',
                title: 'Nurse',
                specialty: 'RN',
                provider_id: null,
                email: 'hhayes@healthhive.com',
                phone_number: '3386462524'
            }); 
            await createStaff({
                name: 'Maggie Miller',
                title: 'Nurse',
                specialty: 'NP',
                provider_id: 6785,
                email: 'mmiller@healthhive.com',
                phone_number: '3386463524'
            }); 
            await createStaff({
                name: 'Nathan Nguyen',
                title: 'Nurse',
                specialty: 'ER',
                provider_id: null,
                email: 'nnguyen@healthhive.com',
                phone_number: '3386462554'
            });
            await createStaff({
                name: 'Olivia Ortiz',
                title: 'Nurse',
                specialty: 'Surgical Assistant',
                provider_id: null,
                email: 'oortiz@healthhive.com',
                phone_number: '3386462784'
            });
            await createStaff({
                name: 'Barbara Watson',
                title: 'Nurse',
                specialty: 'ER',
                provider_id: null,
                email: 'bwatson@healthhive.com',
                phone_number: '3386703524'
            });
            await createStaff({
                name: 'Carlos Martinez',
                title: 'Nurse',
                specialty: 'Surgical',
                provider_id: null,
                email: 'cmartinez@healthhive.com',
                phone_number: '3386723524'
            });
            await createStaff({
                name: 'Dawn James',
                title: 'Nurse',
                specialty: 'ICU',
                provider_id: null,
                email: 'djames@healthhive.com',
                phone_number: '3386734524'
            });
            await createStaff({
                name: 'Emily Rodriguez',
                title: 'Nurse',
                specialty: 'Orthopedic',
                provider_id: null,
                email: 'erodriguez@healthhive.com',
                phone_number: '3386745524'
            });
            await createStaff({
                name: 'Samantha Kim',
                title: 'Oncologist',
                specialty: 'Medical Oncology',
                provider_id: 7589,
                email: 'skim@healthhive.com',
                phone_number: '3387259876'
            });
            await createStaff({
                name: 'Samantha Drake',
                title: 'Oncologist',
                specialty: 'Breast Cancer',
                provider_id: 7012,
                email: 'sdrake@healthhive.com',
                phone_number: '3386462524'
            });
            await createStaff({
                name: 'Andrew Chen',
                title: 'Oncologist',
                specialty: 'Lung Cancer',
                provider_id: 7032,
                email: 'achen@healthhive.com',
                phone_number: '3386462524'
            });
            await createStaff({
                name: 'Emma Kim',
                title: 'Oncologist',
                specialty: 'Leukemia',
                provider_id: 7051,
                email: 'ekim@healthhive.com',
                phone_number: '3386462524'
            });
            await createStaff({
                name: 'Amy Lee',
                title: 'Ophthalmologist',
                specialty: 'Cataract Surgery',
                provider_id: 7638,
                email: 'alee@healthhive.com',
                phone_number: '3387215698'
            });
            await createStaff({
                name: 'Samantha Lee',
                title: 'Ophthalmologist',
                specialty: 'Retina and Vitreous',
                provider_id: 7567,
                email: 'slee@healthhive.com',
                phone_number: '3387678935'
            });
            await createStaff({
                name: 'Haley Kim',
                title: 'Orthopedic Surgeon',
                specialty: 'Orthopedic Surgery',
                provider_id: 8846,
                email: 'hkim@healthhive.com',
                phone_number: '3388461723'
            });
            await createStaff({
                name: 'Roberto Ayala',
                title: 'Orthopedic Surgeon',
                specialty: 'Sports Medicine',
                provider_id: 8035,
                email: 'rayala@healthhive.com',
                phone_number: '3385799555'
            });
            await createStaff({
                name: 'Megan Law',
                title: 'Orthopedic Surgeon',
                specialty: 'Orthopedics',
                provider_id: 8001,
                email: 'mlaw@healthhive.com',
                phone_number: '3386462524'
            });
            await createStaff({
                name: 'Megan Lee',
                title: 'Orthopedic Surgeon',
                specialty: 'Sports Medicine',
                provider_id: 8023,
                email: 'mlee@healthhive.com',
                phone_number: '3387414632'
            });
            await createStaff({
                name: 'Nathan Kim',
                title: 'Orthopedic Surgeon',
                specialty: 'Joint Replacement',
                provider_id: 8036,
                email: 'nkim@healthhive.com',
                phone_number: '3388975284'
            });
            await createStaff({
                name: 'Hannah Kim',
                title: 'Pediatrics Physician',
                specialty: 'Pediatrics',
                provider_id: 5372,
                email: 'hkim@healthhive.com',
                phone_number: '3387462524'
            });
            await createStaff({
                name: 'Emily Green',
                title: 'Pediatrics Physician',
                specialty: 'Pediatrics',
                provider_id: 5678,
                email: 'egreen@healthhive.com',
                phone_number: '3387456124'
            });
            await createStaff({
                name: 'Sophia Torres',
                title: 'Pediatrics Physician',
                specialty: 'Pediatrics',
                provider_id: 5680,
                email: 'storres@healthhive.com',
                phone_number: '3387456126'
            });
            await createStaff({
                name: 'William Kim',
                title: 'Pediatrics Physician',
                specialty: 'Pediatrics',
                provider_id: 5681,
                email: 'wkim@healthhive.com',
                phone_number: '3387456127'
            });
            await createStaff({
                name: 'Olivia Lee',
                title: 'Pediatrics Physician',
                specialty: 'Pediatrics',
                provider_id: 5682,
                email: 'olee@healthhive.com',
                phone_number: '3387456128'
            });
            await createStaff({
                name: 'Michael Davis',
                title: 'Pediatrics Physician',
                specialty: 'Pediatrics',
                provider_id: 5683,
                email: 'mdavis@healthhive.com',
                phone_number: '3387456129'
            });
            await createStaff({
                name: 'Tess Hartman',
                title: 'Plastic Surgeon',
                specialty: 'Cosmetic Surgery',
                provider_id: 8072,
                email: 'thartman@healthhive.com',
                phone_number: '3384870472'
            });
            await createStaff({
                name: 'Bridgette Kim',
                title: 'Plastic Surgeon',
                specialty: 'Reconstructive Surgery',
                provider_id: 8015,
                email: 'bkim@healthhive.com',
                phone_number: '3384870492'
            });
            await createStaff({
                name: 'Jordan Stone',
                title: 'Plastic Surgeon',
                specialty: 'Aesthetic Surgery',
                provider_id: 8047,
                email: 'jstone@healthhive.com',
                phone_number: '3384870442'
            });
            await createStaff({
                name: 'Ashley Anderson',
                title: 'Psychiatrist',
                specialty: 'Mental Health',
                provider_id: 5679,
                email: 'aanderson@healthhive.com',
                phone_number: '3386757890'
            });
            await createStaff({
                name: 'Benjamin Brown',
                title: 'Psychiatrist',
                specialty: 'Child and Adolescent Psychiatry',
                provider_id: 5601,
                email: 'bbrown@healthhive.com',
                phone_number: '3386750245'
            });
            await createStaff({
                name: 'Olivia Parker',
                title: 'Radiologist',
                specialty: 'Diagnostic Radiology',
                provider_id: 8123,
                email: 'oparker@healthhive.com',
                phone_number: '3386462524'
            });
            await createStaff({
                name: 'Sophia Gonzales',
                title: 'Radiologist',
                specialty: 'Diagnostic Radiology',
                provider_id: 8011,
                email: 'sgonzales@healthhive.com',
                phone_number: '3389994567'
            });
            await createStaff({
                name: 'Olivia Kim',
                title: 'Radiologist',
                specialty: 'Interventional Radiology',
                provider_id: 8012,
                email: 'okim@healthhive.com',
                phone_number: '3389994568'
            });
            await createStaff({
                name: 'Ethan Lee',
                title: 'Radiologist',
                specialty: 'Nuclear Radiology',
                provider_id: 8013,
                email: 'elee@healthhive.com',
                phone_number: '3389994569'
            });
            await createStaff({
                name: 'Alexis Chen',
                title: 'Surgeon',
                specialty: 'General Surgery',
                provider_id: 8600,
                email: 'achen@healthhive.com',
                phone_number: '3386602524'
            });
            await createStaff({
                name: 'Andrew Chen',
                title: 'Surgeon',
                specialty: 'Cardiothoracic Surgery',
                provider_id: 8960,
                email: 'achen@healthhive.com',
                phone_number: '3386462524'
            });
            await createStaff({
                name: 'Sara Kim',
                title: 'Surgeon',
                specialty: 'Orthopedic Surgery',
                provider_id: 8961,
                email: 'skim@healthhive.com',
                phone_number: '3386462525'
            });
            await createStaff({
                name: 'William Brown',
                title: 'Surgeon',
                specialty: 'Plastic Surgery',
                provider_id: 8962,
                email: 'wbrown@healthhive.com',
                phone_number: '3386462526'
            });
            await createStaff({
                name: 'Emma Lee',
                title: 'Surgeon',
                specialty: 'Vascular Surgery',
                provider_id: 8963,
                email: 'elee@healthhive.com',
                phone_number: '3386462527'
            });
            await createStaff({
                name: 'David Parker',
                title: 'Surgeon',
                specialty: 'General Surgery',
                provider_id: 8964,
                email: 'dparker@healthhive.com',
                phone_number: '3386462528'
            });
            await createStaff({
                name: 'Rebecca Green',
                title: 'Surgeon',
                specialty: 'Neurosurgery',
                provider_id: 8965,
                email: 'rgreen@healthhive.com',
                phone_number: '3386462529'
            });
            await createStaff({
                name: 'Michael Wilson',
                title: 'Surgeon',
                specialty: 'Colorectal Surgery',
                provider_id: 8966,
                email: 'mwilson@healthhive.com',
                phone_number: '3386462530'
            });
            await createStaff({
                name: 'Emily Davis',
                title: 'Surgeon',
                specialty: 'Otolaryngology',
                provider_id: 8967,
                email: 'edavis@healthhive.com',
                phone_number: '3386462531'
            });
            await createStaff({
                name: 'Maggie Kim',
                title: 'Surgeon',
                specialty: 'Urology',
                provider_id: 5153,
                email: 'mkim@healthhive.com',
                phone_number: '3386123587'
            });
            await createStaff({
                name: 'Caroline Lee',
                title: 'Urologist',
                specialty: 'Urology',
                provider_id: 5674,
                email: 'clee@healthhive.com',
                phone_number: '3387654832'
            });
            await createStaff({
                name: 'Tina Nguyen',
                title: 'Urologist',
                specialty: 'Urology',
                provider_id: 5713,
                email: 'tnguyen@healthhive.com',
                phone_number: '3383447513'
            });
            await createStaff({
                name: 'Sarah Kim',
                title: 'Urologist',
                specialty: 'Urology',
                provider_id: 5911,
                email: 'skim@healthhive.com',
                phone_number: '3383447911'
            });
            await createStaff({
                name: 'Evelyn Lockwood',
                title: 'Pharmacist',
                specialty: 'Pharmacy',
                provider_id: 9073,
                email: 'elockwood@healthhive.com',
                phone_number: '3386237593'
            });
            await createStaff({
                name: 'Jenna Thomas',
                title: 'Pharmacist',
                specialty: 'Pharmacy',
                provider_id: 9015,
                email: 'jthomas@healthhive.com',
                phone_number: '3389825674'
            });
            await createStaff({
                name: 'Michael Kim',
                title: 'Pharmacist',
                specialty: 'Pharmacy',
                provider_id: 9016,
                email: 'mkim@healthhive.com',
                phone_number: '3389695647'
            });
            await createStaff({
                name: 'Samantha Lee',
                title: 'Pharmacist',
                specialty: 'Pharmacy',
                provider_id: 9017,
                email: 'slee@healthhive.com',
                phone_number: '3389562347'
            });
            await createStaff({
                name: 'Emily Davis',
                title: 'Pharmacist',
                specialty: 'Pharmacy',
                provider_id: 9018,
                email: 'edavis@healthhive.com',
                phone_number: '3389236784'
            });
            await createStaff({
                name: 'William Chen',
                title: 'Pharmacist',
                specialty: 'Pharmacy',
                provider_id: 9019,
                email: 'wchen@healthhive.com',
                phone_number: '3389659832'
            });
            await createStaff({
                name: 'Olivia Smith',
                title: 'Pharmacist',
                specialty: 'Pharmacy',
                provider_id: 9020,
                email: 'osmith@healthhive.com',
                phone_number: '3384674949'
            });
            await createStaff({
                name: 'Sarah Lee',
                title: 'Internal Medicine Physician',
                specialty: 'Internal Medicine',
                provider_id: 5643,
                email: 'slee@healthhive.com',
                phone_number: '3387456343'
            });
            await createStaff({
                name: 'Emily Kim',
                title: 'Internal Medicine Physician',
                specialty: 'Internal Medicine',
                provider_id: 5143,
                email: 'ekim@healthhive.com',
                phone_number: '3389876123'
            });
            await createStaff({
                name: 'David Lee',
                title: 'Internal Medicine Physician',
                specialty: 'Internal Medicine',
                provider_id: 5198,
                email: 'dlee@healthhive.com',
                phone_number: '3389234567'
            });
            await createStaff({
                name: 'Sophie Chen',
                title: 'Internal Medicine Physician',
                specialty: 'Internal Medicine',
                provider_id: 5121,
                email: 'schen@healthhive.com',
                phone_number: '3389432108'
            });
            await createStaff({
                name: 'William Brown',
                title: 'Internal Medicine Physician',
                specialty: 'Internal Medicine',
                provider_id: 5104,
                email: 'wbrown@healthhive.com',
                phone_number: '3389657891'
            });
            await createStaff({
                name: 'Olivia Jackson',
                title: 'Internal Medicine Physician',
                specialty: 'Internal Medicine',
                provider_id: 5155,
                email: 'ojackson@healthhive.com',
                phone_number: '3389243567'
            });
            await createStaff({
                name: 'John Doe',
                title: 'Internal Medicine Physician',
                specialty: 'Internal Medicine',
                provider_id: 5178,
                email: 'jdoe@healthhive.com',
                phone_number: '3389123890'
            });
            await createStaff({
                name: 'Jane Doe',
                title: 'Internal Medicine Physician',
                specialty: 'Internal Medicine',
                provider_id: 5163,
                email: 'janedoe@healthhive.com',
                phone_number: '3389234567'
            });
            await createStaff({
                name: 'Robert Smith',
                title: 'Internal Medicine Physician',
                specialty: 'Internal Medicine',
                provider_id: 5180,
                email: 'rsmith@healthhive.com',
                phone_number: '3389456789'
            });
                
            console.log('Finished creating staff.');
        } catch (error) {
            console.error('Error when creating staff!');
            console.log(error);
        }
    };

    // Method: createInitialTreatmentPlan
    async function createInitialTreatmentPlan() {
        console.log('Starting to create treatment plan...')
        try {
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 1,
                provider_id: 1537,
            });
            await createTreatmentPlan({
                plan: 'Diabetes Management',
                patient_id: 2,
                provider_id: 5456,
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 3,
                provider_id: 6547,
                });
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 4,
                provider_id: 5155,
                });
            await createTreatmentPlan({
                plan: 'Multiple Sclerosis Treatment',
                patient_id: 5,
                provider_id: 5637,
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease (COPD) Treatment',
                patient_id: 6,
                provider_id: 5723,
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 7,
                provider_id: 6547,
                });
            await createTreatmentPlan({
                plan: 'GERD Treatment',
                patient_id: 8,
                provider_id: 5913,
                });
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 9,
                provider_id: 5178,
                });
            await createTreatmentPlan({
                plan: 'Arthritis Treatment',
                patient_id: 10,
                provider_id: 8846,
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease Treatment',
                patient_id: 11,
                provider_id: 5537,
                });
            await createTreatmentPlan({
                plan: 'Arthritis Treatment',
                patient_id: 12,
                provider_id: 5178,
                });
            await createTreatmentPlan({
                plan: 'Diabetes Management',
                patient_id: 13,
                provider_id: 5382
                });
            await createTreatmentPlan({
                plan: 'Chronic Myeloid Leukemia Treatment',
                patient_id: 14,
                provider_id: 7051,
                });
            await createTreatmentPlan({
                plan: 'Chronic Fatigue Syndrome Treatment',
                patient_id: 15,
                provider_id: 5155,
                });
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 16,
                provider_id: 5125,
                });
            await createTreatmentPlan({
                plan: 'Irritable Bowel Syndrome Treatment',
                patient_id: 17,
                provider_id: 5913
                });
            await createTreatmentPlan({
                plan: 'Osteoarthritis Treatment',
                patient_id: 18,
                provider_id: 8023,
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 19,
                provider_id: 6547,
                });
            await createTreatmentPlan({
                plan: 'Chronic Kidney Disease Treatment',
                patient_id: 20,
                provider_id: 5674
                });
            await createTreatmentPlan({
                plan: 'Gastroesophageal Reflux Disease (GERD) Treatment',
                patient_id: 21,
                provider_id: 5913,
                });
            await createTreatmentPlan({
                plan: 'Chronic Migraines Treatment',
                patient_id: 22,
                provider_id: 6837,
                });
            await createTreatmentPlan({
                plan: 'Chronic Migraines Treatment',
                patient_id: 23,
                provider_id: 6537,
                });
            await createTreatmentPlan({
                plan: 'Acute Gastroenteritis Treatment',
                patient_id: 24,
                provider_id: 5537
                });
            await createTreatmentPlan({
                plan: 'Chronic Sinusitis Treatment',
                patient_id: 25,
                provider_id: 5201
                });
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 26,
                provider_id: 5382
                });
            await createTreatmentPlan({
                plan: 'Type 2 Diabetes Treatment',
                patient_id: 27,
                provider_id: 5125,
                });
            await createTreatmentPlan({
                plan: 'Anxiety Disorder Treatment',
                patient_id: 28,
                provider_id: 5679,
                });
            await createTreatmentPlan({
                plan: 'Chronic Fatigue Syndrome Treatment',
                patient_id: 29,
                provider_id: 5201,
                });
            await createTreatmentPlan({
                plan: "Meniere's Disease Treatment",
                patient_id: 30,
                provider_id: 6013,
                });
            await createTreatmentPlan({
                plan: 'Depression Treatment',
                patient_id: 31,
                provider_id: 5601,
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 32,
                provider_id: 6837
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 33,
                provider_id: 6537
                });
            await createTreatmentPlan({
                plan: 'Diabetes Mellitus Treatment',
                patient_id: 34,
                provider_id: 5382,
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 35,
                provider_id: 5780,
                });
            await createTreatmentPlan({
                plan: 'Chronic Migraine Management',
                patient_id: 36,
                provider_id: 6547,
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease Treatment',
                patient_id: 37,
                provider_id: 5643,
                });
            await createTreatmentPlan({
                plan: 'Type 2 Diabetes Management',
                patient_id: 38,
                provider_id: 5143
                });
            await createTreatmentPlan({
                plan: 'Chronic Fatigue Syndrome Treatment',
                patient_id: 39,
                provider_id: 5643,
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease (COPD) Treatment',
                patient_id: 40,
                provider_id: 5121,
                });
            await createTreatmentPlan({
                plan: 'Upper Respiratory Infection Treatment',
                patient_id: 41,
                provider_id: 5155,
                });
            await createTreatmentPlan({
                plan: 'Migraine Headache Treatment',
                patient_id: 42,
                provider_id: 5178,
                });
            await createTreatmentPlan({
                plan: 'Type 2 Diabetes Management',
                patient_id: 43,
                provider_id: 5155,
                });
            await createTreatmentPlan({
                plan: 'Chronic Migraine Treatment',
                patient_id: 44,
                provider_id: 5104
                });
            await createTreatmentPlan({
                plan: 'Depression Treatment',
                patient_id: 45,
                provider_id: 5601,
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease Treatment',
                patient_id: 46,
                provider_id: 5180,
                });
            await createTreatmentPlan({
                plan: 'Chronic Migraine Management',
                patient_id: 47,
                provider_id: 5637,
                });
            await createTreatmentPlan({
                plan: 'Anxiety Disorder Treatment',
                patient_id: 48,
                provider_id: 5678,
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 49,
                provider_id: 5382,
                });
            await createTreatmentPlan({
                plan: 'Osteoarthritis Treatment',
                patient_id: 50,
                provider_id: 8023,
                });
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 51,
                provider_id: 1538
                });
            await createTreatmentPlan({
                plan: 'Chronic Sinusitis Treatment',
                patient_id: 52,
                provider_id: 5537
                });
            await createTreatmentPlan({
                plan: 'Carpel Tunnel Syndrome Treatment',
                patient_id: 53,
                provider_id: 5382,
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease (COPD) Treatment',
                patient_id: 54,
                provider_id: 5125
                });
            await createTreatmentPlan({
                plan: 'Viral Meningitis Treatment',
                patient_id: 55,
                provider_id: 5723,
                });
            await createTreatmentPlan({
                plan: 'Stress Induced Headache Treatment',
                patient_id: 56,
                provider_id: 6547,
                });
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 57,
                provider_id: 5121,
                });
            await createTreatmentPlan({
                plan: 'Type 2 Diabetes Management',
                patient_id: 58,
                provider_id: 5143,
                });
            await createTreatmentPlan({
                plan: 'Gastroesophageal Reflux Disease Treatment',
                patient_id: 59,
                provider_id: 5637,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 60,
                provider_id: 5178,
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease (COPD) Treatment',
                patient_id: 61,
                provider_id: 5178
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease (COPD) Treatment',
                patient_id: 62,
                provider_id: 5104
                });
            await createTreatmentPlan({
                plan: 'Anxiety Disorder Treatment',
                patient_id: 63,
                provider_id: 5679,
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 64,
                provider_id: 5643,
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 65,
                provider_id: 5143,
                });
            await createTreatmentPlan({
                plan: 'Acute Otitis Media Treatment',
                patient_id: 66,
                provider_id: 5382
                });
            await createTreatmentPlan({
                plan: 'Acute Otitis Media Treatment',
                patient_id: 67,
                provider_id: 5382
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 68,
                provider_id: 5723
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 69,
                provider_id: 5104,
                });
            await createTreatmentPlan({
                plan: 'Fibromyalgia Treatment',
                patient_id: 70,
                provider_id: 5723,
                });
            await createTreatmentPlan({
                plan: 'Gastritis Treatment',
                patient_id: 71,
                provider_id: 5913,
                });
            await createTreatmentPlan({
                plan: 'Diabetic Neuropathy Treatment',
                patient_id: 72,
                provider_id: 5155,
                });
            await createTreatmentPlan({
                plan: 'Chronic Pain Treatment',
                patient_id: 73,
                provider_id: 5104,
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease Treatment',
                patient_id: 74,
                provider_id: 5125,
                });
            await createTreatmentPlan({
                plan: 'Anxiety Treatment',
                patient_id: 75,
                provider_id: 5679,
                });
            await createTreatmentPlan({
                plan: 'Type 2 Diabetes Management',
                patient_id: 76,
                provider_id: 5104,
                });
            await createTreatmentPlan({
                plan: 'Gastroesophageal Reflux Disease (GERD) Treatment',
                patient_id: 77,
                provider_id: 5637,
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 78,
                provider_id: 5121,
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 79,
                provider_id: 5104,
                });
            await createTreatmentPlan({
                plan: 'Pneumonia Treatment',
                patient_id: 80,
                provider_id: 5343,
                });
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 81,
                provider_id: 5456,
                });
            await createTreatmentPlan({
                plan: 'Stroke Recovery',
                patient_id: 82,
                provider_id: 6837
                });
            await createTreatmentPlan({
                plan: 'Migraine Headache Treatment',
                patient_id: 83,
                provider_id: 6547,
                });
            await createTreatmentPlan({
                plan: 'Anxiety Disorder Treatment',
                patient_id: 84,
                provider_id: 5679
                });
            await createTreatmentPlan({
                plan: 'Pneumonia Treatment',
                patient_id: 85,
                provider_id: 5178,
                });
            await createTreatmentPlan({
                plan: 'Pulmonary Embolism Treatment',
                patient_id: 86,
                provider_id: 8963,
                });
            await createTreatmentPlan({
                plan: 'Chronic Migraine Treatment',
                patient_id: 87,
                provider_id: 6547,
                });
            await createTreatmentPlan({
                plan: 'Anxiety Disorder Treatment',
                patient_id: 88,
                provider_id: 5679,
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 89,
                provider_id: 5155,
                });
            await createTreatmentPlan({
                plan: 'Chronic Fatigue Syndrome Treatment',
                patient_id: 90,
                provider_id: 5178,
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 91,
                provider_id: 5163,
                });
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 92,
                provider_id: 5456,
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 93,
                provider_id: 5343,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 94,
                provider_id: 5537
                });
            await createTreatmentPlan({
                plan: 'Broken Arm Treatment',
                patient_id: 95,
                provider_id: 8846,
                });
            await createTreatmentPlan({
                plan: 'Gunshot Wound Treatment',
                patient_id: 96,
                provider_id: 4568,
                });
            await createTreatmentPlan({
                plan: 'Concussion Treatment',
                patient_id: 97,
                provider_id: 4568,
                });
            await createTreatmentPlan({
                plan: 'Broken Arm Treatment',
                patient_id: 98,
                provider_id: 8035,
                });
            await createTreatmentPlan({
                plan: 'Fractured Arm Treatment',
                patient_id: 99,
                provider_id: 8846,
                });
            await createTreatmentPlan({
                plan: 'Chest Pain Treatment',
                patient_id: 100,
                provider_id: 2586,
                });
            await createTreatmentPlan({
                plan: 'Broken Arm Treatment',
                patient_id: 104,
                provider_id: 8036,
                });
            await createTreatmentPlan({
                plan: 'Fractured Arm Treatment',
                patient_id: 102,
                provider_id: 8001,
                });
            await createTreatmentPlan({
                plan: 'Injury from Motor Vehicle Accident Treatment',
                patient_id: 103,
                provider_id: 4579,
                });
            await createTreatmentPlan({
                plan: 'Fractured Arm Treatment',
                patient_id: 104,
                provider_id: 8023,
                });
            await createTreatmentPlan({
                plan: 'Chest Pain Treatment',
                patient_id: 105,
                provider_id: 2514,
                });
            await createTreatmentPlan({
                plan: 'Chest Pain Treatment',
                patient_id: 106,
                provider_id: 2655,
                });
            await createTreatmentPlan({
                plan: 'Broken Arm Treatment',
                patient_id: 107,
                provider_id: 8846,
                });
            await createTreatmentPlan({
                plan: 'Chronic Kidney Disease Treatment',
                patient_id: 108,
                provider_id: 5674
                });
            await createTreatmentPlan({
                plan: 'Chronic Kidney Disease Treatment',
                patient_id: 109,
                provider_id: 5674
                });
            await createTreatmentPlan({
                plan: 'Chronic Kidney Disease Treatment',
                patient_id: 110,
                provider_id: 5713
                });
            await createTreatmentPlan({
                plan: 'Chronic Kidney Disease Treatment',
                patient_id: 111,
                provider_id: 5911
                });
            await createTreatmentPlan({
                plan: 'Chronic Kidney Disease Treatment',
                patient_id: 112,
                provider_id: 5713
                });
            await createTreatmentPlan({
                plan: 'Chronic Kidney Disease Treatment',
                patient_id: 113,
                provider_id: 5911
                });
            await createTreatmentPlan({
                plan: 'Chronic Migraines Treatment',
                patient_id: 114,
                provider_id: 6537,
                });
            await createTreatmentPlan({
                plan: 'Migraine Headache Treatment',
                patient_id: 115,
                provider_id: 6837,
                });
            await createTreatmentPlan({
                plan: 'Migraine Headache Treatment',
                patient_id: 116,
                provider_id: 6547,
                });
            await createTreatmentPlan({
                plan: 'Migraine Headache Treatment',
                patient_id: 117,
                provider_id: 6547,
                });
            await createTreatmentPlan({
                plan: 'Neurological Disorder Treatment',
                patient_id: 118,
                provider_id: 6537,
                });
            await createTreatmentPlan({
                plan: 'Epileptic Seizure Disorder Management',
                patient_id: 119,
                provider_id: 6547,
                });
            await createTreatmentPlan({
                plan: 'Cerebral Palsy Treatment',
                patient_id: 120,
                provider_id: 6837,
                });
            await createTreatmentPlan({
                plan: 'Chronic Migraine Treatment',
                patient_id: 121,
                provider_id: 6537,
                });
            await createTreatmentPlan({
                plan: 'Migraine Headache Treatment',
                patient_id: 122,
                provider_id: 6547,
                });
            await createTreatmentPlan({
                plan: 'Chronic Migraine Treatment',
                patient_id: 123,
                provider_id: 6537,
                });
            await createTreatmentPlan({
                plan: 'Migraine Headache Treatment',
                patient_id: 124,
                provider_id: 6547,
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 125,
                provider_id: 6837,
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 126,
                provider_id: 68337,
                });
            await createTreatmentPlan({
                plan: 'Ophthalmic Issues Treatment',
                patient_id: 127,
                provider_id: 7567,
                });
            await createTreatmentPlan({
                plan: 'Ophthalmic Issues Treatment',
                patient_id: 128,
                provider_id: 7638,
                });
            await createTreatmentPlan({
                plan: 'Acute Myocardial Infarction Treatment',
                patient_id: 129,
                provider_id: 2586,
                });
            await createTreatmentPlan({
                plan: 'Myocardial Infarction Treatment',
                patient_id: 130,
                provider_id: 2514,
                });
            await createTreatmentPlan({
                plan: 'Acute Coronary Syndrome Treatment',
                patient_id: 131,
                provider_id: 2655,
                });
            await createTreatmentPlan({
                plan: 'Cardiac Arrhythmia Treatment',
                patient_id: 132,
                provider_id: 2655,
                });
            await createTreatmentPlan({
                plan: 'Myocardial Infarction Treatment',
                patient_id: 133,
                provider_id: 2514,
                });
            await createTreatmentPlan({
                plan: 'Chronic Dermatitis Treatment',
                patient_id: 134,
                provider_id: 3567,
                });
            await createTreatmentPlan({
                plan: 'Eczema Treatment',
                patient_id: 135,
                provider_id: 3456,
                });
            await createTreatmentPlan({
                plan: 'Skin Rash Treatment',
                patient_id: 136,
                provider_id: 3901,
                });
            await createTreatmentPlan({
                plan: 'Eczema Treatment',
                patient_id: 137,
                provider_id: 3456,
                });
            await createTreatmentPlan({
                plan: 'Eczema Treatment',
                patient_id: 138,
                provider_id: 3901,
                });
            await createTreatmentPlan({
                plan: 'Gaucher Disease Treatment',
                patient_id: 139,
                provider_id: 6837,
                });
            await createTreatmentPlan({
                plan: 'Mitochondrial Disease Treatment',
                patient_id: 140,
                provider_id: 5143,
                });
            await createTreatmentPlan({
                plan: 'Chronic Inflammatory Demyelinating Polyneuropathy Treatment',
                patient_id: 141,
                provider_id: 6837,
                });
            await createTreatmentPlan({
                plan: 'Rare Autoimmune Disorder Treatment',
                patient_id: 142,
                provider_id: 5121,
                });
            await createTreatmentPlan({
                plan: 'Xeroderma Pigmentosum Treatment',
                patient_id: 143,
                provider_id: 3901,
                });
            await createTreatmentPlan({
                plan: 'Amyotrophic Lateral Sclerosis Treatment',
                patient_id: 144,
                provider_id: 3579,
                });
            await createTreatmentPlan({
                plan: 'Ehlers-Danlos Syndrome Treatment',
                patient_id: 145,
                provider_id: 8846,
                });
            await createTreatmentPlan({
                plan: 'Niemann-Pick Disease Treatment',
                patient_id: 146,
                provider_id: 8965,
                });
            await createTreatmentPlan({
                plan: 'Chronic Inflammatory Demyelinating Polyneuropathy Treatment',
                patient_id: 147,
                provider_id: 6837,
                });
            await createTreatmentPlan({
                plan: 'Autoimmune Disorder Treatment',
                patient_id: 148,
                provider_id: 5643,
                });
            await createTreatmentPlan({
                plan: 'Primary Aldosteronism Treatment',
                patient_id: 149,
                provider_id: 5143
                });
            await createTreatmentPlan({
                plan: 'Autoimmune Hemolytic Anemia Treatment',
                patient_id: 150,
                provider_id: 5143
                });
            await createTreatmentPlan({
                plan: 'Hereditary Hemorrhagic Telangiectasia Treatment',
                patient_id: 151,
                provider_id: 5180
                });
            await createTreatmentPlan({
                plan: 'Adrenoleukodystrophy Treatment',
                patient_id: 152,
                provider_id: 6547,
                });
            await createTreatmentPlan({
                plan: 'Adrenoleukodystrophy Treatment',
                patient_id: 153,
                provider_id: 6537,
                });
            await createTreatmentPlan({
                plan: 'Acute Myocardial Infarction Treatment',
                patient_id: 154,
                provider_id: 2655,
                });
            await createTreatmentPlan({
                plan: 'Lupus Treatment',
                patient_id: 155,
                provider_id: 5456,
                });
            await createTreatmentPlan({
                plan: 'Lupus Treatment',
                patient_id: 156,
                provider_id: 5343,
                });
            await createTreatmentPlan({
                plan: 'Lupus Treatment',
                patient_id: 157,
                provider_id: 5456,
                });
            await createTreatmentPlan({
                plan: 'Hypertension Treatment',
                patient_id: 158,
                provider_id: 5201,
                });
            await createTreatmentPlan({
                plan: 'Hypertension Treatment',
                patient_id: 159,
                provider_id: 5382,
                });
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 160,
                provider_id: 5125,
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease (COPD)',
                patient_id: 161,
                provider_id: 5456,
                });
            await createTreatmentPlan({
                plan: 'Irritable Bowel Syndrome (IBS)',
                patient_id: 162,
                provider_id: 5343,
                });
            await createTreatmentPlan({
                plan: 'Asthma',
                patient_id: 163,
                provider_id: 5537,
                });
            await createTreatmentPlan({
                plan: 'Pneumonia',
                patient_id: 164,
                provider_id: 5382,
                });
            await createTreatmentPlan({
                plan: 'Asthma',
                patient_id: 165,
                provider_id: 5201,
                });
            await createTreatmentPlan({
                plan: 'Influenza',
                patient_id: 166,
                provider_id: 5723,
                });
            await createTreatmentPlan({
                plan: 'Rheumatoid Arthritis',
                patient_id: 167,
                provider_id: 5780,
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease (COPD)',
                patient_id: 168,
                provider_id: 5780,
                });
            await createTreatmentPlan({
                plan: 'Asthma',
                patient_id: 169,
                provider_id: 5589,
                });
            await createTreatmentPlan({
                plan: 'Diabetes Mellitus',
                patient_id: 170,
                provider_id: 5780,
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 171,
                provider_id: 5589,
                });
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 172,
                provider_id: 5382,
                });
            await createTreatmentPlan({
                plan: 'Asthmas Treatment',
                patient_id: 173,
                provider_id: 5537,
                });
            await createTreatmentPlan({
                plan: 'Appendicitis Treatment',
                patient_id: 174,
                provider_id: 5343,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 175,
                provider_id: 5456,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 176,
                provider_id: 5643,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 177,
                provider_id: 5643,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 178,
                provider_id: 5143,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 179,
                provider_id: 5198,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 180,
                provider_id: 5121,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 181,
                provider_id: 5104,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 182,
                provider_id: 5155,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 183,
                provider_id: 5178,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 184,
                provider_id: 5180,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 185,
                provider_id: 5163,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 186,
                provider_id: 5178,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 187,
                provider_id: 5643,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 188,
                provider_id: 5155,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 189,
                provider_id: 5178,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 190,
                provider_id: 5180,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 191,
                provider_id: 5163,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 192,
                provider_id: 5178,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 193,
                provider_id: 5643,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 194,
                provider_id: 5178,
                });
            await createTreatmentPlan({
                plan: 'COVID-19 Treatment',
                patient_id: 195,
                provider_id: 5643,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 196,
                provider_id: 5456,
                });
            await createTreatmentPlan({
                plan: 'Chronic Migraine Treatment',
                patient_id: 197,
                provider_id: 6837,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 198,
                provider_id: 5456,
                });
            await createTreatmentPlan({
                plan: 'Diabetes Treatment',
                patient_id: 199,
                provider_id: 5643,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 200,
                provider_id: 5343,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 201,
                provider_id: 5537,
                });
            await createTreatmentPlan({
                plan: 'Gout Treatment',
                patient_id: 202,
                provider_id: 5201,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 203,
                provider_id: 5780,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 204,
                provider_id: 5589,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 205,
                provider_id: 5537,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 206,
                provider_id: 5382,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 207,
                provider_id: 5201,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 208,
                provider_id: 5125,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 209,
                provider_id: 5723,
                });
            await createTreatmentPlan({
                plan: 'Gastroesophageal Reflux Disease Treatment',
                patient_id: 210,
                provider_id: 5456,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 211,
                provider_id: 5537,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 212,
                provider_id: 5456,
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 213,
                provider_id: 5456,
                });
            await createTreatmentPlan({
                plan: "Crohn's Disease Treatment",
                patient_id: 214,
                provider_id: 5143,
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 215,
                provider_id: 5198,
                });
            await createTreatmentPlan({
                plan: "Crohn's Disease Treatment",
                patient_id: 216,
                provider_id: 5143,
                });
            await createTreatmentPlan({
                plan: "Type 2 Diabetes Treatment",
                patient_id: 217,
                provider_id: 5143,
                });
            await createTreatmentPlan({
                plan: 'Pulmonary Embolism Treatment',
                patient_id: 218,
                provider_id: 8960,
                });
            await createTreatmentPlan({
                plan: 'Esophageal Cancer Treatment',
                patient_id: 219,
                provider_id: 7589,
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 220,
                provider_id: 6837,
                });
            await createTreatmentPlan({
                plan: 'Colorectal Cancer Treatment',
                patient_id: 221,
                provider_id: "7589"
                });
            await createTreatmentPlan({
                plan: 'Chronic Fatigue Syndrome Treatment',
                patient_id: 222,
                provider_id: 5180,
                });
            await createTreatmentPlan({
                plan: 'Chronic Fatigue Syndrome Treatment',
                patient_id: 223,
                provider_id: 5163,
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease (COPD) Treatment',
                patient_id: 224,
                provider_id: 5178,
                });
            await createTreatmentPlan({
                plan: "Chron's Disease Treatment",
                patient_id: 225,
                provider_id: 5913,
                });
            await createTreatmentPlan({
                plan: 'Meningitis Treatment',
                patient_id: 226,
                provider_id: 6837
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease (COPD) Treatment',
                patient_id: 227,
                provider_id: 5178,
                });
            await createTreatmentPlan({
                plan: 'Chronic Fatigue Syndrome Treatment',
                patient_id: 228,
                provider_id: 5163,
                });
            await createTreatmentPlan({
                plan: 'Fibromyalgia Treatment',
                patient_id: 229,
                provider_id: 5343
                });
            await createTreatmentPlan({
                plan: 'Multiple Sclerosis Treatment',
                patient_id: 230,
                provider_id: 6537,
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 231,
                provider_id: 6537,
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease (COPD) Treatment',
                patient_id: 232,
                provider_id: 5143
                });
            await createTreatmentPlan({
                plan: 'Diabetes Mellitus Treatment',
                patient_id: 233,
                provider_id: 5643,
                });
            await createTreatmentPlan({
                plan: 'Multiple Sclerosis Treatment',
                patient_id: 234,
                provider_id: 6837,
                });
            await createTreatmentPlan({
                plan: 'Type 2 Diabetes Treatment',
                patient_id: 235,
                provider_id: 5178
                });
            await createTreatmentPlan({
                plan: 'Rheumatoid Arthritis Treatment',
                patient_id: 236,
                provider_id: 5198,
                });
            await createTreatmentPlan({
                plan: "Chron's Disease Treatment",
                patient_id: 237,
                provider_id: 5143,
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 238,
                provider_id: 5104,
                });
            await createTreatmentPlan({
                plan: "Chron's Disease Treatment",
                patient_id: 239,
                provider_id: 5143,
                });
            await createTreatmentPlan({
                plan: 'Multiple Sclerosis Treatment',
                patient_id: 240,
                provider_id: 6537,
                });
            await createTreatmentPlan({
                plan: 'Diabetes Treatment',
                patient_id: 241,
                provider_id: 5589,
                });
            await createTreatmentPlan({
                plan: 'Type 2 Diabetes Treatment',
                patient_id: 242,
                provider_id: 5723,
                });
            await createTreatmentPlan({
                plan: 'Chronic Fatigue Syndrome Treatment',
                patient_id: 243,
                provider_id: 5780,
                });
            await createTreatmentPlan({
                plan: "Chron's Disease Treatment",
                patient_id: 244,
                provider_id: 5343,
                });
            await createTreatmentPlan({
                plan: "Chron's Disease Treatment",
                patient_id: 245,
                provider_id: 5382,
                });
            await createTreatmentPlan({
                plan: 'Arm Fracture Treatment',
                patient_id: 246,
                provider_id: 4579,
                });
            await createTreatmentPlan({
                plan: 'Arm Fracture Treatment',
                patient_id: 247,
                provider_id: 4967,
                });
            await createTreatmentPlan({
                plan: 'Arm Fracture Treatment',
                patient_id: 248,
                provider_id: 4579,
                });
            await createTreatmentPlan({
                plan: 'Soft Tissue Injury Treatment',
                patient_id: 249,
                provider_id: 8846
                });
            await createTreatmentPlan({
                plan: 'Traumatic Brain Injury Treatment',
                patient_id: 249,
                provider_id: 6547
                });
            await createTreatmentPlan({
                plan: 'Traumatic Brain Injury Treatment',
                patient_id: 250,
                provider_id: 6547,
                });
            await createTreatmentPlan({
                plan: 'Fractured Arm Treatment',
                patient_id: 251,
                provider_id: 8035
                });
            await createTreatmentPlan({
                plan: 'Fractured Arm Treatment',
                patient_id: 252,
                provider_id: 8846
                });
            await createTreatmentPlan({
                plan: 'Bone Fracture Treatment',
                patient_id: 253,
                provider_id: 8846
                });
            await createTreatmentPlan({
                plan: 'Traumatic Brain Injury Treatment',
                patient_id: 254,
                provider_id: 6547,
                });
            await createTreatmentPlan({
                plan: 'Sprained Ankle Treatment',
                patient_id: 255,
                provider_id: 8001
                });
            await createTreatmentPlan({
                plan: 'Fractured Arm Treatment',
                patient_id: 256,
                provider_id: 8023
                });
            await createTreatmentPlan({
                plan: 'Stress Fracture Treatment',
                patient_id: 257,
                provider_id: 8846
                });
            await createTreatmentPlan({
                plan: 'Broken Bone Treatment',
                patient_id: 258,
                provider_id: 8001
                });
            await createTreatmentPlan({
                plan: 'Broken Bone Treatment',
                patient_id: 259,
                provider_id: 8846
                });
            await createTreatmentPlan({
                plan: 'Broken Arm Treatment',
                patient_id: 260,
                provider_id: 8001
                });
            await createTreatmentPlan({
                plan: 'Fibromyalgia Treatment',
                patient_id: 261,
                provider_id: 5104,
                });
            await createTreatmentPlan({
                plan: 'Sprained Ankle Treatment',
                patient_id: 262,
                provider_id: 8846,
                });
            await createTreatmentPlan({
                plan: 'Fractured Arm Treatment',
                patient_id: 263,
                provider_id: 8001
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 264,
                provider_id: 5201
                });
            await createTreatmentPlan({
                plan: 'Bone Fracture Treatment',
                patient_id: 265,
                provider_id: 8035
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 266,
                provider_id: 6547
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 266,
                provider_id: 5121
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 267,
                provider_id: 5198
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 268,
                provider_id: 6537
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 269,
                provider_id: 6547
                });
            await createTreatmentPlan({
                plan: 'Rheumatoid Arthritis Treatment',
                patient_id: 270,
                provider_id: 5456
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 271,
                provider_id: 5198
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease (COPD) Treatment',
                patient_id: 272,
                provider_id: 5537 
                });
            await createTreatmentPlan({
                plan: "Crohn's Disease Treatment",
                patient_id: 273,
                provider_id: 5637
                });
            await createTreatmentPlan({
                plan: 'Herniated Disk Treatment',
                patient_id: 274,
                provider_id: 6547
                });
            await createTreatmentPlan({
                plan: 'Meniscal Tear Treatment',
                patient_id: 275,
                provider_id: 8035
                });
            await createTreatmentPlan({
                plan: 'Anxiety Disorder Treatment',
                patient_id: 276,
                provider_id: 5679
                });
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 277,
                provider_id: 5643
                });
            await createTreatmentPlan({
                plan: 'Chronic Fatigue Syndrome Treatment',
                patient_id: 278,
                provider_id: 5121
                });
            await createTreatmentPlan({
                plan: 'Carpal Tunnel Syndrome Treatment',
                patient_id: 279,
                provider_id: 5198
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 280,
                provider_id: 6547
                });
            await createTreatmentPlan({
                plan: 'Migraine Treatment',
                patient_id: 281,
                provider_id: 6837
                });
            await createTreatmentPlan({
                plan: 'Depression Treatment',
                patient_id: 282,
                provider_id: 5679
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 283,
                provider_id: 6547
                });
            await createTreatmentPlan({
                plan: 'Gastroenteritis Treatment',
                patient_id: 284,
                provider_id: 5913
                });
            await createTreatmentPlan({
                plan: 'Arthritis Treatment',
                patient_id: 285,
                provider_id: 5537
                });
            await createTreatmentPlan({
                plan: "Crohn's Disease Treatment",
                patient_id: 286,
                provider_id: 5913
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 287,
                provider_id: 6547
                });
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 288,
                provider_id: 5723
                });
            await createTreatmentPlan({
                plan: 'Myocardial Infarction Treatment',
                patient_id: 289,
                provider_id: 2586
                });
            await createTreatmentPlan({
                plan: 'Fibromyalgia Treatment',
                patient_id: 290,
                provider_id: 5643
                });
            await createTreatmentPlan({
                plan: 'Sinusitis Treatment',
                patient_id: 291,
                provider_id: 5382
                });
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 292,
                provider_id: 5125
                });
            await createTreatmentPlan({
                plan: 'Chronic Fatigue Syndrome Treatment',
                patient_id: 293,
                provider_id: 5780
                });
            await createTreatmentPlan({
                plan: 'Fractured Leg Treatment',
                patient_id: 294,
                provider_id: 8023
                });
            await createTreatmentPlan({
                plan: 'Fibromyalgia Treatment',
                patient_id: 295,
                provider_id: 5198
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 296,
                provider_id: 5198
                });
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 297,
                provider_id: 5155
                });
            await createTreatmentPlan({
                plan: 'Stress Induced Ulcer Treatment',
                patient_id: 298,
                provider_id: 5913
                });
            await createTreatmentPlan({
                plan: 'Anxiety Disorder Treatment',
                patient_id: 299,
                provider_id: 5679
                });
            await createTreatmentPlan({
                plan: 'Bacterial Pneumonia Treatment',
                patient_id: 300,
                provider_id: 4678
                });
            await createTreatmentPlan({
                plan: 'Rheumatoid Arthritis Treatment',
                patient_id: 301,
                provider_id: 5456
                });
            await createTreatmentPlan({
                plan: 'Bursitis Treatment',
                patient_id: 302,
                provider_id: 8961
                });
            await createTreatmentPlan({
                plan: 'Broken Arm Treatment',
                patient_id: 303,
                provider_id: 8961
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 304,
                provider_id: 6547
                });
            await createTreatmentPlan({
                plan: 'Back Injury Treatment',
                patient_id: 305,
                provider_id: 8961
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 306,
                provider_id: 6547
                });
            await createTreatmentPlan({
                plan: 'Irritable Bowel Syndrome Treatment',
                patient_id: 307,
                provider_id: 5913
                });
            await createTreatmentPlan({
                plan: 'Stress Induced Insomnia Treatment',
                patient_id: 308,
                provider_id: 5679
                });
            await createTreatmentPlan({
                plan: 'Fractured Arm Treatment',
                patient_id: 309,
                provider_id: 8961
                });
            await createTreatmentPlan({
                plan: 'Stomach Ulcer Treatment',
                patient_id: 310,
                provider_id: 5913
                });
            await createTreatmentPlan({
                plan: 'Stomach Ulcer Treatment',
                patient_id: 311,
                provider_id: 5913
                });
            await createTreatmentPlan({
                plan: 'Pneumonia Treatment',
                patient_id: 312,
                provider_id: 5643
                });
            await createTreatmentPlan({
                plan: 'Pneumonia Treatment',
                patient_id: 313,
                provider_id: 5643
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 314,
                provider_id: 5643
                });
            await createTreatmentPlan({
                plan: 'Pneumonia Treatment',
                patient_id: 315,
                provider_id: 5155
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 316,
                provider_id: 5643
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 317,
                provider_id: 5104
                });
            await createTreatmentPlan({
                plan: 'Chronic Bronchitis Treatment',
                patient_id: 318,
                provider_id: 5643
                });
            await createTreatmentPlan({
                plan: 'Lung Cancer Treatment',
                patient_id: 319,
                provider_id: 7589
                });
            await createTreatmentPlan({
                plan: 'Asthma Treatment',
                patient_id: 320,
                provider_id: 5104
                });
            await createTreatmentPlan({
                plan: 'Allergic Rhinitis Treatment',
                patient_id: 321,
                provider_id: '5456'
                });
            await createTreatmentPlan({
                plan: 'Bacterial Pneumonia Treatment',
                patient_id: 322,
                provider_id: 5537
                });
            await createTreatmentPlan({
                plan: 'Diabetes Mellitus Treatment',
                patient_id: 323,
                provider_id: 5456
                });
            await createTreatmentPlan({
                plan: 'Cardiac Arrest Treatment',
                patient_id: 324,
                provider_id: 2586
                });
            await createTreatmentPlan({
                plan: 'Lung Cancer Treatment',
                patient_id: 325,
                provider_id: 7032
                });
            await createTreatmentPlan({
                plan: 'Lung Cancer Treatment',
                patient_id: 326,
                provider_id: 7032
                });
            await createTreatmentPlan({
                plan: 'Stroke Treatment',
                patient_id: 327,
                provider_id: 6837
                });
            await createTreatmentPlan({
                plan: 'Breast Cancer Treatment',
                patient_id: 328,
                provider_id: 7012
                });
            await createTreatmentPlan({
                plan: 'Pulmonary Embolism Treatment',
                patient_id: 329,
                provider_id: 5643
                });
            await createTreatmentPlan({
                plan: 'Acute Bronchitis Treatment',
                patient_id: 330,
                provider_id: 5143
                });
            await createTreatmentPlan({
                plan: 'Chronic Kidney Disease Treatment',
                patient_id: 331,
                provider_id: 5198
                });
            await createTreatmentPlan({
                plan: 'Anxiety Disorder Treatment',
                patient_id: 332,
                provider_id: 5679
                });
            await createTreatmentPlan({
                plan: 'Lung Cancer Treatment',
                patient_id: 333,
                provider_id: 7589
                });
            await createTreatmentPlan({
                plan: 'Lung Cancer Treatment',
                patient_id: 334,
                provider_id: 7589
                });
            await createTreatmentPlan({
                plan: 'High Blood Pressure Treatment',
                patient_id: 335,
                provider_id: 5201
                });
            await createTreatmentPlan({
                plan: 'Rheumatoid Arthritis Treatment',
                patient_id: 336,
                provider_id: 5201
                });
            await createTreatmentPlan({
                plan: 'Chronic Obstructive Pulmonary Disease (COPD) Treatment',
                patient_id: 337,
                provider_id: 5201
                });
            await createTreatmentPlan({
                plan: 'Migraine Treatment',
                patient_id: 338,
                provider_id: 5780
                });
            await createTreatmentPlan({
                plan: 'Type 2 Diabetes Management',
                patient_id: 339,
                provider_id: 5589
                });
            await createTreatmentPlan({
                plan: 'Migraine Headache Treatment',
                patient_id: 340,
                provider_id: 5723
                });
            await createTreatmentPlan({
                plan: 'Heart Attack Treatment',
                patient_id: 541,
                provider_id: 2655
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
                diagnosis: 'Acute Bronchitis',
                symptoms: 'cough, chest tightness, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 2,
                name: 'Emily Johnson',
                diagnosis: 'Diabetes Type 2',
                symptoms: 'frequent urination, excessive thirst',
                status: 'alive'
            });
            await createMedicalRecord({
                patient_id: 3,
                name: 'Olive Brown',
                diagnosis: 'Stroke',
                symptoms: 'weakness on one side of the body, difficulty speaking, headache',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 4,
                name: 'William Davis',
                diagnosis: 'Acute Bronchitis',
                symptoms: 'cough, wheezing, chest tightness, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 5,
                name: 'Isabella Wilson',
                diagnosis: 'Multiple Sclerosis',
                symptoms: 'fatigue, muscle weakness, difficulty with coordination and balance',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 6,
                name: 'Alexander Smith',
                diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
                symptoms: 'coughing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 7,
                name: 'Ava Jones',
                diagnosis: 'Stroke',
                symptoms: 'numbness, confusion, headache',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 8,
                name: 'Ethan Green',
                diagnosis: 'Gastroesophageal Reflux Disease (GERD)',
                symptoms: 'heartburn, nausea, chest pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 9,
                name: 'Sophia Lee',
                diagnosis: 'Acute Bronchitis',
                symptoms: 'cough, shortness of breath, chest pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 10,
                name: 'Mason Young',
                diagnosis: 'Arthritis',
                symptoms: 'Joint Pain',
                status: 'Alive'
                });
            await createMedicalRecord({
                patient_id: 11,
                name: 'Noah Brown',
                diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
                symptoms: 'cough, wheezing, shortness of breath',
                status: 'alive'
            });
            await createMedicalRecord({
                patient_id: 12,
                name: 'Liam Miller',
                diagnosis: 'Rheumatoid Arthritis',
                symptoms: 'joint pain, swelling, fatigue',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 13,
                name: 'Emma Davis',
                diagnosis: 'Diabetes Mellitus Type 1',
                symptoms: 'increased thirst, frequent urination, weight loss, fatigue',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 14,
                name: 'Avery Anderson',
                diagnosis: 'Chronic Myeloid Leukemia',
                symptoms: 'fatigue, weight loss, night sweats',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 15,
                name: 'Evelyn Taylor',
                diagnosis: 'Chronic Fatigue Syndrome',
                symptoms: 'persistent fatigue, headaches, muscle pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 16,
                name: 'Abigail Johnson',
                diagnosis: 'Acute Bronchitis',
                symptoms: 'Coughing, Chest pain, Shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 17,
                name: 'Isabelle Wilson',
                diagnosis: 'Irritable Bowel Syndrome (IBS)',
                symptoms: 'Abdominal pain, bloating, and changes in bowel movements',
                status: 'alive'
                });            
            await createMedicalRecord({
                patient_id: 18,
                name: 'Mila Moore',
                diagnosis: 'Osteoarthritis',
                symptoms: 'joint pain, stiffness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 19,
                name: 'Aurora Anderson',
                diagnosis: 'Stroke',
                symptoms: 'Difficulty speaking, weakness on one side of the body, headache',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 20,
                name: 'Eleanor Thomas',
                diagnosis: 'Chronic Kidney Disease',
                symptoms: 'fatigue, decreased appetite, nausea, frequent urination',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 21,
                name: 'Aria Moore',
                diagnosis: 'Gastroesophageal Reflux Disease',
                symptoms: 'Heartburn, Regurgitation, Chest pain',
                status: 'Alive'
                });
            await createMedicalRecord({
                patient_id: 22,
                name: 'Scarlett Wilson',
                diagnosis: 'Chronic Migraines',
                symptoms: 'frequent headaches, sensitivity to light and sound',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 23,
                name: 'Natalie Johnson',
                diagnosis: 'Chronic Migraine',
                symptoms: 'headache, sensitivity to light and sound',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 24,
                name: 'Charlotte Williams',
                diagnosis: 'Acute Gastroenteritis',
                symptoms: 'nausea, vomiting, diarrhea',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 25,
                name: 'Aurora Smith',
                diagnosis: 'Chronic Sinusitis',
                symptoms: 'facial pain, headache, nasal congestion, runny nose',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 26,
                name: 'Evelyn Brown',
                diagnosis: 'Acute Bronchitis',
                symptoms: 'cough, chest pain, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 27,
                name: 'Isabelle Davis',
                diagnosis: 'Type 2 Diabetes',
                symptoms: 'Increased thirst and hunger, frequent urination',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 28,
                name: 'Aria Miller',
                diagnosis: 'Anxiety Disorder',
                symptoms: 'Panic attacks, restlessness, and excessive worry',
                status: 'Alive'
                });
            await createMedicalRecord({
                patient_id: 29,
                name: 'Natalie Wilson',
                diagnosis: 'Chronic Fatigue Syndrome',
                symptoms: 'fatigue, pain, headaches, depression',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 30,
                name: 'Eleanor Anderson',
                diagnosis: "Meniere's Disease",
                symptoms: 'Vertigo, Tinnitus, Hearing Loss, Nausea',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 31,
                name: 'Avery Thomas',
                diagnosis: 'Depression',
                symptoms: 'Loss of Interest, Fatigue, Insomnia',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 32,
                name: 'Scarlet Johnson',
                diagnosis: 'Stroke',
                symptoms: 'numbness, confusion, headache',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 33,
                name: 'Evelyn Davis',
                diagnosis: 'Stroke',
                symptoms: 'weakness, numbness, difficulty speaking, headache',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 34,
                name: 'Isabelle Anderson',
                diagnosis: 'Diabetes Mellitus',
                symptoms: 'Frequent Urination, Increased Thirst, Hunger, Fatigue, Slow Healing Sores',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 35,
                name: 'Aurora Wilson',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'coughing, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 36,
                name: 'Natalie Johnson',
                diagnosis: 'Chronic Migraine',
                symptoms: 'frequent headaches, sensitivity to light and sound',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 37,
                name: 'Aria Thomas',
                diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
                symptoms: 'coughing, wheezing, chest tightness, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 38,
                name: 'Scarlett Davis',
                diagnosis: 'Type 2 Diabetes',
                symptoms: 'Frequent urination, increased thirst, blurred vision, slow healing sores',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 39,
                name: 'Evelyn Anderson',
                diagnosis: 'Chronic Fatigue Syndrome',
                symptoms: 'tiredness, muscle weakness, joint pain, headaches, and unrefreshing sleep',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 40,
                name: 'Isabelle Wilson',
                diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
                symptoms: 'coughing, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 41,
                name: 'Avery Johnson',
                diagnosis: 'Upper Respiratory Infection',
                symptoms: 'Sore throat, cough, runny nose',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 42,
                name: 'Natalie Thomas',
                diagnosis: 'Migraine Headaches',
                symptoms: 'headaches, nausea, sensitivity to light and sound',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 43,
                name: 'Aurora Davis',
                diagnosis: 'Type 2 Diabetes',
                symptoms: 'excessive thirst, frequent urination, weight loss, fatigue',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 44,
                name: 'Olivia Brown',
                diagnosis: 'Chronic Migraine',
                symptoms: 'Severe Headache, Nausea, Light Sensitivity',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 45,
                name: 'Mia Miller',
                diagnosis: 'Depression',
                symptoms: 'Sadness, loss of interest, difficulty sleeping',
                status: 'Alive'
                });
            await createMedicalRecord({
                patient_id: 46,
                name: 'Ethan Johnson',
                diagnosis: 'Chronic Obstructive Pulmonary Disease',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 47,
                name: 'Liam Wilson',
                diagnosis: 'Chronic Migraines',
                symptoms: 'frequent headaches, nausea, sensitivity to light',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 48,
                name: 'Emma Young',
                diagnosis: 'Anxiety Disorder',
                symptoms: 'Insomnia, Nervousness, Irritability',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 49,
                name: 'Oliver Martin',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'coughing, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 50,
                name: 'Ava Anderson',
                diagnosis: 'Osteoarthritis',
                symptoms: 'Joint pain and stiffness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 51,
                name: 'Jackson Thomas',
                diagnosis: 'Acute Bronchitis',
                symptoms: 'Cough, Chest Pain, Shortness of Breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 52,
                name: 'Logan Hill',
                diagnosis: 'Chronic Sinusitis',
                symptoms: 'headache, facial pain, nasal congestions',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 53,
                name: 'Mila Clark',
                diagnosis: 'Carpal Tunnel Syndrome',
                symptoms: 'wrist pain and numbness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 54,
                name: 'Evelyn Mitchell',
                diagnosis: 'COPD',
                symptoms: 'Shortness of breath, wheezing, cough',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 55,
                name: 'Liam Simpson',
                diagnosis: 'Viral Meningitis',
                symptoms: 'headache, neck pain, fever, nausea, vomiting',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 56,
                name: 'Emma Perez',
                diagnosis: 'Stress-Induced Headaches',
                symptoms: 'Headaches, Tension, Fatigue',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 57,
                name: 'Oliver Green',
                diagnosis: 'Acute Bronchitis',
                symptoms: 'cough, shortness of breath, chest pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 58,
                name: 'Avery Young',
                diagnosis: 'Type 2 Diabetes',
                symptoms: 'increased thirst, frequent urination, fatigue',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 59,
                name: 'mia smith',
                diagnosis: 'Gastroesophageal Reflux Disease (GERD)',
                symptoms: 'heartburn, regurgitation, chest pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 60,
                name: 'Avery Johnson',
                diagnosis: 'Asthma',
                symptoms: 'wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 61,
                name: 'Natalie Davis',
                diagnosis: 'Chronic Obstructive Pulmonary Disease',
                symptoms: 'Shortness of breath, wheezing, coughing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 62,
                name: 'Isabelle Johnson',
                diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
                symptoms: 'coughing, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 63,
                name: 'Olivia Smith',
                diagnosis: 'Anxiety Disorder',
                symptoms: 'Persistent worry and fear',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 64,
                name: 'mia johnson',
                diagnosis: 'Bronchitis',
                symptoms: 'cough, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 65,
                name: 'Emma Brown',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'persistent cough, shortness of breath, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 66,
                name: 'Liam Johnson',
                diagnosis: 'Acute Otitis Media',
                symptoms: 'ear pain, ear drainage, hearing loss',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 67,
                name: 'Ava Johnson',
                diagnosis: 'Acute Otitis Media',
                symptoms: 'ear pain, ear drainage, hearing loss',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 68,
                name: 'William Brown',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'persistent coughing, shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 69,
                name: 'Ethan Kim',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, coughing, wheezing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 70,
                name: 'Emily Garcia',
                diagnosis: 'Fibromyalgia',
                symptoms: 'Chronic Muscle Pain, Fatigue',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 71,
                name: 'Isabella Rodriguez',
                diagnosis: 'Gastritis',
                symptoms: 'Abdominal pain, nausea, vomiting, loss of appetite',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 72,
                name: 'Michael Martinez',
                diagnosis: 'Diabetic Neuropathy',
                symptoms: 'numbness, tingling, weakness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 73,
                name: 'Aria Hernandez',
                diagnosis: 'Chronic Pain',
                symptoms: 'Chronic pain and discomfort in different parts of the body',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 74,
                name: 'Liam Young',
                diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
                symptoms: 'coughing, shortness of breath, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 75,
                name: 'Olivia Lewis',
                diagnosis: 'Anxiety Disorder',
                symptoms: 'Panic Attacks, Nervousness, Insomnia',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 76,
                name: 'William Brown',
                diagnosis: 'Type 2 Diabetes',
                symptoms: 'excessive thirst, frequent urination, fatigue',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 77,
                name: 'Emma Green',
                diagnosis: 'Gastroesophageal Reflux Disease (GERD)',
                symptoms: 'heartburn, chest pain, difficulty swallowing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 78,
                name: 'Noah Adams',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'Coughing, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 79,
                name: 'Aaliyah Singh',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'persistent cough, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 80,
                name: 'Ethan Kim',
                diagnosis: 'Pneumonia',
                symptoms: 'cough, fever, chest pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 81,
                name: 'Ava Gonzalez',
                diagnosis: 'Acute Bronchitis',
                symptoms: 'cough, chest pain, wheezing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 82,
                name: 'Liam Rodriguez',
                diagnosis: 'Stroke',
                symptoms: 'numbness, confusion, loss of coordination',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 83,
                name: 'Isabella Martinez',
                diagnosis: 'Migraine Headaches',
                symptoms: 'Severe headaches, nausea, light sensitivity',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 84,
                name: 'Emma Lee',
                diagnosis: 'Anxiety Disorder',
                symptoms: 'nervousness, worry, fear',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 85,
                name: 'Oliver Brown',
                diagnosis: 'Pneumonia',
                symptoms: 'cough, chest pain, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 86,
                name: 'Sophia Davis',
                diagnosis: 'Pulmonary Embolism',
                symptoms: 'shortness of breath, chest pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 87,
                name: 'Isabella Gonzalez',
                diagnosis: 'Chronic Migraines',
                symptoms: 'Frequent headaches, sensitivity to light and sound',
                status: 'Alive'
                });
            await createMedicalRecord({
                patient_id: 88,
                name: 'Parker Kim',
                diagnosis: 'Anxiety Disorder',
                symptoms: 'difficulty concentrating, fatigue, restlessness, irritability',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 89,
                name: 'Natalie Singh',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'Persistent coughing, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 90,
                name: 'Jasmine Rodriguez',
                diagnosis: 'Chronic Fatigue Syndrome',
                symptoms: 'fatigue, muscle weakness, joint pain, headaches',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 91,
                name: 'Ethan Brown',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'coughing, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 92,
                name: 'Avery Johnson',
                diagnosis: 'Acute Bronchitis',
                symptoms: 'Coughing, chest pain, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 93,
                name: 'Natalie Williams',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'Persistent cough, chest pain, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 94,
                name: 'Olivia Davis',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 95,
                name: 'Isabella Brown',
                diagnosis: 'Broken Arm',
                symptoms: 'pain and swelling in arm, difficulty moving arm',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 96,
                name: 'Mia Johnson',
                diagnosis: 'Gunshot Wound',
                symptoms: 'severe pain and bleeding at the wound site',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 97,
                name: 'Ava Miller',
                diagnosis: 'Concussion',
                symptoms: 'headache, dizziness, confusion',
                status: 'alive'
            });
            await createMedicalRecord({
                patient_id: 98,
                name: 'Liam Davis',
                diagnosis: 'Broken Arm',
                symptoms: 'Pain and swelling in the arm, difficulty moving the arm',
                status: 'Alive'
                });
            await createMedicalRecord({
                patient_id: 99,
                name: 'Emily Brown',
                diagnosis: 'Fractured Arm',
                symptoms: 'Pain and Swelling in Arm',
                status: 'Alive'
                });
            await createMedicalRecord({
                patient_id: 100,
                name: 'Isabella Gonzalez',
                diagnosis: 'Chest pain',
                symptoms: 'chest pain, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 101,
                name: 'William Perez',
                diagnosis: 'Broken Arm',
                symptoms: 'pain and swelling in arm',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 102,
                name: 'Ava Gonzalez',
                diagnosis: 'Fractured Arm',
                symptoms: 'Severe Pain, Swelling, Bruising',
                status: 'Alive'
                });
            await createMedicalRecord({
                patient_id: 103,
                name: 'Michael Kim',
                diagnosis: 'Injury from Motor Vehicle Accident',
                symptoms: 'Broken bones, internal bleeding, head injury',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 104,
                name: 'Emma Hernandez',
                diagnosis: 'Fractured Arm',
                symptoms: 'pain in the arm, swelling, and difficulty moving the arm',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 105,
                name: 'Olivia Parker',
                diagnosis: 'Chest Pain',
                symptoms: 'Chest pain, shortness of breath, fatigue, lightheadedness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 106,
                name: 'Aiden Kim',
                diagnosis: 'Chest Pain',
                symptoms: 'Chest discomfort, shortness of breath, heavy sweating',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 107,
                name: 'Evelyn Gonzalez',
                diagnosis: 'Broken Arm',
                symptoms: 'pain and swelling in arm',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 108,
                name: 'Marcus Kim',
                diagnosis: 'Chronic Kidney Disease',
                symptoms: 'fatigue, frequent urination, swelling in legs and ankles',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 109,
                name: 'Nia Ramirez',
                diagnosis: 'Chronic Kidney Disease',
                symptoms: 'nausea, fatigue, decreased appetite, increased thirst',
                status: 'alive'
                });     
            await createMedicalRecord({
                patient_id: 110,
                name: 'Miguel Garcia',
                diagnosis: 'Chronic Kidney Disease',
                symptoms: 'fatigue, swelling, difficulty breathing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 111,
                name: 'Fatima Mohammed',
                diagnosis: 'Chronic Kidney Disease',
                symptoms: 'fatigue, swelling in the legs, feet, and ankles, dry and itchy skin, decreased urine output, and changes in urine appearance',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 112,
                name: 'Leah Parker',
                diagnosis: 'Chronic Kidney Disease',
                symptoms: 'fatigue, decreased urine output, swelling',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 113,
                name: 'Jasmine Kim',
                diagnosis: 'Chronic Kidney Disease',
                symptoms: 'Fatigue, Nausea, Swelling of the legs, ankles, and feet, Reduced urine output, itchy skin',
                status: 'Alive'
                });
            await createMedicalRecord({
                patient_id: 114,
                name: 'David Gonzalez',
                diagnosis: 'Chronic Migraines',
                symptoms: 'Severe headaches, nausea',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 115,
                name: 'Maria Rodriguez',
                diagnosis: 'Migraine Headaches',
                symptoms: 'Chronic headaches, nausea, light sensitivity',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 116,
                name: 'William Johnson',
                diagnosis: 'Migraine Headache',
                symptoms: 'Frequent headache, nausea, and sensitivity to light and sound',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 117,
                name: 'Sophia Rodriguez',
                diagnosis: 'Migraine Headache',
                symptoms: 'recurrent headache, sensitivity to light and sound',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 118,
                name: 'Nina Liu',
                diagnosis: 'Neurological Disorder',
                symptoms: 'Seizures, migraines, numbness in limbs',
                status: 'Alive'
                });
            await createMedicalRecord({
                patient_id: 119,
                name: 'Monica Rodriguez',
                diagnosis: 'Epileptic Seizure Disorder',
                symptoms: 'frequent seizures, sudden loss of consciousness, muscle spasms',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 120,
                name: 'Martha Santos',
                diagnosis: 'Cerebral Palsy',
                symptoms: 'Difficulty walking, tremors, muscle stiffness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 121,
                name: 'Rashida Henderson',
                diagnosis: 'Chronic Migraine',
                symptoms: 'frequent headache, nausea, sensitivity to light and sound',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 122,
                name: 'Emma Johnson',
                diagnosis: 'Migraine Headache',
                symptoms: 'severe headache, nausea, sensitivity to light and sound',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 123,
                name: 'Jacqueline Mendoza',
                diagnosis: 'Chronic Migraines',
                symptoms: 'recurrent headaches, sensitivity to light and sound',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 124,
                name: 'Marcie Zheng',
                diagnosis: 'Migraine Headaches',
                symptoms: 'Severe headaches, nausea, sensitivity to light and sound',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 125,
                name: 'Ken Garcia',
                diagnosis: 'Stroke',
                symptoms: 'weakness in limbs, slurred speech, confusion',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 126,
                name: 'Evelyn Rojas',
                diagnosis: 'Stroke',
                symptoms: 'weakness on one side of the body, confusion, trouble speaking or understanding speech',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 127,
                name: 'Sophia Lee',
                diagnosis: 'Ophthalmic Issues',
                symptoms: 'blurred vision, eye pain, double vision',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 128,
                name: 'Tyrie Gonzalez',
                diagnosis: 'Ophthalmic Issues',
                symptoms: 'blurred vision, eye pain, double vision',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 129,
                name: 'Caroline Perez',
                diagnosis: 'Acute Myocardial Infarction (AMI)',
                symptoms: 'Chest Pain, Shortness of Breath, Nausea, Sweating',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 130,
                name: 'Karen Hernandez',
                diagnosis: 'Myocardial Infarction',
                symptoms: 'Chest Pain, Shortness of Breath, Fatigue',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 131,
                name: 'Erick Garcia',
                diagnosis: 'Acute Coronary Syndrome',
                symptoms: 'Chest pain, shortness of breath, and rapid or irregular heartbeats',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 132,
                name: 'Marcella Zheng',
                diagnosis: 'Cardiac Arrhythmia',
                symptoms: 'chest pain, irregular heart beat, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 133,
                name: 'John Doe',
                diagnosis: 'Myocardial Infarction',
                symptoms: 'Chest pain, shortness of breath, fatigue',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 134,
                name: 'Jane Smith',
                diagnosis: 'Chronic Dermatitis',
                symptoms: 'Rashes, itching and redness of skin',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 135,
                name: 'Joan Robinson',
                diagnosis: 'Eczema',
                symptoms: 'red and itchy skin, blistering and cracking',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 136,
                name: 'Jacqueline Perez',
                diagnosis: 'Skin Rash',
                symptoms: 'Itchy red skin',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 137,
                name: 'Curtis Elliott',
                diagnosis: 'Eczema',
                symptoms: 'Itching, Redness, Dry skin',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 138,
                name: 'Mariah Garcia',
                diagnosis: 'Eczema',
                symptoms: 'itchy red rash, dry skin',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 139,
                name: 'Lori Robinson',
                diagnosis: 'Gaucher Disease',
                symptoms: 'enlargement of the liver and spleen, anemia, low platelet count, and bone fractures',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 140,
                name: 'Evelyn Santiago',
                diagnosis: 'Mitochondrial disease',
                symptoms: 'fatigue, muscle weakness, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 141,
                name: 'Tiffany Gonzalez',
                diagnosis: 'Chronic Inflammatory Demyelinating Polyneuropathy (CIDP)',
                symptoms: 'muscle weakness, numbness, and tingling',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 142,
                name: 'Michael Chang',
                diagnosis: 'Rare Autoimmune Disorder',
                symptoms: 'Joint Pain, Fatigue, Rashes',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 143,
                name: 'Evelyn Johnson',
                diagnosis: 'Xeroderma Pigmentosum',
                symptoms: 'Extreme sensitivity to UV light, premature aging of the skin, skin cancer',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 144,
                name: 'Emily Lee',
                diagnosis: 'Amyotrophic Lateral Sclerosis',
                symptoms: 'Weakness, muscle atrophy, difficulty speaking and swallowing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 145,
                name: 'Jasmine Nguyen',
                diagnosis: 'Ehlers-Danlos Syndrome',
                symptoms: 'joint pain, hypermobility, skin fragility',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 146,
                name: 'Sofia Garcia',
                diagnosis: 'Niemann-Pick Disease',
                symptoms: 'difficulty swallowing, progressive loss of muscle tone, enlarged spleen and liver',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 147,
                name: 'Oscar Rivera',
                diagnosis: 'Chronic Inflammatory Demyelinating Polyneuropathy (CIDP)',
                symptoms: 'numbness, weakness, and tingling in the arms and legs',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 148,
                name: 'Mikayla Zamora',
                diagnosis: 'Autoimmune Disorder',
                symptoms: 'fatigue, joint pain, rashes',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 149,
                name: 'Ricardo Martinez',
                diagnosis: 'Primary Aldosteronism',
                symptoms: 'Headaches, fatigue, muscle weakness, high blood pressure',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 150,
                name: 'Kaitlyn Bryant',
                diagnosis: 'Autoimmune Hemolytic Anemia',
                symptoms: 'fatigue, jaundice, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 151,
                name: 'Mariona Zheng',
                diagnosis: 'Hereditary Hemorrhagic Telangiectasia',
                symptoms: 'Frequent nosebleeds, skin lesions',
                status: 'Alive'
                });
            await createMedicalRecord({
                patient_id: 152,
                name: 'Marcionia Zheng',
                diagnosis: 'Adrenoleukodystrophy',
                symptoms: 'Developmental delay, Weakness, Loss of vision',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 153,
                name: 'Marcella Zheng',
                diagnosis: 'Adrenoleukodystrophy',
                symptoms: 'Developmental delay, Weakness, Loss of vision',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 154,
                name: 'Lillie Leon',
                diagnosis: 'Acute Myocardial Infarction',
                symptoms: 'Chest pain, shortness of breath, nausea, lightheadedness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 155,
                name: 'Marvin Santos',
                diagnosis: 'Lupus',
                symptoms: 'fatigue, joint pain, skin rash',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 156,
                name: 'Lorene Santiago',
                diagnosis: 'Lupus',
                symptoms: 'fatigue, joint pain, skin rash',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 157,
                name: 'Nash Hodge',
                diagnosis: 'Lupus',
                symptoms: 'fatigue, joint pain, skin rash',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 158,
                name: 'Lila Diaz',
                diagnosis: 'Hypertension',
                symptoms: 'headaches, fatigue, chest pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 159,
                name: 'Mohammed Bryant',
                diagnosis: 'Hypertension',
                symptoms: 'headaches, fatigue, chest pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 160,
                name: 'Rita Wong',
                diagnosis: 'Acute Bronchitis',
                symptoms: 'cough, chest pain, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 161,
                name: 'Michael Johnson',
                diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
                symptoms: 'coughing, shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 162,
                name: 'Julia Smith',
                diagnosis: 'Irritable Bowel Syndrome (IBS)',
                symptoms: 'abdominal pain, bloating, constipation or diarrhea',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 163,
                name: 'Elizabeth Gonzalez',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 164,
                name: 'Omar Lee',
                diagnosis: 'Pneumonia',
                symptoms: 'cough, fever, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 165,
                name: 'Isabel Parker',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 166,
                name: 'Carlos Johnson',
                diagnosis: 'Influenza',
                symptoms: 'fever, fatigue, sore throat, runny nose, cough',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 167,
                name: 'Theresa Henderson',
                diagnosis: 'Rheumatoid Arthritis',
                symptoms: 'joint pain, swelling, fatigue, morning stiffness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 168,
                name: 'Nicholas Johnson',
                diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 169,
                name: 'Maria Gonzalez',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 170,
                name: 'William Rodriguez',
                diagnosis: 'Diabetes Mellitus',
                symptoms: 'increased thirst, frequent urination, fatigue, blurred vision',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 171,
                name: 'Nina Lopez',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'cough with mucus, shortness of breath, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 172,
                name: 'David Kim',
                diagnosis: 'Acute Bronchitis',
                symptoms: 'cough with phlegm, chest pain, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 173,
                name: 'Sophie Smith',
                diagnosis: 'Asthma',
                symptoms: 'wheezing, shortness of breath, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 174,
                name: 'John Brown',
                diagnosis: 'Appendicitis',
                symptoms: 'pain in the lower right side of the abdomen, loss of appetite, nausea, vomiting, and fever',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 175,
                name: 'Diego Henderson',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, coughing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 176,
                name: 'Ava Hernandez',
                diagnosis: 'COVID-19',
                symptoms: 'fever, cough, shortness of breath, loss of smell or taste',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 177,
                name: 'Ethan Young',
                diagnosis: 'Covid-19',
                symptoms: 'fever, fatigue, dry cough, loss of taste or smell',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 178,
                name: 'Sophia Garcia',
                diagnosis: 'COVID-19',
                symptoms: 'fever, cough, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 179,
                name: 'Mason Martinez',
                diagnosis: 'COVID-19',
                symptoms: 'fever, cough, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 180,
                name: 'Josue Liu',
                diagnosis: 'COVID-19',
                symptoms: 'fever, dry cough, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 181,
                name: 'Maggie Kim',
                diagnosis: 'COVID-19',
                symptoms: 'fever, cough, fatigue, loss of taste or smell',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 182,
                name: 'David Garcia',
                diagnosis: 'COVID-19',
                symptoms: 'fever, cough, difficulty breathing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 183,
                name: 'Sophia Martinez',
                diagnosis: 'COVID-19',
                symptoms: 'fever, cough, difficulty breathing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 184,
                name: 'Alexander Williams',
                diagnosis: 'COVID-19',
                symptoms: 'fever, dry cough, fatigue',
                status: 'alive'
                });    
            await createMedicalRecord({
                patient_id: 185,
                name: 'Maurice Chung',
                diagnosis: 'COVID-19',
                symptoms: 'fever, dry cough, fatigue',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 186,
                name: 'Evelyn Kim',
                diagnosis: 'COVID-19',
                symptoms: 'fever, cough, shortness of breath',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 187,
                name: 'Juan Gonzalez',
                diagnosis: 'COVID-19',
                symptoms: 'fever, cough, shortness of breath, body aches',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 188,
                name: 'Maria Garcia',
                diagnosis: 'COVID-19',
                symptoms: 'fever, cough, shortness of breath, loss of taste or smell',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 189,
                name: 'Ralph Foster',
                diagnosis: 'COVID-19',
                symptoms: 'Fever, cough, shortness of breath, loss of taste or smell',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 190,
                name: 'Eliza Johnson',
                diagnosis: 'COVID-19',
                symptoms: 'fever, cough, shortness of breath, body aches',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 191,
                name: 'Eduardo Santos',
                diagnosis: 'COVID-19',
                symptoms: 'fever, cough, fatigue, body aches',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 192,
                name: 'Ava Baker',
                diagnosis: 'COVID-19',
                symptoms: 'fever, cough, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 193,
                name: 'Lucas Torres',
                diagnosis: 'COVID-19',
                symptoms: 'fever, cough, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 194,
                name: 'Sophia Perez',
                diagnosis: 'COVID-19',
                symptoms: 'fever, cough, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 195,
                name: 'Juan Garcia',
                diagnosis: 'COVID-19',
                symptoms: 'fever, cough, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 196,
                name: 'Erik Rios',
                diagnosis: 'Asthma',
                symptoms: 'Shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 197,
                name: 'Mia Kim',
                diagnosis: 'Chronic Migraine',
                symptoms: 'frequent headache, sensitivity to light, nausea',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 198,
                name: 'Karen Wong',
                diagnosis: 'Asthma',
                symptoms: 'wheezing, shortness of breath, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 199,
                name: 'John Garcia',
                diagnosis: 'Diabetes',
                symptoms: 'frequent urination, excessive thirst, unexplained weight loss',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 200,
                name: 'Riley Jackson',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 201,
                name: 'Emma Lee',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 202,
                name: 'Ishmael Perez',
                diagnosis: 'Gout',
                symptoms: 'joint pain, swelling, redness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 203,
                name: 'Samantha Wang',
                diagnosis: 'Pneumonia',
                symptoms: 'cough, fever, chest pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 204,
                name: 'Nathan Gonzalez',
                diagnosis: 'Asthma',
                symptoms: 'wheezing, shortness of breath, coughing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 205,
                name: 'Evelyn Jones',
                diagnosis: 'Asthma',
                symptoms: 'wheezing, chest tightness, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 206,
                name: 'Sophia Smith',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 207,
                name: 'Jazmine Henderson',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 208,
                name: 'Brayden Chen',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
            });
            await createMedicalRecord({
                patient_id: 209,
                name: 'Ava Garcia',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 210,
                name: 'Ethan Kim',
                diagnosis: 'Gastroesophageal Reflux Disease (GERD)',
                symptoms: 'heartburn, nausea, regurgitation, chest pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 211,
                name: 'Isabella Lee',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, coughing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 212,
                name: 'Michael Smith',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 213,
                name: 'Ashley Johnson',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'coughing, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 214,
                name: 'William Brown',
                diagnosis: "Crohn's Disease",
                symptoms: 'abdominal pain, diarrhea, weight loss',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 215,
                name: 'Jennifer Davis',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'persistent coughing, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 216,
                name: 'John Miller',
                diagnosis: "Crohn's Disease",
                symptoms: 'Abdominal pain, diarrhea, weight loss',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 217,
                name: 'Elizabeth Wilson',
                diagnosis: 'Type 2 Diabetes',
                symptoms: 'increased thirst, frequent urination, blurred vision, slow wound healing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 218,
                name: 'Jasmine Garcia',
                diagnosis: 'Pulmonary Embolism',
                symptoms: 'shortness of breath, chest pain, rapid heart rate',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 219,
                name: 'Ethan Wang',
                diagnosis: 'Esophageal Cancer',
                symptoms: 'Difficulty swallowing, weight loss, chest pain',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 220,
                name: 'Emily Kim',
                diagnosis: 'Stroke',
                symptoms: 'numbness, headache, confusion',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 221,
                name: 'Nicholas Nguyen',
                diagnosis: 'Colorectal Cancer',
                symptoms: 'abdominal pain, fatigue, constipation, rectal bleeding',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 222,
                name: 'Ava Lee',
                diagnosis: 'Chronic Fatigue Syndrome',
                symptoms: 'persistent fatigue, muscle pain, headache, sleep disturbances',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 223,
                name: 'Ava Lee',
                diagnosis: 'Chronic Fatigue Syndrome',
                symptoms: 'persistent fatigue, muscle pain, headache, sleep disturbances',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 224,
                name: 'Avery Johnson',
                diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 225,
                name: 'Adam Williams',
                diagnosis: "Crohn's Disease",
                symptoms: 'diarrhea, abdominal pain, weight loss',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 226,
                name: 'Ava Jones',
                diagnosis: 'Meningitis',
                symptoms: 'headache, neck pain, sensitivity to light',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 227,
                name: 'Ashley Brown',
                diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
                symptoms: 'coughing, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 228,
                name: 'Austin Davis',
                diagnosis: 'Chronic Fatigue Syndrome',
                symptoms: 'fatigue, muscle weakness, headaches, joint pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 229,
                name: 'Aiden Miller',
                diagnosis: 'Fibromyalgia',
                symptoms: 'chronic muscle pain, fatigue, sleep disturbances',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 230,
                name: 'Brianna Brown',
                diagnosis: 'Multiple Sclerosis',
                symptoms: 'fatigue, muscle weakness, vision loss',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 231,
                name: 'Brittany Baker',
                diagnosis: 'Stroke',
                symptoms: 'weakness or numbness on one side of the face, arm, or leg, confusion, difficulty speaking or understanding, sudden severe headache',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 232,
                name: 'Benjamin Bailey',
                diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 233,
                name: 'Brandon Brooks',
                diagnosis: 'Diabetes Mellitus',
                symptoms: 'excessive thirst, frequent urination, blurred vision',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 234,
                name: 'Bryant Byrd',
                diagnosis: 'Multiple Sclerosis',
                symptoms: 'numbness, tingling, muscle weakness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 235,
                name: 'Bridgette Black',
                diagnosis: 'Type 2 Diabetes',
                symptoms: 'increased thirst, frequent urination, blurred vision',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 236,
                name: 'Caroline Chang',
                diagnosis: 'Rheumatoid Arthritis',
                symptoms: 'joint pain, swelling, fatigue',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 237,
                name: 'Curtis Collins',
                diagnosis: "Crohn's Disease",
                symptoms: 'abdominal pain, diarrhea, weight loss',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 238,
                name: 'Claire Carpenter',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 239,
                name: 'Caleb Campbell',
                diagnosis: "Crohn's disease",
                symptoms: 'abdominal pain, diarrhea, weight loss',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 240,
                name: 'Cindy Chen',
                diagnosis: 'Multiple Sclerosis',
                symptoms: 'numbness or tingling in the limbs, muscle weakness, problems with coordination and balance',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 241,
                name: 'Craig Carter',
                diagnosis: 'Diabetes',
                symptoms: 'excessive thirst, frequent urination, blurred vision',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 242,
                name: 'Damon Nguyen',
                diagnosis: 'Type 2 Diabetes',
                symptoms: 'excessive thirst, frequent urination, increased hunger, fatigue',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 243,
                name: 'Daniel Kim',
                diagnosis: 'Chronic Fatigue Syndrome',
                symptoms: 'persistent fatigue, muscle pain, joint pain, headache, memory loss',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 244,
                name: 'Daphne Ramirez',
                diagnosis: "Crohn's disease",
                symptoms: 'abdominal pain, diarrhea, weight loss',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 245,
                name: 'David Hernandez',
                diagnosis: "Crohn's Disease",
                symptoms: 'abdominal pain, diarrhea, weight loss',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 246,
                name: 'Debra Garcia',
                diagnosis: 'Fractured Arm',
                symptoms: 'pain and swelling in the arm, difficulty moving the arm',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 247,
                name: 'Derek Clark',
                diagnosis: 'Fractured Arm',
                symptoms: 'pain, swelling, difficulty in moving the arm',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 248,
                name: 'Derek Parker',
                diagnosis: 'Fractured Arm',
                symptoms: 'pain, swelling, difficulty using the arm',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 249,
                name: 'Daisy Johnson',
                diagnosis: 'Soft Tissue Injury',
                symptoms: 'pain, swelling, bruising',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 250,
                name: 'Daniel Brown',
                diagnosis: 'Traumatic Brain Injury',
                symptoms: 'headache, dizziness, memory loss, speech difficulties',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 251,
                name: 'Diana Davis',
                diagnosis: 'Fractured Arm',
                symptoms: 'pain, swelling, difficulty moving arm',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 252,
                name: 'David Johnson',
                diagnosis: 'Fractured Arm',
                symptoms: 'pain, swelling, limited movement in arm',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 253,
                name: 'Derek Smith',
                diagnosis: 'Bone Fracture',
                symptoms: 'pain, swelling, limited mobility',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 254,
                name: 'Eddie Johnson',
                diagnosis: 'Traumatic Brain Injury',
                symptoms: 'headache, confusion, memory loss, balance problems',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 255,
                name: 'Ella Wright',
                diagnosis: 'Sprained Ankle',
                symptoms: 'pain, swelling, limited mobility',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 256,
                name: 'Ethan Jones',
                diagnosis: 'Fractured Arm',
                symptoms: 'pain in the arm, swelling, difficulty moving the arm',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 257,
                name: 'Evelyn Smith',
                diagnosis: 'Stress Fracture',
                symptoms: 'pain and swelling in the affected limb, difficulty walking',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 258,
                name: 'Erick Brown',
                diagnosis: 'Broken Bone',
                symptoms: 'pain, swelling, difficulty moving affected limb',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 259,
                name: 'Eve Davis',
                diagnosis: 'Back injury',
                symptoms: 'Lower back pain, difficulty walking, numbness in legs',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 260,
                name: 'Felix Lopez',
                diagnosis: 'Broken Arm',
                symptoms: 'pain and swelling in the arm, difficulty moving the arm',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 261,
                name: 'Frances Mendoza',
                diagnosis: 'Fibromyalgia',
                symptoms: 'chronic muscle pain, fatigue, sleep disturbances',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 262,
                name: 'Fidel Garcia',
                diagnosis: 'Sprained Ankle',
                symptoms: 'pain, swelling, difficulty walking',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 263,
                name: 'Flora Rodriguez',
                diagnosis: 'Broken Arm',
                symptoms: 'Pain and swelling in the arm, difficulty moving the arm, deformity in the arm',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 264,
                name: 'Fernanda Martinez',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 265,
                name: 'Freddy Sanchez',
                diagnosis: 'Bone Fracture',
                symptoms: 'pain, swelling, difficulty moving affected limb',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 266,
                name: 'Gary Smith',
                diagnosis: 'Stroke',
                symptoms: 'weakness, numbness, confusion',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 267,
                name: 'Gloria Johnson',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, coughing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 268,
                name: 'Greg Brown',
                diagnosis: 'Stroke',
                symptoms: 'numbness on one side of body, difficulty speaking, headache',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 269,
                name: 'Gary Davis',
                diagnosis: 'Stroke',
                symptoms: 'weakness, paralysis, confusion',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 270,
                name: 'Grace Miller',
                diagnosis: 'Rheumatoid Arthritis',
                symptoms: 'joint pain and stiffness, fatigue, weight loss',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 271,
                name: 'Gordon Wilson',
                diagnosis: 'Asthma',
                symptoms: 'wheezing, shortness of breath, coughing',
                status: 'alive'
            });
            await createMedicalRecord({
                patient_id: 272,
                name: 'Harold Johnson',
                diagnosis: 'Chronic obstructive pulmonary disease (COPD)',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 273,
                name: 'Hazel Brown',
                diagnosis: "Crohn's Disease",
                symptoms: 'abdominal pain, diarrhea, weight loss',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 274,
                name: 'Harper Davis',
                diagnosis: 'Herniated Disc',
                symptoms: 'Back pain, leg weakness, numbness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 275,
                name: 'Harrison Miller',
                diagnosis: 'Meniscal Tear',
                symptoms: 'pain, swelling, difficulty walking',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 276,
                name: 'Haley Wilson',
                diagnosis: 'Anxiety Disorder',
                symptoms: 'nervousness, excessive fear, rapid heart rate',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 277,
                name: 'Hank Taylor',
                diagnosis: 'Acute Bronchitis',
                symptoms: 'cough, chest pain, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 278,
                name: 'Isla Wang',
                diagnosis: 'Chronic fatigue syndrome',
                symptoms: 'persistent fatigue, muscle pain, headaches',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 279,
                name: 'Ian Mendoza',
                diagnosis: 'Carpal Tunnel Syndrome',
                symptoms: 'pain and numbness in the wrist and hand',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 280,
                name: 'Iris Chen',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 281,
                name: 'Issac Khan',
                diagnosis: 'Migraine',
                symptoms: 'headache, sensitivity to light, nausea',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 282,
                name: 'Ivy Carr',
                diagnosis: 'Depression',
                symptoms: 'lack of energy, sadness, irritability, trouble sleeping',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 283,
                name: 'Ismael Gonzalez',
                diagnosis: 'Stroke',
                symptoms: 'weakness on one side of the body, trouble speaking, sudden headache',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 284,
                name: 'James Fernandez',
                diagnosis: 'Gastroenteritis',
                symptoms: 'Nausea, vomiting, diarrhea, abdominal pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 285,
                name: 'Julie Perez',
                diagnosis: 'Arthritis',
                symptoms: 'joint pain, stiffness, and swelling',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 286,
                name: 'John Kim',
                diagnosis: "Crohn's disease",
                symptoms: 'abdominal pain, diarrhea, weight loss',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 287,
                name: 'Jessica Park',
                diagnosis: 'Stroke',
                symptoms: 'weakness or numbness on one side of the body, trouble speaking or understanding, confusion, severe headache',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 288,
                name: 'Jim Lee',
                diagnosis: 'Acute Bronchitis',
                symptoms: 'cough, chest pain, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 289,
                name: 'Jackie Smith',
                diagnosis: 'Myocardial Infarction',
                symptoms: 'Chest pain, shortness of breath, nausea',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 290,
                name: 'Karen Davies',
                diagnosis: 'Fibromyalgia',
                symptoms: 'chronic pain, fatigue, sleep disturbance',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 291,
                name: 'Keith Webb',
                diagnosis: 'Sinusitis',
                symptoms: 'headache, nasal congestion, facial pressure',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 292,
                name: 'Kimberly Burke',
                diagnosis: 'Acute Bronchitis',
                symptoms: 'Coughing, chest pain, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 293,
                name: 'Kirsten Mills',
                diagnosis: 'Chronic Fatigue Syndrome',
                symptoms: 'persistent fatigue, muscle weakness, and difficulty sleeping',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 294,
                name: 'Kurt Henderson',
                diagnosis: 'Fractured Leg',
                symptoms: 'pain and swelling in leg, difficulty walking',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 295,
                name: 'Karen Baker',
                diagnosis: 'Fibromyalgia',
                symptoms: 'Chronic pain, fatigue, depression',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 296,
                name: 'Lana Kang',
                diagnosis: 'Asthma',
                symptoms: 'Shortness of breath, coughing, wheezing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 297,
                name: 'Liam Nguyen',
                diagnosis: 'Acute Bronchitis',
                symptoms: 'cough, chest pain, difficulty breathing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 298,
                name: 'Lucas Park',
                diagnosis: 'Stress-Induced Ulcer',
                symptoms: 'abdominal pain, heartburn, nausea',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 299,
                name: 'Leah Kim',
                diagnosis: 'Anxiety disorder',
                symptoms: 'nervousness, excessive worry, rapid heart rate',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 300,
                name: 'Lila Brown',
                diagnosis: 'Bacterial Pneumonia',
                symptoms: 'coughing, chest pain, fever, difficulty breathing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 301,
                name: 'Lionel Jones',
                diagnosis: 'Rheumatoid Arthritis',
                symptoms: 'joint pain, swelling, fatigue',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 302,
                name: 'Maddison Lewis',
                diagnosis: 'Bursitis',
                symptoms: 'Pain and swelling in the affected joint, limited range of motion',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 303,
                name: 'Maurice Henderson',
                diagnosis: 'Broken Arm',
                symptoms: 'pain, swelling, difficulty moving the arm',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 304,
                name: 'Makayla Rogers',
                diagnosis: 'Stroke',
                symptoms: 'weakness on one side, difficulty speaking, headache',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 305,
                name: 'Maurice Brown',
                diagnosis: 'Back injury',
                symptoms: 'pain and discomfort in lower back, difficulty standing or sitting for long periods, muscle spasms',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 306,
                name: 'Megan Johnson',
                diagnosis: 'Stroke',
                symptoms: 'weakness on one side of the body, difficulty speaking, sudden headache',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 307,
                name: 'Mia Smith',
                diagnosis: 'Irritable Bowel Syndrome',
                symptoms: 'abdominal pain, bloating, diarrhea, constipation',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 308,
                name: 'Nathan Martinez',
                diagnosis: 'Stress-Induced Insomnia',
                symptoms: 'Difficulty sleeping, fatigue, irritability',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 309,
                name: 'Nico Hernandez',
                diagnosis: 'Fractured arm',
                symptoms: 'pain and swelling in the arm, limited mobility',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 310,
                name: 'Nina Sanchez',
                diagnosis: 'Stomach Ulcer',
                symptoms: 'abdominal pain, nausea, loss of appetite',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 311,
                name: 'Nina Sanchez',
                diagnosis: 'Stomach Ulcer',
                symptoms: 'abdominal pain, nausea, loss of appetite',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 312,
                name: 'Nora Perez',
                diagnosis: 'Pneumonia',
                symptoms: 'cough, chest pain, shortness of breath, fever',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 313,
                name: 'Natalie Rivera',
                diagnosis: 'Pneumonia',
                symptoms: 'cough, chest pain, shortness of breath, fever',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 314,
                name: 'Olivia Nguyen',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'persistent cough, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 315,
                name: 'Owen Park',
                diagnosis: 'Pneumonia',
                symptoms: 'coughing, fever, difficulty breathing, chest pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 316,
                name: 'Olivier Kim',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'coughing, shortness of breath, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 317,
                name: 'Orlando Lee',
                diagnosis: 'Asthma',
                symptoms: 'wheezing, shortness of breath, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 318,
                name: 'Oscar Brown',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'persistent cough, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 319,
                name: 'Olivia Wilson',
                diagnosis: 'Lung Cancer',
                symptoms: 'coughing, chest pain, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 320,
                name: 'Pamie Parker',
                diagnosis: 'Asthma',
                symptoms: 'coughing, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 321,
                name: 'Paulie Patterson',
                diagnosis: 'Allergic Rhinitis',
                symptoms: 'runny or congested nose, sneezing, itching in the nose and eyes',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 322,
                name: 'Pettie Perez',
                diagnosis: 'Bacterial Pneumonia',
                symptoms: 'coughing, chest pain, difficulty breathing, fatigue, fever',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 323,
                name: 'Patria Phillips',
                diagnosis: 'Diabetes Mellitus',
                symptoms: 'excessive thirst, frequent urination, fatigue',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 324,
                name: 'Phil Pierce',
                diagnosis: 'Cardiac Arrest',
                symptoms: 'Chest pain, shortness of breath, loss of consciousness',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 325,
                name: 'Pamela Parker',
                diagnosis: 'Lung Cancer',
                symptoms: 'coughing up blood, shortness of breath, chest pain',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 326,
                name: 'Paul Patterson',
                diagnosis: 'Lung Cancer',
                symptoms: 'coughing, chest pain, shortness of breath',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 327,
                name: 'Peter Perez',
                diagnosis: 'Stroke',
                symptoms: 'sudden numbness or weakness in the face, arm, or leg, especially on one side of the body, confusion, trouble speaking or understanding speech',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 328,
                name: 'Patricia Phillips',
                diagnosis: 'Breast Cancer',
                symptoms: 'lump in the breast, discharge from the nipple, changes in the skin over the breast',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 329,
                name: 'Phillip Pierce',
                diagnosis: 'Pulmonary Embolism',
                symptoms: 'shortness of breath, chest pain, rapid heart rate',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 330,
                name: 'Quincy Young',
                diagnosis: 'Acute Bronchitis',
                symptoms: 'cough, chest pain, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 331,
                name: 'Quincy Green',
                diagnosis: 'Chronic Kidney Disease',
                symptoms: 'fatigue, decreased appetite, decreased urine output, swelling',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 332,
                name: 'Qian Park',
                diagnosis: 'Anxiety Disorder',
                symptoms: 'restlessness, excessive worry, difficulty concentrating',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 333,
                name: 'Quinn Simmons',
                diagnosis: 'Lung Cancer',
                symptoms: 'coughing up blood, chest pain, fatigue',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 334,
                name: 'Quinn Brown',
                diagnosis: 'Lung Cancer',
                symptoms: 'cough, chest pain, shortness of breath',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 335,
                name: 'Qian Williams',
                diagnosis: 'High Blood Pressure',
                symptoms: 'headaches, chest pain, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 336,
                name: 'Randy Nguyen',
                diagnosis: 'Rheumatoid Arthritis',
                symptoms: 'joint pain, swelling, fatigue, and tenderness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 337,
                name: 'Rosa Park',
                diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
                symptoms: 'coughing, wheezing, shortness of breath, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 338,
                name: 'Ryan Kim',
                diagnosis: 'Migraine',
                symptoms: 'headache, nausea, sensitivity to light and sound',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 339,
                name: 'Rachel Garcia',
                diagnosis: 'Type 2 Diabetes',
                symptoms: 'frequent urination, excessive thirst, fatigue',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 340,
                name: 'Rebecca Smith',
                diagnosis: 'Migraine Headache',
                symptoms: 'recurrent moderate to severe headache, nausea, sensitivity to light and sound',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 341,
                name: 'Robert Jones',
                diagnosis: 'Acute Myocardial Infarction (Heart Attack)',
                symptoms: 'Chest pain, shortness of breath, sweating, lightheadedness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 342,
                name: 'Shawn Garner',
                diagnosis: 'Migraine Headache',
                symptoms: 'recurrent headache, sensitivity to light and sound, nausea',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 343,
                name: 'Samantha Butler',
                diagnosis: 'Anxiety Disorder',
                symptoms: 'constant worry, irritability, difficulty sleeping',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 344,
                name: 'Sophie Chapman',
                diagnosis: 'Depression',
                symptoms: 'low mood, loss of interest in activities, changes in appetite and sleep patterns',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 345,
                name: 'Steven Edwards',
                diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
                symptoms: 'coughing, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 346,
                name: 'Sophia Gonzalez',
                diagnosis: 'Bacterial Pneumonia',
                symptoms: 'cough, chest pain, fever, difficulty breathing',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 347,
                name: 'Sebastian Harper',
                diagnosis: 'Chronic Obstructive Pulmonary Disease (COPD)',
                symptoms: 'cough, shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 348,
                name: 'Tara Ramirez',
                diagnosis: 'Chronic Migraine',
                symptoms: 'Frequent severe headaches, light sensitivity, nausea',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 349,
                name: 'Ursula Parker',
                diagnosis: 'Congestive Heart Failure',
                symptoms: 'shortness of breath, fatigue, chest pain',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 350,
                name: 'Uriah Fields',
                diagnosis: 'Stroke',
                symptoms: 'weakness or numbness of face, arm, or leg, confusion, trouble speaking or seeing',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 351,
                name: 'Uma Rodriguez',
                diagnosis: 'Breast Cancer',
                symptoms: 'Breast lump, discharge from the nipple, changes in the skin over the breast',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 352,
                name: 'Uriel Brown',
                diagnosis: 'Lung Cancer',
                symptoms: 'shortness of breath, persistent cough, chest pain',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 353,
                name: 'Ursa Garcia',
                diagnosis: 'Lung Cancer',
                symptoms: 'coughing up blood, chest pain, shortness of breath',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 354,
                name: 'Ulrich Smith',
                diagnosis: 'Cardiac Arrest',
                symptoms: 'chest pain, shortness of breath, loss of consciousness',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 355,
                name: 'Violet Turner',
                diagnosis: 'Brain Tumor',
                symptoms: 'headaches, dizziness, seizures',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 356,
                name: 'Victoria Rivera',
                diagnosis: 'Asthma',
                symptoms: 'shortness of breath, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 357,
                name: 'Vivian Gonzalez',
                diagnosis: 'Eczema',
                symptoms: 'red, itchy, and scaly patches on the skin',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 358,
                name: 'Vernon Robinson',
                diagnosis: 'Chest Pain',
                symptoms: 'sharp pain in chest, difficulty breathing, rapid heartbeat',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 359,
                name: 'Violeta Lopez',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'cough, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 360,
                name: 'Virgil Parker',
                diagnosis: 'Heart Failure',
                symptoms: 'shortness of breath, fatigue, chest pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 361,
                name: 'Wendy Flynn',
                diagnosis: 'Arthritis',
                symptoms: 'joint pain, stiffness, swelling',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 362,
                name: 'Warren Kim',
                diagnosis: 'Broken Leg',
                symptoms: 'pain and swelling in the leg, difficulty walking',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 363,
                name: 'Wade Smith',
                diagnosis: 'Cardiac Arrest',
                symptoms: 'Chest pain, shortness of breath, heart palpitations',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 364,
                name: 'Willa Brown',
                diagnosis: 'Lung Cancer',
                symptoms: 'coughing, chest pain, shortness of breath',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 365,
                name: 'Wesley Johnson',
                diagnosis: 'Stroke',
                symptoms: 'sudden weakness or numbness on one side of the face or body, trouble speaking, sudden severe headache',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 366,
                name: 'Wyatt Davis',
                diagnosis: 'Lung Cancer',
                symptoms: 'coughing, chest pain, difficulty breathing',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 367,
                name: 'Xander Henderson',
                diagnosis: 'Pneumonia',
                symptoms: 'cough, fever, chest pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 368,
                name: 'Ximena Lopez',
                diagnosis: 'Lung Cancer',
                symptoms: 'coughing, chest pain, wheezing',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 369,
                name: 'Xander Garcia',
                diagnosis: 'Lung Cancer',
                symptoms: 'coughing, chest pain, shortness of breath',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 370,
                name: 'Xiomara Rodriguez',
                diagnosis: 'Chest Pain',
                symptoms: 'tightness or pressure in the chest, shortness of breath, sweating, dizziness, nausea',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 371,
                name: 'Xanthe Johnson',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'coughing, wheezing, chest tightness',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 372,
                name: 'Xander Davis',
                diagnosis: 'Migraine Headache',
                symptoms: 'throbbing headache, sensitivity to light, nausea',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 373,
                name: 'Yasmin Wang',
                diagnosis: "Meniere's disease",
                symptoms: 'dizziness, tinnitus, hearing loss, and a feeling of fullness in the ear',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 374,
                name: 'Yvette Garcia',
                diagnosis: 'Breast Cancer',
                symptoms: 'lump in the breast, change in breast shape or size, discharge from the nipple',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 375,
                name: 'Yolanda Parker',
                diagnosis: 'Breast Cancer',
                symptoms: 'breast lumps, discharge from the nipple, changes in the skin over the breast',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 376,
                name: 'Yuri Wong',
                diagnosis: 'Cardiovascular Disease',
                symptoms: 'chest pain, shortness of breath, fatigue',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 377,
                name: 'Yvonne Gonzalez',
                diagnosis: 'Breast Cancer',
                symptoms: 'lump or thickening in breast, changes in size or shape of breast, skin dimpling, nipple discharge or pain',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 378,
                name: 'Yvette Hernandez',
                diagnosis: 'Lung Cancer',
                symptoms: 'cough, chest pain, shortness of breath',
                status: 'deceased'
                });
            await createMedicalRecord({
                patient_id: 379,
                name: 'Zara Rodriguez',
                diagnosis: 'Infectious Mononucleosis',
                symptoms: 'fever, fatigue, sore throat, swollen lymph nodes',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 380,
                name: 'Zack Nguyen',
                diagnosis: 'Chronic Bronchitis',
                symptoms: 'persistent cough, wheezing, shortness of breath',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 381,
                name: 'Zoe Kim',
                diagnosis: 'Anxiety Disorder',
                symptoms: 'persistent worry, restlessness, trouble sleeping',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 382,
                name: 'Zion Garcia',
                diagnosis: 'Migraines',
                symptoms: 'frequent headache, nausea, sensitivity to light and sound',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 383,
                name: 'Zena Gonzalez',
                diagnosis: 'Migraine Headache',
                symptoms: 'recurring headache, nausea, light sensitivity',
                status: 'alive'
                });
            await createMedicalRecord({
                patient_id: 384,
                name: 'Zander Johnson',
                diagnosis: 'Stroke',
                symptoms: 'sudden headache, weakness in one side of the body, slurred speech',
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