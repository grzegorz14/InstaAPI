const users = []
const loggedUserTokens = []

class User {
    constructor(firstName, lastName, email, encryptedPassword) {
        this.id = Date.now()
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.confirmed = false
        this.password = encryptedPassword
        this.profilePhoto = null
        this.posts = []
    }

    updateData(email, firstName, lastName) {
        this.email = email
        this.firstName = firstName
        this.lastName = lastName
    }
}

module.exports = { User, users, loggedUserTokens }