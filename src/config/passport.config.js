import passport from "passport";
import GitHubStrategy from 'passport-github2'
import local from 'passport-local'
import userService from '../models/user.js'
//import { createHash } from "../../utils";

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: "Iv23liSYHTwwlrcbPS9c",
        clientSecret: "8ed53d3b958654e51a1a38e29199f257400ce30f",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            let user = await userService.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 30,
                    email: profile._json.email,
                    password: ""
                }
                let result = await userService.create(newUser)
                done (null, result)
            } else{
                done (null, user)
            }
        } catch (error) {
            return done(error)
        }
    }
))


       
    // passport.use('register', new LocalStrategy(
    //     { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
    //         const { first_name, last_name, email, age } = req.body
    //         try {
    //             let user = await userService.findOne({ email: username })
    //             if (user) {
    //                 console.log("El usuario ya existe")
    //                 return done(null, false)
    //             }
    //             const newUser = {
    //                 first_name,
    //                 last_name,
    //                 email,
    //                 age,
    //                 password: createHash(password)
    //             }
    //             let result = await userService.create(newUser)
    //             return done(null, result)
    //         } catch (error) {
    //             return done("Error al obtener el usuario" + error)
    //         }
    //     }
    // ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id)
        done(null, user)
    })

    // passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
    //     try {
    //         const user = await userService.findOne({ email: username })
    //         if (!user) {
    //             console.log("El usuario no existe")
    //             return done(null, user)
    //         }
    //         if (!isValidPassword(user, password)) return done(null, false)
    //         return done(null, user)
    //     } catch (error) {
    //         return done(error)
    //     }
    // }))

}

export default initializePassport