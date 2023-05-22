const posts = []

class Post {
    constructor(dateNow, userId, userEmail, image, description, location, tags) {
        this.id = dateNow
        this.userId = userId
        this.userEmail = userEmail
        this.image = image
        this.description = description
        this.location = location
        this.tags = tags
        this.likes = 0
    }
}

module.exports = { Post, posts }