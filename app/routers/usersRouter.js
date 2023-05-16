const usersController = require("../controllers/usersController")
const { getRequestData } = require("../helpers/getRequestData")

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
                2
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
                 null, 2))
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
                null, 2))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
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
                 null, 2))
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
            res.end(JSON.stringify(users, null, 2))
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
                    null, 2))
            }
            else {
                res.end(JSON.stringify(
                    {
                        success: true,
                        email: authResponse
                    }, 
                    null, 2))
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
            res.end(JSON.stringify(profile, null, 2))
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
                let profile = usersController.getUserByToken(token)
                let body = await getRequestData(req)
                let updatedUser = await usersController.updateUser(profile.id, body.email, body.firstName, body.lastName)
                
                res.writeHead(200, {"Content-Type": "application/json"})
                res.end(JSON.stringify(updatedUser, null, 2))
            }
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
        return
    }
    else if (req.url == "/api/user/profile" && req.method == "POST") {
        //upload image
        return
    }
}

module.exports = router