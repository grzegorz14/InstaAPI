const tagsController = require("../controllers/tagsController")
const { getRequestData } = require("../helpers/getRequestData")


const router = async (req, res) => {
    if (req.url == "/api/tags/raw" && req.method == "GET") {
        try {
            let tagsRaw = await tagsController.getAllTagsRaw()
            res.writeHead(200, {"Content-Type": "application/json"})
            res.end(JSON.stringify(tagsRaw, null, 2))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }
    else if (req.url == "/api/tags" && req.method == "GET") {
        try {
            let tags = await tagsController.getAllTags()
            res.writeHead(200, {"Content-Type": "application/json"})
            res.end(JSON.stringify(tags, null, 2))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }
    else if (req.url.match(/\/api\/tags\/([a-z0-9]+)/) && req.method == "GET") {
        try{
            const id = req.url.split("/").pop()
            let tag = await tagsController.getTagById(id)
            if (tag == null) {
                res.writeHead(200, {"Content-Type": "text/plain"})
                res.end(JSON.stringify({"message": "There is no tag with given ID"}, null, 2))
            }
            else {
                res.writeHead(200, {"Content-Type": "application/json"})
                res.end(JSON.stringify(tag, null, 2))
            }
        }
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }    
    else if (req.url.match(/\/api\/tags\/([a-z0-9]+)/) && req.method == "GET") {
        try{
            const name = req.url.split("/").pop()
            let tag = await tagsController.getTagByName(name)
            if (tag == null) {
                res.writeHead(200, {"Content-Type": "text/plain"})
                res.end(JSON.stringify({"message": "There is no tag with given name"}, null, 2))
            }
            else {
                res.writeHead(200, {"Content-Type": "application/json"})
                res.end(JSON.stringify(tag, null, 2))
            }
        }
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }
    else if (req.url == "/api/tags" && req.method == "POST") {
        try {
            let body = await getRequestData(req)
            const newTag = await tagsController.addTag(body.name)
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(newTag, null, 2))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }

    else if (req.url == "/api/images/tags" && req.method == "PATCH") {
        try {
            let body = await getRequestData(req)
            const updatedImage = await tagsController.addTagToImage(body)
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(updatedImage, null, 2))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }
    else if (req.url == "/api/images/tags/mass" && req.method == "PATCH") {
        try {
            let body = await getRequestData(req)
            const updatedImage = await tagsController.addMultipleTagsToImage(body)
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(updatedImage, null, 2))
        } 
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }
    else if (req.url.match(/\/api\/images\/tags\/([a-z0-9]+)/) && req.method == "GET") {
        try{
            const id = req.url.split("/").pop()
            let tags = await tagsController.getTagsOfImage(id)
            if (tags == null) {
                res.writeHead(200, {"Content-Type": "text/plain"})
                res.end(JSON.stringify({"message": "There is no image with given ID"}, null, 2))
            }
            else {
                res.writeHead(200, {"Content-Type": "application/json"})
                res.end(JSON.stringify(tags, null, 2))
            }
        }
        catch (err) {
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end(String(err))
        }
    }
}

module.exports = router