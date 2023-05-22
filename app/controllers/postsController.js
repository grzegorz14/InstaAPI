const imageFileController = require("./imageFileController")
const usersController = require("./usersController")

const { Post, posts } = require("../models/post")

module.exports = {
    createPost: (req, res, email) => {
        return new Promise(async (resolve, reject) => {
            const user = await usersController.getUserByEmail(email)
            const { dateNow, image, data } = await imageFileController.createImage(req, res, user.id)
            const dataObject = JSON.parse(data)
            const newPost = new Post(dateNow, user.id, user.email, image, dataObject.description, dataObject.location, dataObject.tags)
            const success = await usersController.addPost(email, newPost)

            posts.push(newPost)
            resolve(newPost)
        })  
    },
    getAllPosts: () => {
        return new Promise((resolve, reject) => {
            resolve(posts)    
        })
    },
    getPostById: (id) => {
        return new Promise((resolve, reject) => {
            if (posts.filter(p => p.id == id).length == 0) reject("getPostById - no post found with given ID.")
            else resolve(posts.filter(p => p.id == id)[0])
        })
    },
    deletePostById: (id) => {
        return new Promise(async (resolve, reject) => {
            let indexToDelete = posts.findIndex(p => p.id == id)
            if (indexToDelete >= 0) {
                const deletedPost = posts.splice(indexToDelete, 1)[0]
                const response = await usersController.deletePost(deletedPost.userEmail, deletedPost.id)
                resolve(deletedPost)
            } 
            else {
                reject("deletePostById - no post found with given ID.")
            } 
        })
    },
}