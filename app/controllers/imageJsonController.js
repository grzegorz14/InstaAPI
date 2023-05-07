const { Image, images } = require("../models/image")

module.exports = {
    addJsonImage: (album, orginalName, url, dateNow) => {
        return new Promise((resolve, reject) => {
            let newImage = new Image(album, orginalName, url, dateNow)
            images.push(newImage)
            resolve(newImage)    
        })
    },
    getAllJsonImage: () => {
        return new Promise((resolve, reject) => {
            resolve(images)    
        })
    },
    getJsonImageById: (id) => {
        return new Promise((resolve, reject) => {
            if (images.filter(image => image.id == id).length == 0) reject("No image found with given ID.")
            else resolve(images.filter(image => image.id == id)[0])
        })
    },
    deleteJsonImageById: (id) => {
        return new Promise((resolve, reject) => {
            let indexToDelete = images.findIndex(image => image.id == id)
            if (indexToDelete >= 0) resolve(images.splice(indexToDelete, 1))
            else reject("No image found with given ID.")
        })
    },
    updateJsonImage: (id) => {
        return new Promise((resolve, reject) => {
            let indexToUpdate = images.findIndex(image => image.id == id)
            if (indexToUpdate >= 0) {
                images[indexToUpdate].updateHistory()
                resolve(images[indexToUpdate])
            }
            else {
                reject("No image found with given ID.")
            }
        })
    }
}