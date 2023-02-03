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