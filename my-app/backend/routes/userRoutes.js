import { Router } from "express";
import multer from "multer";
import { getProfile, updateProfile, uploadProfileImage, getWishlist, addToWishlist, removeFromWishlist } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/profile/upload-image", protect, (req, res, next) => {
  upload.single("profileImage")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, uploadProfileImage);
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist", protect, addToWishlist);
router.delete("/wishlist", protect, removeFromWishlist);

export default router;
