const filtersController = require("../controllers/filtersController")
const imageFileController = require("../controllers/imageFileController")

const { getRequestData, getCircularReplacer } = require("../helpers/helpers")
const { ResponseWrapper } = require("../models/responseWrapper")


const router = async (req, res) => {
    if (req.url.match(/\/api\/filters\/metadata\/([a-z0-9]+)/) && req.method == "GET") {
        try {
            const id = req.url.split("/").pop()
            let metadata = imageFileController.getImageMetadataById(id)
            
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Get metadata of image with id: " + id,
                    metadata   
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url == "/api/filters" && req.method == "PATCH") {
        try {
            let body = await getRequestData(req)
            const imageAfterOperation = await filtersController.transformImage(body)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Filter was applied to image",
                    imageAfterOperation
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
}

module.exports = router