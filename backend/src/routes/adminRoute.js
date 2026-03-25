const express = require("express");
const router = express.Router();
const { getUsers, deleteUser, getCases, deleteCase, getEvidence, deleteEvidence, createLawyer, createNgo, getLawyers, deleteLawyer, getNgos, deleteNgo } = require("../controller/adminController");
const { protect, autherize } = require("../middleware/authMiddleware");

router.get("/users", protect, autherize("admin"), getUsers);
router.delete("/users/:id", protect, autherize("admin"), deleteUser);

router.get("/cases", protect, autherize("admin"), getCases);
router.delete("/cases/:id", protect, autherize("admin"), deleteCase);

router.get("/evidence", protect, autherize("admin"), getEvidence);
router.delete("/evidence/:id", protect, autherize("admin"), deleteEvidence);

router.post("/lawyers", protect, autherize("admin"), createLawyer);
router.post("/ngos", protect, autherize("admin"), createNgo);

router.get("/lawyers", protect, autherize("admin"), getLawyers);
router.delete("/lawyers/:id", protect, autherize("admin"), deleteLawyer);

router.get("/ngos", protect, autherize("admin"), getNgos);
router.delete("/ngos/:id", protect, autherize("admin"), deleteNgo);

module.exports = router;
