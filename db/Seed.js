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