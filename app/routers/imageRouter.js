const imageFileController = require("../controllers/imageFileController")
const jsonController = require("../controllers/imageJsonController")
const usersController = require("../controllers/usersController")
const formidable = require("formidable")

const router = async (req, res) => {
    if (req.url == "/api/images" && req.method == "POST") { // could be not needed at all
        try {
            let token = req.headers.authorization
            let email = await usersController.authorizeUser(token)

            const { album, originalName, url, dateNow } = await imageFileController.createImage(req, res)
            const newImage = await jsonController.addJsonImage(album, originalName, url, dateNow)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "New image was added",
                    newImage
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url == "/api/images" && req.method == "GET") {
        try {
            let images = await jsonController.getAllJsonImage()

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Get all images",
                    images
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url.match(/\/api\/images\/([a-z0-9]+)/) && req.method == "GET") {
        try {
            const id = req.url.split("/").pop()
            let image = await jsonController.getJsonImageById(id)
            
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Get image with id: " + id,
                    image
                ),
                getCircularReplacer(), 5))
        }
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url.match(/\/api\/images\/([a-z0-9]+)/) && req.method == "DELETE") {
        try {
            const deleteId = req.url.split("/").pop()
            let deletedImage = await jsonController.deleteJsonImageById(deleteId)
            let message = await imageFileController.deleteImage(deletedImage)
            
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    message,
                    deletedImage
                ),
                getCircularReplacer(), 5))
        } catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url == "/api/images" && req.method == "PATCH") {
        const form = formidable()
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.writeHead(201, {"Content-Type": "application/json"})
                res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
            }
            else {
                try {
                    let image = await jsonController.updateJsonImage(fields["id"])

                    res.writeHead(201, {"Content-Type": "application/json"})
                    res.end(JSON.stringify(
                        new ResponseWrapper(
                            true, 
                            "Image was updated",
                            image
                        ),
                        getCircularReplacer(), 5))
                }
                catch(err) {
                    res.writeHead(201, {"Content-Type": "application/json"})
                    res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
                }
            }
        })
        return
    }
}

module.exports = router