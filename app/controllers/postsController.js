const imageFileController = require("./imageFileController")
const imageJsonController = require("./imageJsonController")
const usersController = require("./usersController")

const { Post, posts } = require("../models/post")
const formidable = require("formidable")

module.exports = {
    createPost: (req, res, email) => {
        return new Promise(async (resolve, reject) => {
            const user = usersController.getUserByEmail(email)
            const { dateNow, image, data } = await imageFileController.createImage(req, res, user.id)
            const newPost = new Post(dateNow, user, image, data.description, data.location, data.tags)
            const success = await usersController.addPost(email, newPost)
            resolve(success)
        })  
    },
    getAllPosts: () => {
        return new Promise((resolve, reject) => {
            resolve(posts)    
        })
    },
    getPostById: (id) => {
        return new Promise((resolve, reject) => {
            if (posts.filter(p => p.id == id).length == 0) reject("No post found with given ID.")
            else resolve(posts.filter(p => p.id == id)[0])
        })
    },
    deletePostById: (id) => {
        return new Promise((resolve, reject) => {
            let indexToDelete = posts.findIndex(p => p.id == id)
            if (indexToDelete >= 0) resolve(posts.splice(indexToDelete, 1))
            else reject("No post found with given ID.")
        })
    },
}