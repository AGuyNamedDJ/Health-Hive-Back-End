// Step 1: Import Client & Exports
const { create } = require('domain');
const { client } = require('./index');

// Page Imports


    // Patient Imports


    // Staff Imports


    // Treatment Imports


// Step 2: User Methods
    // Method: Drop Tables
    async function dropTables(){
        try {
            console.log("Dropping tables... ");
            await client.query(`
            DROP TABLE IF EXISTS user;
            DROP TABLE IF EXISTS patient;
            DROP TABLE IF EXISTS staff;
            DROP TABLE IF EXISTS treatment;
            `)

            console.log("Finished dropping tables.")
        } catch(error){
            console.log("Error dropping tables!")
            console.log(error.detail)
        }
    };


    // Method: Create Tables:
    // Method: createTables
    async function createTables() {
        try {
            console.log('Starting to build tables...');
            await client.query(`
            CREATE TABLE user(
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
                emergency_contact_phone VARCHAR(15) NOT NULL,
                "is_active" BOOLEAN DEFAULT true,
                FOREIGN KEY (id) REFERENCES user(id)
              );
              CREATE TABLE appointment(
                id SERIAL PRIMARY KEY,
                date TIMESTAMP NOT NULL,
                time TIME NOT NULL,
                location VARCHAR(100) NOT NULL,
                patient_id INTEGER REFERENCES patient(id),
                staff_id INTEGER REFERENCES staff(id) DEFAULT NULL,
                treatment_id INTEGER REFERENCES treatment(id) DEFAULT NULL
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
                treatment_id INTEGER REFERENCES treatment(id),
                provider_id INTEGER REFERENCES staff(id),
                FOREIGN KEY (treatment_id) REFERENCES treatment(id),
                FOREIGN KEY (provider_id) REFERENCES staff(id)
              );
              CREATE TABLE procedure (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT NOT NULL,
                date_performed DATE NOT NULL,
                patient_id INTEGER REFERENCES patient(id),
                treatment_id INTEGER REFERENCES treatment(id),
                staff_id INTEGER REFERENCES staff(id),
                FOREIGN KEY (patient_id) REFERENCES patient(id),
                FOREIGN KEY (treatment_id) REFERENCES treatment(id),
                FOREIGN KEY (staff_id) REFERENCES staff(id)
            );
            

              
            
              

            `);
            console.log('Finished building tables.');
            } catch (error) {
            console.error('Error building tables!');
            console.log(error);
            }
        };


    // Create Initials:


    // Rebuild DB:
    async function rebuildDB() {
        try {
        client.connect();
        console.log("Running DB function...")
        await dropTables();
        } catch (error) {
        console.log("Error during rebuildDB!")
        console.log(error.detail);
        }
    }

    // Test DB:


rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end())