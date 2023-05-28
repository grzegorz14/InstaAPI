const { User, users, loggedUserTokens } = require("../models/user")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { posts } = require("../models/post")
require('dotenv').config({ path: "./../../hidden.env" })

module.exports = {
    registerNewUser: (registrationData) => {
        return new Promise(async (resolve, reject) => {
            let encryptedPassword = await bcrypt.hash(registrationData.password, 10)
            let newUser = new User(
                registrationData.firstName,
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
            if (users.filter(u => u.email == loginData.email).length == 0) reject("loginUser - user with given email not found")
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

                loggedUserTokens.push(authorizationToken)
                resolve(authorizationToken)
            }
        })
    },
    logoutUser: (token) => {
        return new Promise((resolve, reject) => {
            let indexToDelete = loggedUserTokens.findIndex(t => t == token)
            if (indexToDelete >= 0) {
                loggedUserTokens.splice(indexToDelete, 1)
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
                reject("getUserByToken - user with given token not found")
                return
            }

            let email = decoded.result.email

            if (users.filter(u => u.email == email).length == 0) reject("getUserByToken - user with given token not found")
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
            if (!loggedUserTokens.includes(token)) {
                console.log("Authorization failed. User is logged out.")
                reject(-1)
                return
            }

            let decoded = await jwt.verify(
                token, 
                process.env.JWT_SECRET, 
                (err, result) => { return { err: err, result: result }})

            if (decoded.err != "null" && decoded.err != null) {
                console.log("Authorization failed.")
                reject(-1)
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
                resolve(users[indexToUpdate])
            }
            else {
                reject("updateUser - no user found with given id.")
            }
        })
    },
    addPost: (email, post) => {
        return new Promise(async (resolve, reject) => {
            let indexToUpdate = users.findIndex(u => u.email == email)
            if (indexToUpdate >= 0) {
                users[indexToUpdate].posts.push(post)
                posts.push(post)
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
                resolve(true)
            }
            else {
                console.log("addProfileImage - no user found with given email.")
                resolve(false)
            }
        })
    },
    deletePost: (userEmail, postId) => {
        return new Promise(async (resolve, reject) => {
            const userWithPostToDelete = await module.exports.getUserByEmail(userEmail)

            if (userWithPostToDelete.posts.length > 0) {

                let indexOfPostToDelete = userWithPostToDelete.posts.findIndex(p => p.id == postId)
                if (indexOfPostToDelete >= 0) {
                    const deletedPost = userWithPostToDelete.posts.splice(indexOfPostToDelete, 1)
                    resolve(deletedPost)
                } 
                else {
                    reject("deletePost - no post found with given ID in posts array of given user.")
                }
            } 
            else {
                reject("deletePost - no user found with given ID or user has no posts.")
            } 
        })
    }
}