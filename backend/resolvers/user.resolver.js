import { users } from "../dummyData/data.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
const userResolver = {
  Mutation: {
    signUp: async(_,{input},context)=>{
      try {
        const {username,name,password,gender} = input;
        
        if(!username|| !name || !password || !gender){
          throw new Error("All fields are required")
        }

        const existingUser = await User.findOne({username})

        if(existingUser){
          throw new Error("User is already exists")
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const boysProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlsProfilePic =`https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
          username,
          name,
          password:hashPassword,
          gender,
          profilePic: gender === 'male' ? boysProfilePic : girlsProfilePic
        })

        await newUser.save();
        await context.login(newUser)

        return newUser;


      } catch (err) {
        console.log("Error in signUp: " ,err)
        throw new Error(err.message || "internal server error")
      }
    }
,
    login: async (_,{input},context)=>{
      try {
         const {username , password} = input;
         const{user} = await context.authenticate("graphql-local",{username,password})

         await context.login(user)
         return user;
      } catch (err) {
        console.log("Error in login: " , err)
        throw new Error(err.message || "internal server error")
      }

    },
    logout:async(_,__,context)=>{
      try {
        await context.logout();
        req.session.destroy((err)=>{
          if(err) throw err
        })
        res.clearCookie("connect.id")
        return {message:"Logged out successfully"}
      } catch (err) {
        console.log("Error in logout: " ,err)
        throw new Error(err.message || "Internal server error")
      }
    }
  },
  Query: {
    authUser:async(_,__,context)=>{
     try {
       const user = await context.getUser()
       return user ;
     } catch (err) {
      console.error("Error in authUser: ", err )
      throw new Error("Internal server error")
     }

    },
    user: async(_, { userId }) => {
    try {
      const user = await User.findById(userId);
      return user
    } catch (err) {
      console.error("Error in user: " ,err)
      throw new Error(err.message || "Internal server error")
    }
    },
  },
  // TODO => ADD User/Transaction
};

export default userResolver;
