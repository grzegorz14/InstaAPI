const imageFileController = require("./imageFileController")
const usersController = require("./usersController")

const { Post, posts } = require("../models/post")
const { SimpleUser } = require("../models/simpleUser")

module.exports = {
    createPostRequest: (req, res, email) => {
        return new Promise(async (resolve, reject) => {
            const user = await usersController.getUserByEmail(email)
            const simpleUser = new SimpleUser(user.id, user.firstName, user.lastName, user.email, user.profileImage)

            const { dateNow, image, data } = await imageFileController.createImage(req, res, user.id)
            const dataObject = JSON.parse(data)
            const newPost = new Post(dateNow, simpleUser, image, dataObject.description, dataObject.location, dataObject.tags)
            const success = await usersController.addPost(email, newPost.id)
            posts.push(newPost)

            console.log("New post from user: " + email)
            resolve(newPost)
        })  
    },
    getAllPosts: () => {
        return new Promise((resolve, reject) => {
            resolve(posts)    
        })
    },
    getAllPostByUserId: (id) => {
        return new Promise((resolve, reject) => {
            if (posts.filter(p => p.simpleUser.id == id).length == 0) reject("No posts found of user with given ID")
            else resolve(posts.filter(p => p.simpleUser.id == id))
        })
    },
    getPostById: (id) => {
        return new Promise((resolve, reject) => {
            if (posts.filter(p => p.id == id).length == 0) reject("No post found with given ID")
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
                reject("No post found with given ID")
            } 
        })
    },
}