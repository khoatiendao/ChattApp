const jwt = require("jsonwebtoken");

const jwtConfig = {
    createToken(email, password) {
        const jwtKey = process.env.JWT_SECRET_KEY;
        // const expiresIn = process.env.EXPIRES_IN;
        const tokenGenerate = jwt.sign(
            {email: email, password: password},  
            jwtKey, 
            {expiresIn: process.env.EXPIRES_IN});
        return tokenGenerate;
    }
}

module.exports = jwtConfig;