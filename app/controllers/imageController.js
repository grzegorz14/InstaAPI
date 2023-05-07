const fs = require("fs")
const formidable = require("formidable")
const sharp = require("sharp")
const imageJsonController = require("./imageJsonController")

module.exports = {
    createImage: (request, response) => {
        return new Promise((resolve, reject)=>{
            const uploadDir = __dirname + "\\..\\..\\uploads\\"
            const form = formidable({ multiples: true, uploadDir: uploadDir })

            form.parse(request, async (err, fields, files) =>{
                if (err) {
                    reject(String(err))
                }
                const file = files["file"]
                const album = fields["album"]
                const albumDirPath = "uploads\\" + album + "\\"
                const dateNow = Date.now()
                const newPath = albumDirPath + dateNow + "." + file.name.split(".").pop()

                fs.mkdir(albumDirPath, (err) => {
                    fs.rename(file.path, newPath, (err) => {
                        if (err) {
                            reject(String(err))
                        }
                        resolve({
                                album: album,
                                originalName: file["name"],      
                                url: newPath,
                                dateNow: dateNow
                            }
                        )
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