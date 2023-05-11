const { User, users } = require("../models/user")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: "./../../hidden.env" })

module.exports = {
    registerNewUser: (registrationData) => {
        return new Promise(async (resolve, reject) => {
            let encryptedPassword = await bcrypt.hash(registrationData.password, 10)
            let newUser = new User(
                registrationData.name,
                registrationData.lastName,
                registrationData.email,
                encryptedPassword)
            
            users.push(newUser)
            console.log("New user registers: " + registrationData.email)

            let token = jwt.sign(
                {
                    id: newUser.id,
                    email: newUser.email
                },
                process.env.JWT_SECRET, 
                { expiresIn: "1h" } 
            )

            resolve(token)
        })
    },
    confirmUserByToken: (token) => {
        return new Promise(async (resolve, reject) => {
            let decoded = await jwt.verify(
                token, 
                process.env.JWT_SECRET, 
                (err, result) => { return { err: err, result: result }})

            if (decoded.err != "null" && decoded.err != null) {
                reject("Activation unsuccessfull. \n" + JSON.stringify(decoded, null, 2))
            }
            else {
                let userToConfirm = users.filter(u => u.email == decoded.result.email)[0]
                if (!userToConfirm.confirmed) userToConfirm.confirmed = true
                resolve(userToConfirm)
            }
        })
    },
    loginUser: (loginData) => {
        return new Promise((resolve, reject) => {
            if (users.filter(u => u.email == loginData.email).length == 0) reject("User with given email not found")
            let user = users.filter(u => u.email == loginData.email)[0]

            if (!bcrypt.compare(loginData.password, user.password)) {
                reject("Password is incorrect.")
            }
            else {
                let authorizationToken = jwt.sign(
                    {
                        id: user.id,
                        email: user.email
                    },
                    process.env.JWT_SECRET, 
                    { expiresIn: "1d" } 
                )
                resolve(authorizationToken)
            }
        })
    },
    getUserByEmail: (email) => {
        return new Promise((resolve, reject) => {
            if (users.filter(u => u.email == email).length == 0) reject("User with given email not found")
            else resolve(users.filter(u => u.email == email)[0])
        })
    },
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            resolve(users)    
        })
    },
    authorizeUser: (token) => {
        return new Promise(async (resolve, reject) => {
            let decoded = await jwt.verify(
                token, 
                process.env.JWT_SECRET, 
                (err, result) => { return { err: err, result: result }})

            if (decoded.err != "null" && decoded.err != null) {
                console.log("Authorization failed.")
                reject(-1)
            }
            else {
                console.log("Authorization succeded.")
                resolve(decoded.result.email)
            }
        })
    }
}