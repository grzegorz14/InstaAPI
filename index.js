const http = require('http')
require('dotenv').config({ path: "./hidden.env" })

const imageRouter = require("./app/routers/imageRouter")
const tagsRouter = require("./app/routers/tagsRouter")
const filtersRouter = require("./app/routers/filtersRouter")
const getFilesRouter = require("./app/routers/getFilesRouter")
const usersRouter = require("./app/routers/usersRouter")
const postsRouter = require("./app/routers/postsRouter")
const { setupInitalData } = require("./app/helpers/helpers")

const ip = Object.values(require('os').networkInterfaces())
                        .reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family === 'IPv4' && !i.internal && i.address || []), [])), [])

console.log(ip)

setupInitalData()

http.createServer(async (req, res) => {

    //images router
    if (req.url.search("/api/images") != -1) {
        await imageRouter(req, res)
    }

    //get files router
    else if (req.url.search("/api/getfile") != -1 || req.url.search("/api/uploads") != -1) {
        await getFilesRouter(req, res)
    }

    //tags router
    else if (req.url.search("/api/tags") != -1 || req.url.search("/api/posts/tags") != -1) {
        await tagsRouter(req, res)
    }

    //filters router
    else if (req.url.search("/api/filters") != -1) {
        await filtersRouter(req, res)
    }

    //users router
    else if (req.url.search("/api/user") != -1 || req.url.search("/api/getuser") != -1) {
        await usersRouter(req, res)
    }

    //posts router
    else if (req.url.search("/api/posts") != -1 && req.url.search("/api/posts/tags") == -1) {
        await postsRouter(req, res)
    }

}).listen(process.env.APP_PORT, () => console.log("Listen on " + process.env.APP_PORT))