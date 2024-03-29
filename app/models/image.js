const images = []

class Image {
    constructor(album, orginalName, url, dateNow) {
        this.id = dateNow
        this.album = album
        this.orginalName = orginalName
        this.url = url
        this.lastChange = "original"
        this.history = []
        this.history.push(new ImageHistory("original", dateNow))
    }

    // after image edit operation (crop, tint...)
    updateHistory(operation, newUrl) {
        let now = Date.now()
        this.history.push({
            status: operation,
            timestamp: now
        })
        this.lastChange = now
        this.url = newUrl
    }

    setBasicHistory() {
        let now = Date.now()
        this.history.push(new ImageHistory("original", now))
        this.lastChange = now
        const extension = this.url.split(".").pop()
        this.url = "uploads\\" + this.album + "\\" + this.id + "." + extension
    }
}

class ImageHistory {
    constructor(status, timestamp) {
        this.status = status
        this.timestamp = timestamp
    }
}

module.exports = { Image, ImageHistory, images }