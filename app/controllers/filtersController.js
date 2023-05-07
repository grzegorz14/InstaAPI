const imageJsonController = require("./imageJsonController")
const sharp = require("sharp")

module.exports = {
    transformImage: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let image = imageJsonController.getJsonImageById(data.id)
                if (image == null) {  
                    reject("No image with given ID")
                }
                let pathArray = image.url.split("\\")
                pathArray.pop()
                let pathWithoutName = pathArray.join("\\")
                let newUrl = pathWithoutName + "\\" + image.id + "_" + data.operation + ".jpg"

                let lastPath = __dirname + "\\..\\..\\" + image.url
                let endPath = __dirname + "\\..\\..\\" + newUrl    

                switch (data.operation) {
                    case "tint": 
                        await sharp(lastPath)
                            .tint(data.tint)
                            .toFile(endPath)
                        break;
                    case "crop":
                        await sharp(lastPath)
                            .extract(data.crop)
                            .toFile(endPath)
                        break;
                    case "resize":
                        await sharp(lastPath)
                            .resize(data.resize)
                            .toFile(endPath)
                        break;
                    case "rotate":
                        await sharp(lastPath)
                            .rotate(data.rotate)
                            .toFile(endPath)
                        break;
                    case "grayscale":
                        await sharp(lastPath)
                            .grayscale()
                            .toFile(endPath)
                        break;
                    case "negate":
                        await sharp(lastPath)
                            .negate()
                            .toFile(endPath)
                        break;
                }
                image.updateHistory(data.operation)
                resolve(image)
            }
            catch (err) {
                reject(err.mesage)
            }
        })
    }
}