// Requires
const { client } = require("./Index");
const bcrypt = require('bcrypt')

// createUsers
async function createUsers({username, password, email}) {
    try {
        const { rows: [users] } = await client.query(`
            INSERT INTO users(username, password, email)
            VALUES($1, $2, $3)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `, [username, password, email]);
        
        return users
    } catch (error) {
        console.log(error)
    }
};

// getAllUsers
async function getAllUsers(){
    try {
        const { rows } = await client.query(`
        SELECT id, username, password, email
        FROM users;
        `,);
        
        return rows;
    } catch (error) {
        console.log(error)
    }
};

//getUsersById
async function getUsersById(userId) {
    try {
        const { rows: [ users ] } = await client.query(`
        SELECT id, username
        FROM users
        WHERE id= $1;
        `,[userId]);

        if (!users) {
            return null
        }
        return users;
    } catch (error) {
        throw error
    }
};

//getUsersByUsername
async function getUsersByUsername(username){
    try {
        const { rows: [users] } = await client.query(`
        SELECT *
        FROM users
        WHERE username=$1;
        `, [username])
        return users
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    createUsers,
    getUsersById,
    getAllUsers,
    getUsersByUsername,   
};