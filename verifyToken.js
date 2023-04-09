const jwt = require("jsonwebtoken")
const key = "PrivateKey1234"

const userAccess = async(req,res,next) => {
    try {
        const bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== "undefined") {
          const bearer = bearerHeader.split(" ");
          const bearerToken = bearer[1];
          req.token = bearerToken;
          try {
              const data = jwt.verify(req.token, key);
              return next();
            } catch {
            return res
              .status(401)
              .json({ Status: 401, Message: "Session expired! Please login" });
          }
        } else {
          res
            .status(401)
            .json({ Status: 401, Message: "Not authorized! Please login" });
        }
    } catch (error) {
        next(error);
    }
}
module.exports = {
    userAccess
}