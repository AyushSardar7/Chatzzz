const mongoose = require("mongoose");
const bcrypt=require('bcryptjs');
const crypto=require("crypto");
const { type } = require("os");
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "First name is required"]
    },
    lastname: {
        type: String,
        required: [true, "Last name is required"]
    },
    avatar: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: function (email) {
                return String(email)
                    .toLowerCase()
                    .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    );
            },
            message: (props) => `Email{${props.valur}} is invalid`
        }
    },
    password: {
        type: String,
    },
    about:{
      type:String,  
    },
    passwordConfirm: {
        type: String,
    },
    passwordChangedAt: {
        type: Date,
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date,
    },
    verified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String,
    },
    otp_expiry_time:{
        type:Date,
    },
    socket_id:{
        type:String,
    },
    friends:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"User",
        }
    ],
    status:{
        type:String,
        enum:["Online","Offline"]
    }
})


userSchema.methods.correctPassword = async function (candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}
userSchema.methods.correctOtp = async function (candidateOtp, userOtp){
    return await bcrypt.compare(candidateOtp,userOtp);
}

userSchema.methods.changePasswordAfter=function(timestamp){
    return timestamp < this.passwordChangedAt;
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

const User = new mongoose.model("User", userSchema);
module.exports = User;
