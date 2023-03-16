const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const {EMAIL_PROVIDER} = require("../constants");
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,

    },
    role: {
        type: String, 
         default: "user",
    },
    isBanned:{
        type : Boolean , 
        default :false 
    },
    status: {
        type: String,
        enum: ["Pending", "Active"],
        default: "Pending"
    },
    newpassword: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    provider: {
        type: String,
        required: true,
        default: EMAIL_PROVIDER.Email
    },
    googleId: {
        type: String
    },
    facebookId: {
        type: String
    },
    avatar: {
        type: String
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    },
    aboutMe: {
        type: String
    }
})
mongoose.set('strictQuery', false);
// static signup method
userSchema.statics.signup = async function(email, password) {

    // validation
    if (!email || !password) {
        throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email not valid')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough,Must contain at least one number and one special symbol')
    }

    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hash })

    return user
}

// static login method
userSchema.statics.login = async function(email, password) {

    if (!email || !password) {
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({ email })
    if (!user) {
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Incorrect password')
    }

    return user
}
userSchema.statics.signupGoogle = async function(email, googleId) {

    // validation
    if (!email ) {
        throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email not valid')
    }


    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use')
    }



    const user = await this.create({ email, googleId })

    return user
}
userSchema.statics.loginGoogle = async function(email, googleId) {

    if (!email) {
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({ email })
    if (!user) {
        throw Error('Incorrect email')
    }


    return user
}
// static reset pwd method
userSchema.statics.resetpwd = async function(password, newpassword) {

    // validation
    if (!newpassword || !password) {
        throw Error('All fields must be filled')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }
    if( password != newpassword){
        throw Error('Password not match')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const match = await bcrypt.compare(password, newpassword)

    if (match) {
        throw Error('Password not match')
    }

    return match
}




module.exports = mongoose.model('User', userSchema)