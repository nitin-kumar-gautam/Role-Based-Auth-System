import express from 'express'
import { isAuthorisied, registerUser, resetPassword, sendResetOtp, sendVerifyOtp, userLogin, userLogout, verifyEmail } from '../controllers/authController.js'
import userAuth from '../middlewares/userAuth.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', userLogin)
router.post("/logout", userLogout)
router.post("/send-verify-otp", userAuth, sendVerifyOtp)
router.post("/verify-email", userAuth, verifyEmail)
router.post("/user-authorised", userAuth, isAuthorisied)
router.post("/send-reset-otp", sendResetOtp)
router.post("/reset-pass", resetPassword)


export default router