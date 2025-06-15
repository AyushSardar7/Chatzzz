const jwt = require("jsonwebtoken");
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require("../models/user");
const crypto = require("crypto");
const optgenerator = require("otp-generator");
const { promisify } = require("util");
const { filterObj } = require("../utils/filterObj");
const { sendEmail } = require("../services.js/mailer");
const ResetPassword = require("../utils/Templetes/Mail/ResetPassword");

const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);

const register = async (req, res, next) => {
    const { firstname, lastname, email, password } = req.body;
    const filteredBody = filterObj(req.body, "firstname", "lastname", "password", "email");
    try {
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ status: "error", message: "First name and last name are required." });
        }

        const hashedPassword = await bcrypt.hash(filteredBody.password, 12);
        const user = await User.findOne({ email: email });

        if (user && user.verified) {
            return res.status(400).json({ status: "error", message: "Email already in use. Please login." });
        } else if (user) {
            const updatedUser = await User.findOneAndUpdate({ email: email }, { ...filteredBody, password: hashedPassword }, { new: true, validateModifiedOnly: true });
            // Generate OTP and send email to user
            req.userId = updatedUser._id;
            next();
        } else {
            // If user has no existing account
            const newUser = await User.create({ ...filteredBody, password: hashedPassword });
            // Generate OTP and send email to user
            req.userId = newUser._id;
            next();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};


const SendOtp = async (req, res, next) => {
    const { userId } = req;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        const new_otp = optgenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        const otp_expiry_time = Date.now() + 10 * 60 * 1000; // 10 min after otp send

        const hashedOtp = await bcrypt.hash(new_otp, 12);

        await User.findByIdAndUpdate(userId, {
            otp: hashedOtp,
            otp_expiry_time,
        });

        const emailContent = `Your OTP is ${new_otp}. This is valid for 10 minutes.`;
        console.log(emailContent);
        // Send OTP email
        await sendEmail({
            email: user.email,
            subject: 'OTP for Talkkkk',
            text: emailContent,
        });
        res.status(200).json({ status: "success", message: "OTP sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};


const verifyOtp = async (req, res, next) => {
    // Verify OTP and update user Record
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({
            email,
            otp_expiry_time: { $gt: Date.now() },
        });

        if (!user) {
            console.log("User not found or OTP expired:", email);
            return res.status(400).json({ status: "error", message: "Wrong Email or OTP expired" });
        }

        if (!user.correctOtp || !(await user.correctOtp(otp, user.otp))) {
            console.log("Incorrect OTP for user:", email);
            return res.status(400).json({ status: "error", message: "OTP is incorrect" });
        }

        user.verified = true;
        user.otp = undefined;
        user.otp_expiry_time=undefined;

        await user.save({ new: true, validateModifiedOnly: true });

        const token = signToken(user._id);
        return res.status(200).json({ status: "success", message: "OTP verified successfully", token });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
}
const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: "error", message: "Both email and password are required" });
    }

    try {
        const user = await User.findOne({ email: email }).select("+password");

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(400).json({ status: "error", message: "Email or password is incorrect" });
        }

        const token = signToken(user._id);

        return res.status(200).json({ 
            status: "success",
            message: "Logged in successfully", 
            token,
            user_id:user._id 
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
}


const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "You are not logged in! Please log in to get access"
            });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const this_user = await User.findById(decoded.userId);
        if (!this_user) {
            return res.status(401).json({
                status: "error",
                message: "The user doesn't exist"
            });
        }

        if (this_user.changePasswordAfter(decoded.iat)) {
            return res.status(401).json({
                status: "error",
                message: "User recently updated password! Please log in again"
            });
        }

        req.user = this_user;
        console.log("Decoded token:", decoded);
        console.log("Authenticated user:", req.user);
        next();
    } catch (error) {
        console.error("Error in protect middleware:", error);
        res.status(401).json({
            status: "error",
            message: "Invalid token. Please log in again",
            error: error.message 
        });
    }
};

const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            status: "error",
            message: "There is no user with the given email"
        });
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `http://localhost:3000/auth/new-password?code=${resetToken}`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Link for Talkkkk',
            html: ResetPassword(user.firstname, resetURL),
            attachments: [],
        });

        res.status(200).json({ status: "success", message: "Reset Password link sent to Email" });
    } catch (error) {
        console.error("Error in forgot password:", error);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        res.status(500).json({
            status: "error",
            message: "There was an error sending the email. Please try again later."
        });
    }
};



const resetPassword = async (req, res, next) => {
    try {
        const hashedToken = crypto.createHash("sha256").update( req.params.token).digest("hex");

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ status: "error", message: "Token is Invalid or Expired" });
        }

        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        // Hash the new password
        const hashedPassword = await bcrypt.hash(user.password, 12);
        user.password = hashedPassword;
        user.passwordConfirm=hashedPassword;
        // Save the updated user
        await user.save();


        const token = signToken(user._id);

        // Send response indicating success
        res.status(200).json({
             status: "success", 
             message: "Password Reset successfully", 
             token,
             user_id:user._id
             });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};


    module.exports = {
        login,
        register,
        SendOtp,
        verifyOtp,
        protect,
        forgotPassword,
        resetPassword,
    }