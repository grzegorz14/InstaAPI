const { images } = require("../models/image")
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
            if (tags.filter(tag => tag.id == id).length == 0) reject("No tag found with given ID.")
            else resolve(tags.filter(tag => tag.id == id)[0])
        })
    },
    getTagByName: (name) => {
        return new Promise((resolve, reject) => {
            if (tags.filter(tag => tag.name == name).length == 0) reject("No tag found with given name.")
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

    addTagToImage: (imageData) => {
        return new Promise((resolve, reject) => {
            if (images.filter(image => image.id == imageData.id).length == 0) {
                resolve("No image found with given ID.")
            }
            else {
                let foundImage = images.filter(image => image.id == imageData.id)[0]
                let tagToAdd = imageData.tags[0]
                let tag = module.exports.addTag(tagToAdd)
                foundImage.tags.push(tag)
                resolve(foundImage)
            }
        })
    },
    addMultipleTagsToImage: (imageData) => {
        return new Promise((resolve, reject) => {
            if (images.filter(image => image.id == imageData.id).length == 0) {
                resolve("No image found with given ID.")
            }
            else {
                let foundImage = images.filter(image => image.id == imageData.id)[0]
                imageData.tags.forEach(tagToAdd => {
                    let tag = module.exports.addTag(tagToAdd)
                    foundImage.tags.push(tag) 
                })
                resolve(foundImage)
            }
        })
    },
    getTagsOfImage: (imageId) => {
        return new Promise((resolve, reject) => {
            if (images.filter(image => image.id == imageId).length == 0) {
                resolve("No image found with given ID.")
            }
            else {
                let foundImage = images.filter(image => image.id == imageId)[0]
                resolve({
                    id: foundImage.id,
                    tags: foundImage.tags
                })
            }
        })
    }
}