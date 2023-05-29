class SimpleUser {
    constructor(id, firstName, lastName, email) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
    }

    static fromUser(user) {
        return new SimpleUser(user.id, user.firstName, user.lastName, user.email)
    }
}

module.exports = { SimpleUser }