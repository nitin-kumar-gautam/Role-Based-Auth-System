import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
 const token = req.cookies?.token;

  try {
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "not Authorized Login Again",
      });
    }
    const tokenDecoded =  jwt.verify(token, process.env.TOKEN_KEY);

    if (tokenDecoded.id) {
      req.userId = tokenDecoded.id;
    } else {
      return res.status(400).json({
        success: false,
        message: "not Authorized Login Again",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export default userAuth;
