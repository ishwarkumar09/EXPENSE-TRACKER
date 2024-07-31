import passport, { use } from "passport";
import bcrypt from 'bcryptjs';

import User from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport = async()=>{
    passport.serializeUser((user,done)=>{
        console.log("serializing user")
        done(null,user.id);
    });

    passport.deserializeUser(async(id,done)=>{
        console.log("Deserializing user")
        try {
            const user = await User.findById(id);
            done(null,user)
        } catch (err) {
            done(err)
        }
    })

    passport.use(
        new GraphQLLocalStrategy(async(username,password,done)=>{
          try {
            const user = User.findOne({username});
            if(!user){
                throw new Error("Invalid username ")
            }

            const validPassword = await bcrypt.compare(password , user.password)

            if(!validPassword){
                throw new Error("Invalid password or wrong password")
            }

            return done(null,user)
            
          } catch (err) {
            done(err)
          }
        })
    )
}
 