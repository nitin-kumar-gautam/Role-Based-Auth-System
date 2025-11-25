import { user } from "../model/userModel.js";
import bcrypt, { genSalt } from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "all feild required",
      });
    }
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user allrady registered",
      });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await user.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.TOKEN_KEY, {
      expiresIn: "2d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "Production",
      secure:true,
      // sameSite: process.env.NODE_ENV === "Production" ? "none" : "strict",
      sameSite:"none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `Welcome ${username}`,
      text: `Welcome ${username} register successfully with this ${email}`,
    };
    await transporter.sendMail(mailOptions);
    // console.log(mailOptions)

    return res.status(201).json({
      success: true,
      message: "Dhanyawad 🙏 for registertion,  You are registered successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "wrong password",
      });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.TOKEN_KEY, {
      expiresIn: "2d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "Production",
      secure:true,
      // sameSite: process.env.NODE_ENV === "Production" ? "none" : "strict",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Dhanyawad 🙏 for Login, Your are successfully login",
      token
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "Production",
      sameSite: process.env.NODE_ENV === "Production" ? "none" : "strict",
      maxAge: 30 * 20 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Dhanyawad 🙏 for Logout, Your are logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendVerifyOtp = async (req, res) => {
    const  userId  = req.userId;
  try {
    
    
    // const userId = req.user.id;
    const findUserId = await user.findById( userId );

    if (!findUserId) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (findUserId.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Accound is allready verifyed",
      });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    findUserId.verifyOtp = otp;
    findUserId.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await findUserId.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: findUserId.email,
      subject: `Account Verification OTP`,
      text: `your OTP is ${otp} verify your account using this OTP.`,
    };
    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message: "Dhanyawad 🙏 Your OTP send successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {

  const userId = req.userId;
  const {otp} = req.body;

  try {
    
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }
    const findUserId = await user.findById( userId );
    if (!findUserId) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    if (findUserId.verifyOtp === "" || findUserId.verifyOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "invalid otp",
      });
    }

    if (findUserId.verifyOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "otp Expired",
      });
    }

    (findUserId.isAccountVerified = true),
      (findUserId.verifyOtp = ""),
      (findUserId.verifyOtpExpireAt = 0);

    await findUserId.save();

    return res.status(201).json({
      success: true,
      message: "Dhanyawad 🙏 for Email Verifyed, Your Email successfully verifyed",
    });
  } catch (error) {
    return res.status(500).json({
      success:false,
      message: error.message
    })
  }
};

export const isAuthorisied = async (req, res)=>{
  try {
    return res.status(201).json({
      success:true,
      message:"user Authorised"
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message: error.message
    })
  }
}


export const sendResetOtp = async (req, res)=>{
  const {email} = req.body;
  try {
    if(!email){
      return res.status(400).json({
        success:false,
        message:"Email is required"
      })
    }

    const findUser = await user.findOne({email})
    if(!findUser){
      return res.status(400).json({
        success:false,
        message:"user not found"
      })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    findUser.resetOtp = otp;
    findUser.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await findUser.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: findUser.email,
      subject: `Password reset OTP`,
      text: `your OTP is ${otp} reset for your password.`,
    };
    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message: "OTP send successfully for reseting your password",
    });
  } catch (error) {
    return res.status(500).json({
      success:false,
      message: error.message
    })
  }
}


export const resetPassword = async (req, res)=>{
  const {email, otp, newPassword}= req.body;
  try {
    if(!email || !otp || !newPassword){
      return res.status(400).json({
        success: true,
        message:"Email, OTP and new Password are required"
      })
    }
    const findUser = await user.findOne({email})
    if(!findUser){
      return res.status(400).json({
        success:false,
        message:"user not found"
      })
    }

    if(findUser.resetOtp == '' || findUser.resetOtp !== otp){
      return res.status(400).json({
        success:false,
        message:"Invalid OTP"
      })
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    findUser.password = hashedPassword;
    findUser.resetOtp = '';
    findUser.resetOtpExpireAt = 0

    await findUser.save();


    return res.status(201).json({
      success:true,
      message:"password has been reset successfully "
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message: error.message
    })
  }
}