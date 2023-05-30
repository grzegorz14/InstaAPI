const imageFileController = require("../controllers/imageFileController")

const fs = require("fs")
const p = require('path')
const { getCircularReplacer } = require("../helpers/helpers")
const { ResponseWrapper } = require("../models/responseWrapper")

const router = async (req, res) => {
    if (req.url.match(/\/api\/uploads\/([A-Za-z0-9]+)\/([a-z0-9]+)/) && req.method == "GET") {
        try {
            let pathArray = req.url.split("/")
            const imageName = pathArray.pop()
            const album = pathArray.pop()

            const path = "uploads\\" + album + "\\" + imageName
            var stat = fs.statSync(path)

            var readStream = fs.createReadStream(path)
            readStream.pipe(res)

            const image = await imageFileController.getImageFromPath(path)

            res.writeHead(200, {"Content-Type": "image/jpeg", 'Content-Length': stat.size})
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url.match(/\/api\/getfile\/([a-z0-9]+)/) && req.method == "GET") {
        try {
            const id = req.url.split("\\").pop()
            const image = await imageFileController.getImageById(id)
            let path = p.join(".\\..\\..\\" + image.url)
            var stat = fs.statSync(path)
        
            var readStream = fs.createReadStream(path)
            readStream.pipe(res)

            res.writeHead(200, {"Content-Type": "image/jpeg", 'Content-Length': stat.size})
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
}

module.exports = router