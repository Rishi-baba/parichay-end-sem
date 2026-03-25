const jwt = require('jsonwebtoken');

exports.generateAccessToken = (userId) =>{
 return jwt.sign({userId},
    process.env.JWT_SECRET,
    {expiresIn: '15m'}
  )
}
exports.generateRefreshToken = (userId) =>{
  return jwt.sign({userId},
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: '7d'}
  )
}