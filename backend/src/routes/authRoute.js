const express = require("express")
const router = express.Router();

const { register, login, getProfile, logout, refreshToken, changePassword, forgotPassword, resetPassword } = require("../controller/authController")
const { protect, autherize } = require("../middleware/authMiddleware")

router.post("/register", register)
router.post("/login", login)
router.post("/logout", protect, logout)
router.post("/refresh", refreshToken)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

router.get("/profile", protect, getProfile)
router.get("/admin", protect, autherize("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
});


module.exports = router