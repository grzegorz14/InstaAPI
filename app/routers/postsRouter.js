const usersController = require("../controllers/usersController")
const postsController = require("../controllers/postsController")
const { getCircularReplacer } = require("../helpers/helpers")


const router = async (req, res) => {
    if (req.url == "/api/posts" && req.method == "POST") {
        try {
            let token = req.headers.authorization
            let email = await usersController.authorizeUser(token)
            if (email == -1) {
                res.writeHead(404, {"Content-Type": "text/plain"})
                res.end("Authorization failed.")
                return
            }

            const newPost = await postsController.createPost(req, res, email)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(newPost, getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
        return
    }
    else if (req.url == "/api/posts" && req.method == "GET") {
        try {
            let posts = await postsController.getAllPosts()
            res.writeHead(200, {"Content-Type": "application/json"})
            res.end(JSON.stringify(posts, getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
        return
    }
    else if (req.url.match(/\/api\/posts\/([a-z0-9]+)/) && req.method == "GET") {
        try {
            const id = req.url.split("/").pop()
            let post = await postsController.getPostById(id)
            if (post == null) {
                res.writeHead(200, {"Content-Type": "text/plain"})
                res.end(JSON.stringify({"message": "There is no post with given ID"}, null, 5))
            }
            else {
                res.writeHead(200, {"Content-Type": "application/json"})
                res.end(JSON.stringify(post, getCircularReplacer(), 5))
            }
        }
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
        return
    }
    else if (req.url.match(/\/api\/posts\/([a-z0-9]+)/) && req.method == "DELETE") {
        try {
            const deleteId = req.url.split("/").pop()
            let message = await postsController.deletePostById(deleteId)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(message, null, 5))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
        return
    }
}

module.exports = router