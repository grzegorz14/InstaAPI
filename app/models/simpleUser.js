class SimpleUser {
    constructor(id, firstName, lastName, email, profileImage = null) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.profileImage = profileImage
    }

    static fromUser(user) {
        return new SimpleUser(user.id, user.firstName, user.lastName, user.email, user.profileImage)
    }
}

module.exports = { SimpleUser }