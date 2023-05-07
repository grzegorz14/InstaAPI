const users = []

class User {
        constructor(name, lastName, email, encryptedPassword) {
        this.id = Date.now()
        this.name = name
        this.lastName = lastName
        this.email = email
        this.confirmed = false
        this.password = encryptedPassword
    }
}

module.exports = { User, users }