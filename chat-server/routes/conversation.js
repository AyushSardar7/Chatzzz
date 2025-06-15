const router=require("express").Router();
const authController=require("../controllers/auth");
const conversationController=require("../controllers/conversation")

router.get("/users/:id",authController.protect,conversationController.getDirectConversations);


module.exports=router;