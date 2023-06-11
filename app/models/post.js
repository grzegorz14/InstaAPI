const posts = []

class Post {
    constructor(dateNow, simpleUser, image, description, location, tags, date, likes=0) {
        this.id = dateNow
        this.simpleUser = simpleUser
        this.image = image
        this.description = description
        this.location = location
        this.tags = tags
        this.date = date
        this.likes = likes
    }

    updateData(description, location, tags) {
        this.description = description
        this.location = location
        this.tags = tags
    }
}

module.exports = { Post, posts }