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

    }
  },
  Query: {
    users: (_, { req, res }) => {
      return users;
    },
    user: (_, { userId }) => {
      return users.find((user) => user._id === userId);
    },
  },
};

export default userResolver;
