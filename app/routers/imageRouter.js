const imageFileController = require("../controllers/imageFileController")
const jsonController = require("../controllers/imageJsonController")
const usersController = require("../controllers/usersController")
const formidable = require("formidable")

const router = async (req, res) => {
    if (req.url == "/api/images" && req.method == "POST") {
        try {
            let token = req.headers.authorization
            let email = usersController.authorizeUser(token)
            if (email == -1) {
                res.writeHead(404, {"Content-Type": "text/plain"})
                res.end("Authorization failed.")
                return
            }

            const { album, originalName, url, dateNow } = await imageFileController.createImage(req, res)
            const newImage = await jsonController.addJsonImage(album, originalName, url, dateNow)
            const success = await usersController.addImage(email, newImage)
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(newImage, null, 2))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
        return
    }
    else if (req.url == "/api/images" && req.method == "GET") {
        try {
            let images = await jsonController.getAllJsonImage()
            res.writeHead(200, {"Content-Type": "application/json"})
            res.end(JSON.stringify(images, null, 2))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
        return
    }
    else if (req.url.match(/\/api\/images\/([a-z0-9]+)/) && req.method == "GET") {
        try {
            const id = req.url.split("/").pop()
            let image = await jsonController.getJsonImageById(id)
            if (image == null) {
                res.writeHead(200, {"Content-Type": "text/plain"})
                res.end(JSON.stringify({"message": "There is no image with given ID"}, null, 2))
            }
            else {
                res.writeHead(200, {"Content-Type": "application/json"})
                res.end(JSON.stringify(image, null, 2))
            }
        }
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
        return
    }
    else if (req.url.match(/\/api\/images\/([a-z0-9]+)/) && req.method == "DELETE") {
        try {
            const deleteId = req.url.split("/").pop()
            let deletedImage = await jsonController.deleteJsonImageById(deleteId)
            if (deletedImage != null) {
                console.log(deletedImage)
                let message = await imageFileController.deleteImage(deletedImage)
                res.writeHead(201, {"Content-Type": "application/json"})
                res.end(JSON.stringify(message, null, 2))
            }
            else {
                res.writeHead(200, {"Content-Type": "text/plain"})
                res.end(JSON.stringify({"message": "There is no image with given ID"}, null, 2))
            }
        } catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
        return
    }
    else if (req.url == "/api/images" && req.method == "PATCH") {
        const form = formidable()
        form.parse(req, async (err, fields, files) => {
            console.log(fields)
            if (err) {
                res.writeHead(404, {"Content-Type": "text/plain"})
                res.end(String(err))
            }
            else {
                let image = await jsonController.updateJsonImage(fields["id"])
                if (image == null) {
                    res.writeHead(404, {"Content-Type": "text/plain"})
                    res.end("There is no image with given ID to update")
                } 
                else {
                    res.writeHead(200, {"Content-Type": "application/json"})
                    res.end(JSON.stringify(image, null, 2))
                }
            }
        })
        return
    }
}

module.exports = router