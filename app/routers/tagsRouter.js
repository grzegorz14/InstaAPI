const tagsController = require("../controllers/tagsController")
const { getRequestData } = require("../helpers/helpers")


const router = async (req, res) => {
    if (req.url == "/api/tags/raw" && req.method == "GET") {
        try {
            let tagsRaw = await tagsController.getAllTagsRaw()
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Array of all tag names",
                    tagsRaw
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url == "/api/tags" && req.method == "GET") {
        try {
            let tags = await tagsController.getAllTags()
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Array of all tags",
                    tags
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url.match(/\/api\/tags\/([a-z0-9]+)/) && req.method == "GET") {
        try{
            const id = req.url.split("/").pop()
            let tag = await tagsController.getTagById(id)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Tag of id: " + id,
                    tag
                ),
                getCircularReplacer(), 5))
        }
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }    
    else if (req.url.match(/\/api\/tags\/([a-z0-9]+)/) && req.method == "GET") {
        try{
            const name = req.url.split("/").pop()
            let tag = await tagsController.getTagByName(name)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Tag of id: " + id,
                    tag
                ),
                getCircularReplacer(), 5))
        }
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url == "/api/tags" && req.method == "POST") {
        try {
            let body = await getRequestData(req)
            const newTag = await tagsController.addTag(body.name)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Tag with name: " + newTag.name,
                    newTag.name
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }

    else if (req.url == "/api/posts/tags" && req.method == "PATCH") {
        try {
            let body = await getRequestData(req)
            const updatedPost = await tagsController.addTagToPost(body)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Tag was added to the post",
                    updatedPost
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url == "/api/posts/tags/mass" && req.method == "PATCH") {
        try {
            let body = await getRequestData(req)
            const updatedPost = await tagsController.addMultipleTagsToPost(body)
                        
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Tags were added to the post",
                    updatedPost
                ),
                getCircularReplacer(), 5))
        } 
        catch (err) {
            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(new ResponseWrapper(false, err, null), getCircularReplacer(), 5))
        }
        return
    }
    else if (req.url.match(/\/api\/posts\/tags\/([a-z0-9]+)/) && req.method == "GET") {
        try{
            const id = req.url.split("/").pop()
            let tags = await tagsController.getTagsOfPost(id)

            res.writeHead(201, {"Content-Type": "application/json"})
            res.end(JSON.stringify(
                new ResponseWrapper(
                    true, 
                    "Tags of post with id: " + id,
                    tags
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