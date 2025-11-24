import { user } from "../model/userModel.js";

 export const getuserData = async (req, res)=>{

    const userId = req.userId;

    try {

        const findUser = await user.findById(userId)

        if(!findUser){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        return res.status(201).json({
            success:true,
            userData:{
                username: findUser.username,
                isAccountVerified: findUser.isAccountVerified
            }
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
 }