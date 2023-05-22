const fs = require("fs")
const formidable = require("formidable")
const sharp = require("sharp")
const imageJsonController = require("./imageJsonController")

module.exports = {
    // create image in album
    createImage: (request, response) => {
        return new Promise((resolve, reject)=>{
            const uploadDir = __dirname + "\\..\\..\\uploads\\"
            const form = formidable({ multiples: true, uploadDir: uploadDir })

            form.parse(request, async (err, fields, files) =>{
                if (err) {
                    reject(String(err))
                }
                const file = files["file"]
                const data = fields["data"]
                const albumDirPath = "uploads\\" + data.album + "\\"
                const dateNow = Date.now()
                const newPath = albumDirPath + dateNow + "." + file.name.split(".").pop()

                fs.mkdir(albumDirPath, (err) => {
                    fs.rename(file.path, newPath, (err) => {
                        if (err) {
                            reject(String(err))
                        }
                        else {
                            const image = imageJsonController.addJsonImage(data.album, file["name"], newPath, dateNow)
                            resolve({
                                dateNow: dateNow,
                                image: image,
                                data: data
                            }
                        )
                        }
                    })
                })
            })
        })
    },
    // create image in user album
    createImage: (request, response, userId) => {
        return new Promise((resolve, reject)=>{
            const uploadDir = __dirname + "\\..\\..\\uploads\\"
            const form = formidable({ multiples: true, uploadDir: uploadDir })

            form.parse(request, async (err, fields, files) =>{
                if (err) {
                    reject(String(err))
                }
                const file = files["file"]
                const data = fields["data"]
                //const albumDirPath = "uploads\\" + data.album + "\\"
                const albumDirPath = "uploads\\" + userId + "\\"
                const dateNow = Date.now()
                const newPath = albumDirPath + dateNow + "." + file.name.split(".").pop()

                fs.mkdir(albumDirPath, (err) => {
                    fs.rename(file.path, newPath, async (err) => {
                        if (err) {
                            reject(String(err))
                        }
                        else {
                            const image = await imageJsonController.addJsonImage(userId, file["name"], newPath, dateNow)
                            resolve({
                                dateNow: dateNow,
                                image: image,
                                data: data
                            }
                        )
                        }
                    })
                })
            })
        })
    },
    // add profile photo
    createProfileImage: (request, response, userId) => {
        return new Promise((resolve, reject)=>{
            const uploadDir = __dirname + "\\..\\..\\uploads\\"
            const form = formidable({ multiples: true, uploadDir: uploadDir })

            form.parse(request, async (err, fields, files) =>{
                if (err) {
                    reject(String(err))
                }
                const file = files["file"]
                const albumDirPath = "uploads\\" + userId + "\\"
                const dateNow = Date.now()
                const newPath = albumDirPath + "profile_image" + "." + file.name.split(".").pop()

                fs.mkdir(albumDirPath, (err) => {
                    fs.rename(file.path, newPath, (err) => {
                        if (err) {
                            reject(String(err))
                        }
                        else {
                            const image = imageJsonController.addJsonImage(userId, file["name"], newPath, dateNow)
                            resolve(image)
                        }
                    })
                })
            })
        })
    },
    deleteImage: (images) => {
        return new Promise((resolve, reject) => {
            let image = images[0]
            fs.unlink(image.getPath(), (err) => {
                if (err) {
                    reject(String(err))
                }
                else {
                    resolve({ "message": "Image deleted" })
                }
            })
        })
    },
    getImageFromPath: (path) => {
        return new Promise(async (resolve, reject) => {
            try {
                let image = await sharp("\\..\\..\\" + path).jpeg()
                resolve(image)
            }
            catch (err) {
                reject(err.mesage)
            }
        })
    },
    getImageById: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const imageObject = imageJsonController.getImageById(id)
                if (imageObject == null) {
                    resolve("Image with given ID not found")
                }
                else {
                    let image = await sharp(".\\..\\..\\" + image.url).jpeg()
                    resolve(image)
                }
            }
            catch (err) {
                reject(err.mesage)
            }
        })
    },
    getImageMetadataById: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let image = imageJsonController.getImageById(id)
                let metadata = await sharp(image.url).metadata()
                resolve(metadata)
            }
            catch (err) {
                reject(err.mesage)
            }
        })
    }
}