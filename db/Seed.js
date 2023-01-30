// Step 1: Import Client & Exports
const { create } = require('domain');
const { client } = require('./index');

// Page Imports
const { createUsers, getAllUsers } = require('./Users');

    // Patient Imports


    // Staff Imports


    // Treatment Imports


// Step 2: Users Methods
    // Method: Drop Tables
    async function dropTables(){
        try {
            console.log("Dropping tables... ");
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
            console.log("Finished dropping tables.")
        } catch(error){
            console.log("Error dropping tables!")
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
            CREATE TABLE patient (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(25) NOT NULL,
                last_name VARCHAR(25) NOT NULL,
                date_of_birth DATE NOT NULL,
                gender VARCHAR(10) NOT NULL,
                address VARCHAR(100) NOT NULL,
                phone_number VARCHAR(15) NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                emergency_contact_name VARCHAR(50) NOT NULL,
                emergency_contact_phone VARCHAR(15) NOT NULL
            );
            CREATE TABLE staff (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                title VARCHAR(100) NOT NULL,
                specialty VARCHAR(100) NOT NULL,
                provider_id VARCHAR(100) UNIQUE NULL,
                email VARCHAR(50) NOT NULL,
                phone VARCHAR(20) NOT NULL
            );
            CREATE TABLE treatment_plan (
                id SERIAL PRIMARY KEY,
                plan TEXT NOT NULL,
                patient_id INTEGER REFERENCES patient(id),
                provider_id INTEGER REFERENCES staff(id),
                FOREIGN KEY (patient_id) REFERENCES patient(id),
                FOREIGN KEY (provider_id) REFERENCES staff(id)
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
                status VARCHAR(25) NOT NULL DEFAULT 'Alive',
                FOREIGN KEY (patient_id) REFERENCES patient(id)
            );
            CREATE TABLE medication (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                dosage_form VARCHAR(25) NOT NULL,
                route VARCHAR(100) NOT NULL,
                sig VARCHAR(500) NOT NULL,
                indication VARCHAR(500) NOT NULL,
                start_date DATE NOT NULL,
                length_of_therapy INTEGER NOT NULL,
                refills INTEGER NOT NULL,
                pharmacy VARCHAR(100) DEFAULT NULL,
                treatment_id INTEGER REFERENCES treatment_plan(id),
                provider_id INTEGER REFERENCES staff(id),
                FOREIGN KEY (treatment_id) REFERENCES treatment_plan(id),
                FOREIGN KEY (provider_id) REFERENCES staff(id)
            );
            CREATE TABLE procedure (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT NOT NULL,
                date_performed DATE NOT NULL,
                patient_id INTEGER REFERENCES patient(id),
                treatment_id INTEGER REFERENCES treatment_plan(id),
                staff_id INTEGER REFERENCES staff(id),
                FOREIGN KEY (patient_id) REFERENCES patient(id),
                FOREIGN KEY (treatment_id) REFERENCES treatment_plan(id),
                FOREIGN KEY (staff_id) REFERENCES staff(id)
            );
            CREATE TABLE procedure_staff (
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

    // Method: createInitialUsers
    async function createInitialUsers() {
        console.log("Starting to create users...")
        try {
            await createUsers({
                username: 'dalron',
                password: 'dalron',
                email: 'dalron@hiveback.com',
                is_active: true,
            });
            await createUsers({
                username: 'guest',
                password: 'guest',
                email: 'guest@hiveback.com',
            });
            console.log("Finished creating users.");
        } catch (error) {
            console.error("Error when creating users!");
            console.log(error);
        }
    };

    // Rebuild DB:
    async function rebuildDB() {
        try {
        client.connect();
        console.log("Running DB function...")
        await dropTables();
        await createTables();
        await createInitialUsers();
        } catch (error) {
        console.log("Error during rebuildDB!")
        console.log(error.detail);
        }
    }

    // Test DB:
    async function testDB() {
        try {
            console.log("Starting to test database...");

            // userTest
            console.log("Calling getAllUsers...")
            const users = await getAllUsers();
            console.log("User results: ", users)
        } catch (error) {
            console.log("Error during testDB!");
            console.log(error);
        }
    };

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end())