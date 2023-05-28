const posts = []

class Post {
    constructor(dateNow, simpleUser, image, description, location, tags, likes=0) {
        this.id = dateNow
        this.simpleUser = simpleUser
        this.image = image
        this.description = description
        this.location = location
        this.tags = tags
        this.likes = likes
    }
}

module.exports = { Post, posts }