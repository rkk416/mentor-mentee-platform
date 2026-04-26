const router = require("express").Router();
const Feedback = require("../models/Feedback");
const Submission = require("../models/Submission");
const auth = require("../middleware/auth");

// ADD FEEDBACK (protected - mentor only)
router.post("/", auth, async (req, res) => {
  try {
    const { submission_id, comment, score } = req.body;

    if (!submission_id || !comment) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await Feedback.create({
      submission_id,
      comment,
      score: score || null
    });

    // ALSO UPDATE STATUS
    await Submission.findByIdAndUpdate(submission_id, { status: "reviewed" });

    res.json({ message: "Feedback added" });

  } catch (err) {
    console.log("FEEDBACK ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;