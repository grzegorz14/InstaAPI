const imageFileController = require("../controllers/imageFileController")
const imageJsonController = require("../controllers/imageJsonController")
const usersController = require("../controllers/usersController")
const { getRequestData, getCircularReplacer } = require("../helpers/helpers")
const { ResponseWrapper } = require("../models/responseWrapper")

const ip = Object.values(require('os').networkInterfaces())
                        .reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family === 'IPv4' && !i.internal && i.address || []), [])), [])

const router = async (req, res) => {
    if (req.url == "/api/user/register" && req.method == "POST") {
        try {
            let body = await getRequestData(req)
            const registrationToken = await usersController.registerNewUser(body)
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "New user registered",
                    {
                        confirmLink: `http://${ip}:3000/api/user/confirm/${registrationToken}`,
                        token: registrationToken,
                        timeLimit: "Warning: link is active only for 1 hour!"
                    }
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    false, 
                    err,
                    null
                ),
                getCircularReplacer(), 5))
        }
    }
    else if (req.url.match(/\/api\/user\/confirm\/([A-Za-z0-9]+)/) && req.method == "GET") {
        try {
            const token = req.url.split("/").pop()
            const confirmedUser = await usersController.confirmUserByToken(token)
            const message = confirmedUser.confirmed == true ? "Account is confirmed" : "Confirm unsuccessfull. Please try again"
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    message,
                    confirmedUser
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    false, 
                    "Activation unsucessuful. Token expired",
                    null
                ),
                getCircularReplacer(), 5))
        }
    }
    else if (req.url == "/api/user/login" && req.method == "POST") {
        try {
            let body = await getRequestData(req)
            const authorizationToken = await usersController.loginUser(body)
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "User is logged in",
                    authorizationToken
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    false, 
                    err,
                    null
                ),
                getCircularReplacer(), 5))
        }
    } 
    else if (req.url == "/api/user/logout" && req.method == "GET") {
        try {
            let token = req.headers.authorization
            let response = await usersController.logoutUser(token)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "User is logged out",
                    response
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    false, 
                    err,
                    null
                ),
                getCircularReplacer(), 5))
        }
        return
    }   
    else if (req.url == "/api/user" && req.method == "GET") {
        try {
            const users = await usersController.getAllUsers()

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Array of registered users",
                    users
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    false, 
                    err,
                    null
                ),
                getCircularReplacer(), 5))
        }
    }
    else if (req.url == "/\/api\/getuser\/([A-Za-z0-9]+)/" && req.method == "GET") {
        try {
            const id = req.url.split("/").pop()
            const user = await usersController.getUserById(id)
            
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Get user by id: " + id,
                    user
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    false, 
                    err,
                    null
                ),
                getCircularReplacer(), 5))
        }
    }
    else if (req.url == "/api/user/auth" && req.method == "POST") {
        try {
            let token = req.headers.authorization
            const authResponse = await usersController.authorizeUser(token)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Authorization succeded",
                    authResponse
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    false, 
                    err,
                    null
                ),
                getCircularReplacer(), 5))
        }
    }   
    else if (req.url == "/api/user/profile" && req.method == "GET") {
        try {   
            let token = req.headers.authorization
            const profile = await usersController.getUserByToken(token)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Get profile with email: " + profile.email,
                    profile
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    false, 
                    err,
                    null
                ),
                getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url == "/api/user/profile" && req.method == "PATCH") {
        try {
            let token = req.headers.authorization
            let email = await usersController.authorizeUser(token)
            
            let profile = await usersController.getUserByToken(token)
            let body = await getRequestData(req)
            let updatedUser = await usersController.updateUser(profile.id, body.email, body.firstName, body.lastName)
            
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "User is updated",
                    updatedUser
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    false, 
                    err,
                    null
                ),
                getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url == "/api/user/profile/image" && req.method == "POST") {
        try {
            let token = req.headers.authorization
            let email = await usersController.authorizeUser(token)

            let user = await usersController.getUserByEmail(email)
            const profileImage = await imageFileController.createProfileImage(req, res, user.id)
            const message = await usersController.addProfileImage(email, profileImage)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Profile image is uploaded",
                    profileImage
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    false, 
                    err,
                    null
                ),
                getCircularReplacer(), 5))
        }
        return
    }
}

module.exports = router