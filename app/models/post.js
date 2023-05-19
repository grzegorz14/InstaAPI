const posts = []

class Post {
    constructor(dateNow, user, image, description, location, tags) {
        this.id = dateNow
        this.user = user
        this.image = image
        this.description = description
        this.location = location
        this.tags = tags
        this.likes = 0
    }
}

module.exports = { Post, posts }