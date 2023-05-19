const filtersController = require("../controllers/filtersController")
const imageFileController = require("../controllers/imageFileController")
const { getRequestData } = require("../helpers/getRequestData")


const router = async (req, res) => {
    if (req.url.match(/\/api\/filters\/metadata\/([a-z0-9]+)/) && req.method == "GET") {
        try {
            const id = req.url.split("/").pop()
            let metadata = imageFileController.getImageMetadataById(id)
            if (metadata == null) {
                res.writeHead(200, {"Content-Type": "text/plain"})
                res.end(JSON.stringify({"message": "There is no image with given ID"}, null, 2))
            }
            else {
                res.writeHead(200, {"Content-Type": "application/json"})
                res.end(JSON.stringify(metadata, null, 2))
            }
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }
    else if (req.url == "/api/filters" && req.method == "PATCH") {
        try {
            let body = await getRequestData(req)
            const imageAfterOperation = await filtersController.transformImage(body)
            res.writeHead(200, {"Content-Type": "application/json"})
            res.end(JSON.stringify(imageAfterOperation, null, 2))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }
}

module.exports = router