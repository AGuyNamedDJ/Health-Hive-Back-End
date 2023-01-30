// Step 1: Import Client & Exports
const { create } = require('domain');
const { client } = require('./index');

// Page Imports

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