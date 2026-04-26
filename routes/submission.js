const router = require("express").Router();
const Submission = require("../models/Submission");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

// GET ALL SUBMISSIONS WITH FEEDBACK (JOIN)
// Supports ?mentee_id=X for filtering
router.get("/", async (req, res) => {
  try {
    const { mentee_id } = req.query;

    let matchStage = {};
    if (mentee_id) {
      matchStage.mentee_id = new mongoose.Types.ObjectId(mentee_id);
    }

    const result = await Submission.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "feedbacks",
          localField: "_id",
          foreignField: "submission_id",
          as: "feedback"
        }
      },
      {
        $unwind: {
          path: "$feedback",
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const mapped = result.map(s => ({
      id: s._id,
      challenge_id: s.challenge_id,
      mentee_id: s.mentee_id,
      answer: s.answer,
      status: s.status,
      created_at: s.createdAt,
      comment: s.feedback ? s.feedback.comment : null,
      score: s.feedback ? s.feedback.score : null
    }));

    res.json(mapped);

  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


// CREATE SUBMISSION (protected - mentee only)
router.post("/", auth, async (req, res) => {
  try {
    const { challenge_id, mentee_id, answer } = req.body;

    if (!challenge_id || !mentee_id || !answer) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await Submission.create({
      challenge_id,
      mentee_id,
      answer,
      status: "pending"
    });

    res.json({ message: "Submission successful" });

  } catch (err) {
    console.log("POST ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


// EXPORT ROUTER
module.exports = router;