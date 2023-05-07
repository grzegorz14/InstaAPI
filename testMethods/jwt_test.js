const jwt = require('jsonwebtoken')

const createToken = async () => {

    let token = await jwt.sign(
        {
            email: "aaa@test.com",
            anyData: "123"
        },
        "verysecretkey", // powinno być w .env
        {
            expiresIn: "30s" // "1m", "1d", "24h"
        }
    );
    console.log({ token: token })
    return token
}

const verifyToken = async (token) => {
    try {
        let decoded = await jwt.verify(token, "verysecretkey")
        console.log({ decoded: decoded })
    }
    catch (ex) {
        console.log({ message: ex.message })
    }
}


const processToken = async () => {
    let token = await createToken()
    await verifyToken(token)
}

processToken()