const { posts } = require("../models/post")
const { Tag, tags } = require("../models/tag")

module.exports = {
    getAllTagsRaw: () => {
        return new Promise((resolve, reject) => {
            resolve(tags.map(tag => tag.name))    
        })
    },
    getAllTags: () => {
        return new Promise((resolve, reject) => {
            resolve(tags)    
        })
    },
    getTagById: (id) => {
        return new Promise((resolve, reject) => {
            if (tags.filter(tag => tag.id == id).length == 0) reject("getTagById - no tag found with given ID.")
            else resolve(tags.filter(tag => tag.id == id)[0])
        })
    },
    getTagByName: (name) => {
        return new Promise((resolve, reject) => {
            if (tags.filter(tag => tag.name == name).length == 0) reject("getTagByName - no tag found with given name.")
            else resolve(tags.filter(tag => tag.name == name)[0])
        })
    },
    addTag: (name) => {
        return new Promise((resolve, reject) => {
            if (tags.filter(tag => tag.name == name).length > 0) {
                resolve(tags.filter(tag => tag.name == name)[0])
            }
            else {
                let newTag = new Tag(name.name)
                tags.push(newTag)
                resolve(newTag)
            }
        })
    },

    addTagToPost: (postData) => {
        return new Promise(async (resolve, reject) => {
            if (posts.filter(p => p.id == postData.id).length == 0) {
                resolve("addTagToPost - no image found with given ID.")
            }
            else {
                let foundPost = posts.filter(p => p.id == postData.id)[0]
                let tagToAdd = postData.tags[0]
                let tag = await module.exports.addTag(tagToAdd)
                foundPost.tags.push(tag)
                resolve(foundPost)
            }
        })
    },
    addMultipleTagsToPost: (postData) => {
        return new Promise(async (resolve, reject) => {
            if (posts.filter(p => p.id == postData.id).length == 0) {
                resolve("addMultipleTagsToPost - no image found with given ID.")
            }
            else {
                let foundPost = posts.filter(p => p.id == postData.id)[0]
                postData.tags.forEach(async (tagToAdd) => {
                    let tag = await module.exports.addTag(tagToAdd)
                    foundPost.tags.push(tag) 
                })
                resolve(foundPost)
            }
        })
    },
    getTagsOfPost: (postId) => {
        return new Promise((resolve, reject) => {
            if (posts.filter(p => p.id == postId).length == 0) {
                resolve("DeletePost - no post found with given ID.")
            }
            else {
                let foundPost = posts.filter(p => p.id == postId)[0]
                resolve({
                    id: foundPost.id,
                    tags: foundPost.tags
                })
            }
        })
    }
}