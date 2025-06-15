const router=require("express").Router();
const userController=require("../controllers/user");
const authController=require("../controllers/auth")

router.post("/generate-zego-token",authController.protect,userController.generateZegoToken);
router.put("/update-me",authController.protect,userController.updateMe);
router.get("/get-me", authController.protect, userController.getMe);
router.get("/get-users",authController.protect,userController.getUsers);
router.get("/get-all-verified-users", authController.protect, userController.getAllVerifiedUsers);
router.get("/get-friends",authController.protect,userController.getFriends);
router.get("/get-friend-request",authController.protect,userController.getRequests);
router.get("/get--sender-friend-request",authController.protect,userController.getSenderRequests);

router.post("/start-audio-call", authController.protect, userController.startAudioCall);
router.post("/start-video-call", authController.protect, userController.startVideoCall);
module.exports=router;