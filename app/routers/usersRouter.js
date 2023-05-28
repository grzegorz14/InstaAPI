const imageFileController = require("../controllers/imageFileController")
const imageJsonController = require("../controllers/imageJsonController")
const usersController = require("../controllers/usersController")
const { getRequestData, getCircularReplacer } = require("../helpers/helpers")

const ip = Object.values(require('os').networkInterfaces())
                        .reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family === 'IPv4' && !i.internal && i.address || []), [])), [])

const router = async (req, res) => {
    if (req.url == "/api/user/register" && req.method == "POST") {
        try {
            let body = await getRequestData(req)
            const registrationToken = await usersController.registerNewUser(body)
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                {
                    confirmLink: `http://${ip}:3000/api/user/confirm/${registrationToken}`,
                    token: registrationToken,
                    timeLimit: "Warning: link is active only for 1 hour!"
                },
                null,
                5
            ))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }
    else if (req.url.match(/\/api\/user\/confirm\/([A-Za-z0-9]+)/) && req.method == "GET") {
        try {
            const token = req.url.split("/").pop()
            const confirmedUser = await usersController.confirmUserByToken(token)
            const message = confirmedUser.confirmed == true ? "Account is confirmed" : "Confirm unsuccessfull. Please try again"
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                {
                    user: confirmedUser,
                    message: message
                },
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }
    else if (req.url == "/api/user/login" && req.method == "POST") {
        try {
            let body = await getRequestData(req)
            const authorizationToken = await usersController.loginUser(body)
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                {
                    token: authorizationToken
                }, 
                null, 5))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end("User doesn't exist or wrong login data")
        }
    } 
    else if (req.url == "/api/user/logout" && req.method == "GET") {
        try {
            let token = req.headers.authorization
            let response = await usersController.logoutUser(token)

            res.writeHead(200, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                {
                    message: response
                },
                null, 5))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
        return
    }   
    else if (req.url == "/api/user" && req.method == "GET") {
        try {
            const users = await usersController.getAllUsers()
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(users, getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }
    else if (req.url == "/\/api\/getuser\/([A-Za-z0-9]+)/" && req.method == "GET") {
        try {
            const id = req.url.split("/").pop()
            const user = await usersController.getUserById(id)
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(user, getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }
    else if (req.url == "/api/user/auth" && req.method == "POST") {
        try {
            let token = req.headers.authorization
            const authResponse = await usersController.authorizeUser(token)
            res.writeHead(201, {"Content-Type": "application/json"})

            if (authResponse == -1) {
                res.end(JSON.stringify(
                    {
                        success: false,
                        email: "null"
                    }, 
                    null, 5))
            }
            else {
                res.end(JSON.stringify(
                    {
                        success: true,
                        email: authResponse
                    }, 
                    null, 5))
            }
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }   
    else if (req.url == "/api/user/profile" && req.method == "GET") {
        try {   
            let token = req.headers.authorization
            const profile = await usersController.getUserByToken(token)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(profile, getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
        return
    }
    else if (req.url == "/api/user/profile" && req.method == "PATCH") {
        try {
            let token = req.headers.authorization
            let checkToken = await usersController.authorizeUser(token)
            
            if (checkToken == -1) {
                res.writeHead(404, {"Content-Type": "text/plain"})
                res.end(String(err))
            }
            else {
                let profile = await usersController.getUserByToken(token)
                let body = await getRequestData(req)
                let updatedUser = await usersController.updateUser(profile.id, body.email, body.firstName, body.lastName)
                
                res.writeHead(200, {"Content-Type": "application/json"})
                res.end(JSON.stringify(updatedUser, getCircularReplacer(), 5))
            }
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
        return
    }
    else if (req.url == "/api/user/profile/image" && req.method == "POST") {
        try {
            let token = req.headers.authorization
            let email = await usersController.authorizeUser(token)
            if (email == -1) {
                res.writeHead(404, {"Content-Type": "text/plain"})
                res.end("Authorization failed.")
                return
            }

            let user = await usersController.getUserByEmail(email)
            const profileImage = await imageFileController.createProfileImage(req, res, user.id)
            const success = await usersController.addProfileImage(email, profileImage)

            if (success) {
                res.writeHead(201, {"Content-Type": "application/json"})
                res.end(JSON.stringify(
                    {
                        message: "Profile image is uploaded."
                    }, 
                    null, 5))
            }
            else {
                res.writeHead(201, {"Content-Type": "application/json"})
                res.end(JSON.stringify(
                    {
                        message: "Error while uploading profile image."
                    }, 
                    null, 5))
            }
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
        return
    }
}

module.exports = router