const usersController = require("../controllers/usersController")
const postsController = require("../controllers/postsController")

const { getRequestData, getCircularReplacer } = require("../helpers/helpers")
const { ResponseWrapper } = require("../models/responseWrapper")


const router = async (req, res) => {
    if (req.url == "/api/posts" && req.method == "POST") {
        try {
            let token = req.headers.authorization
            let email = await usersController.authorizeUser(token)

            const newPost = await postsController.createPostRequest(req, res, email)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "New post created",
                    newPost
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url == "/api/posts" && req.method == "GET") {
        try {
            let posts = await postsController.getAllPosts()

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Get all posts",
                    posts
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    // get all posts of user by id
    else if (req.url.match(/\/api\/posts\/user\/([a-z0-9]+)/) && req.method == "GET") {
        try {
            const id = req.url.split("/").pop()
            let posts = await postsController.getAllPostByUserId(id)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Get posts of user with id: " + id,
                    posts
                ),
                getCircularReplacer(), 5))
        }
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url.match(/\/api\/posts\/([a-z0-9]+)/) && req.method == "GET") {
        try {
            const id = req.url.split("/").pop()
            let post = await postsController.getPostById(id)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Get posts with id: " + id,
                    post
                ),
                getCircularReplacer(), 5))
        }
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url.match(/\/api\/posts\/([a-z0-9]+)/) && req.method == "DELETE") {
        try {
            const deleteId = req.url.split("/").pop()
            let deletedPost = await postsController.deletePostById(deleteId)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Post was deleted",
                    deletedPost
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url == "/api/posts"  && req.method == "PATCH") {
        try {
            let token = req.headers.authorization
            let email = await usersController.authorizeUser(token)

            let body = await getRequestData(req)
            let updatedPost = await postsController.updatePost(body.id, body.description, body.location, body.tags)
            
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Post data is updated",
                    updatedPost
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
}

module.exports = router