const express = require('express');
const {
    createUsers,
    getAllUsers,
    getUsersById,
    getUsersByUsername } = require('../db/Users');

// JWT & DOTENV
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env;

// BCRYPT
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

// Router Middleware
const usersRouter = express.Router();

// Route Handelers
    // Initial usersRouter
    usersRouter.use((req,res,next) => {
        console.log("A request is being made to /users...");

        next();
    });

    // getAllUsers
    usersRouter.get('/', async (req, res, next) => {
        try {
        const users = await getAllUsers();
        res.send({users})
        } catch(error){
            console.log("Error getting all users!")
        }
    });

    // Register
    usersRouter.post('/register', async (req, res, next) => {
        const { username, password, email } = req.body;

        try {
            const _user = await getUsersByUsername(username);

            // Existing user?
            if (_user) {
                console.log("Users exist:", _user)
                res.status(409).send({
                    name: "UserExistsError",
                    message: "A user by that name already exists",
                    status: 409
                });
        } else { // Hash
            // Password
            const saltValForPW = await bcrypt.genSalt(10);
                // 10 is the number of Salt rounds; good default #;
                console.log("Salt for password: ", saltValForPW);
            const hashedPassword = await bcrypt.hash(password, saltValForPW);
                console.log("Hashed password: ", hashedPassword);

            // Email
            // const saltValForEmail = await bcrypt.genSalt(10);
            //     console.log("Salt for email: ", saltValForEmail);
            // const hashedEmail = await bcrypt.hash(email, saltValForEmail);
            //     console.log("Hashed email: ", hashedEmail);
            
            // newUserDataHashed
            const newUserDataHashed = await createUser({
                username,
                password: hashedPassword
                // email: hashedEmail
            })
            // console.log("New Hashed user data: ", newUserDataHashed)

            // Create (JWT)
            const token = jwt.sign(
                {
                    id: newUserDataHashed.id,
                    username
                }, JWT_SECRET, {
                    expiresIn: "1w",
                });
    
                // delete newUserDataHashed.password
                // console.log('This is newUserDataHashed: ', newUserDataHashed)
            res.status(201).send({
                message: "Thank you for signing up.",
                newUserDataHashed,
                token
            });
        }
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    });

    // Login
    usersRouter.post('/login', async (req, res, next) => {
        const { username, password } = req.body;

        // request must have both
        if (!username || !password) {
            next({
                name: "MissingCredentialsError!",
                message: "Please supply both a username and password."
            });
        }

        try {
            const user = await getUsersByUsername(username);

            // Unverified user;
            if (!user) {
                next({ 
                    name: 'IncorrectCredentialsError!', 
                    message: 'Username &/or password is incorrect!'
                });
            }
    
            // Verify if hashed db pw matches pw from request
            const passwordMatch = await bcrypt.compare(password, user.password);
    
            // Verified user;
            if (passwordMatch) {
                // Create Token & Return
                const newToken = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: "1w" });
                res.send({ message: "You're logged in!", token: newToken, success: true });
            } else {
                next({ 
                    name: 'IncorrectCredentialsError!', 
                    message: 'Username &/or password is incorrect!'
                });
            }
        } catch(error) {
            console.log(error);
            next(error);
        }
    });

    // Profile
    usersRouter.get('/profile', async (req, res, next) => {
        const { username } = req.body;
        const myUserInfo = await getUsersByUsername(username);
        res.send({
            myUserInfo
        })
    })

module.exports = {
    usersRouter
};