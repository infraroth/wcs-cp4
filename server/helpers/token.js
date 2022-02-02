import jwt from 'jsonwebtoken';

const privateKey = process.env.SECRET_KEY

const calculateToken = (userEmail = "") => {
  return jwt.sign({email: userEmail}, privateKey)
}

export default calculateToken;