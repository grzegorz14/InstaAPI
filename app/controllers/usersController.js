const { User, users, loggedUserTokens } = require("../models/user")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { posts } = require("../models/post")
require('dotenv').config({ path: "./../../hidden.env" })

module.exports = {
    registerNewUser: (registrationData) => {
        return new Promise(async (resolve, reject) => {
            if (users.filter(u => u.email == registrationData.email).length > 0) {
                reject("User with given email (" + registrationData.email + ") already exists")
            }

            let encryptedPassword = await bcrypt.hash(registrationData.password, 10)
            let newUser = new User(
                registrationData.firstName,
                registrationData.lastName,
                registrationData.email,
                encryptedPassword)
            
            users.push(newUser)

            let token = jwt.sign(
                {
                    id: newUser.id,
                    email: newUser.email
                },
                process.env.JWT_SECRET, 
                { expiresIn: "1h" } 
            )

            console.log("New user registers: " + registrationData.email)
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

                console.log("User account confirmed: " + userToConfirm.email)
                resolve(userToConfirm)
            }
        })
    },
    loginUser: (loginData) => {
        return new Promise(async (resolve, reject) => {
            if (users.filter(u => u.email == loginData.email).length == 0) {
                reject("User with given email doesn't exist")
            }
            let user = users.filter(u => u.email == loginData.email)[0]

            let correctPassword = false
            try {
                correctPassword = await bcrypt.compare(loginData.password, user.password)
            }
            catch(err) {
                reject("Password is incorrect")
            }

            if (!correctPassword) {
                reject("Password is incorrect")
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

                loggedUserTokens.push(authorizationToken)
                
                console.log("User logs in: " + user.email)
                resolve(authorizationToken)
            }
        })
    },
    logoutUser: (token) => {
        return new Promise((resolve, reject) => {
            let indexToDelete = loggedUserTokens.findIndex(t => t == token)
            if (indexToDelete >= 0) {
                loggedUserTokens.splice(indexToDelete, 1)

                console.log("User logs out by token.")
                resolve("User is logged out.")
            }
            else {
                reject("User was already logged out.")
            }
        })
    },   
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            if (users.filter(u => u.id == id).length == 0) reject("getUserById - user with given id not found")
            else resolve(users.filter(u => u.id == id)[0])
        })
    },
    getUserByEmail: (email) => {
        return new Promise((resolve, reject) => {
            if (users.filter(u => u.email == email).length == 0) reject("getUserByEmail - user with given email not found")
            else resolve(users.filter(u => u.email == email)[0])
        })
    },
    getUserByToken: (token) => {
        return new Promise(async (resolve, reject) => {
            let decoded = await jwt.verify(
                token, 
                process.env.JWT_SECRET, 
                (err, result) => { return { err: err, result: result }})

            if (decoded.err != "null" && decoded.err != null) {
                reject("User with given token not found")
            }

            let email = decoded.result.email

            if (users.filter(u => u.email == email).length == 0) {
                reject("User with given token not found")
            }
            else {
                resolve(users.filter(u => u.email == email)[0])
            }
        })
    },
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            resolve(users)    
        })
    },
    authorizeUser: (token) => {
        return new Promise(async (resolve, reject) => {
            if (!loggedUserTokens.includes(token)) {
                reject("Authorization failed. User is logged out")
            }

            let decoded = await jwt.verify(
                token, 
                process.env.JWT_SECRET, 
                (err, result) => { return { err: err, result: result }})

            if (decoded.err != "null" && decoded.err != null) {
                reject("Authorization failed")
            }
            else {
                console.log("Authorization succeded for: " + decoded.result.email)
                resolve(decoded.result.email)
            }
        })
    },
    updateUser: (id, newEmail, newFirstName, newLastName) => {
        return new Promise(async (resolve, reject) => {
            let indexToUpdate = users.findIndex(u => u.id == id)
            if (indexToUpdate >= 0) {
                users[indexToUpdate].updateData(newEmail, newFirstName, newLastName)
                
                console.log("User account is updated: " + users[indexToUpdate].email)
                resolve(users[indexToUpdate])
            }
            else {
                reject("updateUser - no user found with given id.")
            }
        })
    },
    addPost: (email, postId) => {
        return new Promise(async (resolve, reject) => {
            let indexToUpdate = users.findIndex(u => u.email == email)
            if (indexToUpdate >= 0) {
                users[indexToUpdate].posts.push(postId)
        
                console.log("New post is added by user: " + email)
                resolve(true)
            }
            else {
                console.log("addPost - no user found with given email.")
                resolve(false)
            }
        })
    },
    addProfileImage: (email, image) => {
        return new Promise(async (resolve, reject) => {
            let indexToUpdate = users.findIndex(u => u.email == email)
            if (indexToUpdate >= 0) {
                users[indexToUpdate].profileImage = image

                console.log("Profile image uploaded by user: " + email)
                resolve("Profile image uploaded")
            }
            else {
                reject("No user found with given email")
            }
        })
    },
    deletePost: (email, postId) => {
        return new Promise(async (resolve, reject) => {
            const userWithPostToDelete = await module.exports.getUserByEmail(email)

            if (userWithPostToDelete.posts.length > 0) {

                let indexToDelete = userWithPostToDelete.posts.findIndex(id => id == postId)
                if (indexToDelete >= 0) {
                    const deletedPostId = userWithPostToDelete.posts.splice(indexToDelete, 1)

                    console.log("Post is deleted by user: " + email)
                    resolve(deletedPostId)
                } 
                else {
                    reject("deletePost - no ID found in posts array of given user.")
                }
            } 
            else {
                reject("deletePost - no user found with given ID or user has no posts.")
            } 
        })
    }
}