const imageFileController = require("../controllers/imageFileController")
const fs = require("fs")
const p = require('path')

const router = async (req, res) => {
    if (req.url.match(/\/api\/uploads\/([A-Za-z0-9]+)\/([a-z0-9]+)/) && req.method == "GET") {
        try {
            let pathArray = req.url.split("/")
            const imageName = pathArray.pop()
            const album = pathArray.pop()

            const path = "uploads\\" + album + "\\" + imageName
            const image = imageFileController.getImageFromPath(path)

            if (image == null) {
                res.writeHead(200, {"Content-Type": "text/plain"})
                res.end(JSON.stringify({"message": "There is no image with given path"}, null, 5))
            }
            else {
                res.writeHead(200, {"Content-Type": "image/jpeg"})
                res.sendFile(path)
            }
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }
    else if (req.url.match(/\/api\/getfile\/([a-z0-9]+)/) && req.method == "GET") {
        try {
            const id = req.url.split("\\").pop()
            const image = imageFileController.getImageById(id)
            let path = p.join(".\\..\\..\\" + image.url)
            var stat = fs.statSync(path)
        
            var readStream = fs.createReadStream(path)
            readStream.pipe(res)

            if (image == null) {
                res.writeHead(200, {"Content-Type": "text/json"})
                res.end(JSON.stringify({"message": "There is no image with given ID"}, null, 5))
            }
            else {
                res.writeHead(200, {"Content-Type": "image/jpeg", 'Content-Length': stat.size})
                return
            }
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }
}

module.exports = router