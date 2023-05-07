const usersController = require("../controllers/usersController")
const { getRequestData } = require("../helpers/getRequestData")

const router = async (req, res) => {
    if (req.url == "/api/user/register" && req.method == "POST") {
        try {
            let body = await getRequestData(req)
            const registrationToken = await usersController.registerNewUser(body)
            res.writeHead(201, {"Content-Type": "plain/text"})
            res.end(`Copy link below to activate your account:
http://localhost:3000/api/user/confirm/${registrationToken}
Warning: link is active only for 1 hour!`)
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
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(confirmedUser, null, 2))
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
            res.writeHead(201, {"Content-Type": "text/plain"})
            res.end(authorizationToken)
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
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
}

module.exports = router