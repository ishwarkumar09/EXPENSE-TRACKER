import passport from "passport";
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
        new GraphQLLocalStrategy(async (username, password, done) => {
            try {
                // Await the result of the findOne query
                const user = await User.findOne({ username });
    
                // Check if user exists
                if (!user) {
                    return done(null, false, { message: 'Invalid username' });
                }
                
                // Check if password is valid
                const validPassword = await bcrypt.compare(password, user.password);
    
                if (!validPassword) {
                    return done(null, false, { message: 'Invalid password' });
                }
    
                // If everything is fine, return the user
                return done(null, user);
    
            } catch (err) {
                // Handle errors and pass them to the done callback
                return done(err);
            }
        })
    );
}
 