const router = require("express").Router();
const Challenge = require("../models/Challenge");
const auth = require("../middleware/auth");

// CREATE CHALLENGE (protected - mentor only)
router.post("/create", auth, async (req, res) => {
  try {
    const { mentor_id, title, description, subject, difficulty, deadline, session_id } = req.body;

    if (!mentor_id || !title || !description) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await Challenge.create({
      mentor_id,
      title,
      description,
      subject: subject || null,
      difficulty: difficulty || null,
      deadline: deadline || null,
      session_id: session_id || null
    });

    res.json({ message: "Challenge Created ✅" });

  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


// GET ALL CHALLENGES
router.get("/all", async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate("session_id", "title")
      .sort({ _id: -1 })
      .lean();

    const mapped = challenges.map(c => ({
      ...c,
      id: c._id,
      session_title: c.session_id ? c.session_id.title : null
    }));

    res.json(mapped);

  } catch (err) {
    console.log("FETCH ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;