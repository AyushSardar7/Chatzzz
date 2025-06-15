const router=require("express").Router();
const authcontroller=require("../controllers/auth");

router.post("/login", authcontroller.login);
router.post("/register", authcontroller.register,authcontroller.SendOtp);
router.post("/send-otp", authcontroller.SendOtp);
router.post("/verify", authcontroller.verifyOtp);
router.post("/forgot-password",authcontroller.forgotPassword);
router.post("/reset-password/:token",authcontroller.resetPassword);



module.exports=router;