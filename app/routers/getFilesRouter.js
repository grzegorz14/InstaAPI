const imageFileController = require("../controllers/imageFileController")
const imageJsonController = require("../controllers/imageJsonController")

const fs = require("fs")
const p = require('path')
const { getCircularReplacer, parseFileExtensionToMime } = require("../helpers/helpers")
const { ResponseWrapper } = require("../models/responseWrapper")

const ip = Object.values(require('os').networkInterfaces())
                        .reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family === 'IPv4' && !i.internal && i.address || []), [])), [])


const router = async (req, res) => {
    if (req.url.match(/\/api\/uploads\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)/) && req.method == "GET") {
        try {
            let pathArray = req.url.split("/")
            const imageName = pathArray.pop()
            const extension = imageName.split(".").pop()
            const album = pathArray.pop()

            const path = "uploads\\" + album + "\\" + imageName

            var stat = fs.statSync(path)
            var readStream = fs.createReadStream(path)
            readStream.pipe(res)
            
            res.writeHead(200, {"Content-Type": parseFileExtensionToMime(extension), 'Content-Length': stat.size})
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url.match(/\/api\/getfile\/([a-z0-9]+)/) && req.method == "GET") {
        try {
            const id = req.url.split("/").pop()
            const image = await imageJsonController.getJsonImageById(id)

            var stat = fs.statSync(image.url)
        
            var readStream = fs.createReadStream(image.url)
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