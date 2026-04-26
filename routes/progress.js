const router = require("express").Router();
const Submission = require("../models/Submission");

// GET LEADERBOARD
router.get("/", async (req, res) => {
  try {
    const result = await Submission.aggregate([
      {
        $group: {
          _id: "$mentee_id",
          total_submissions: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          mentee_id: "$_id",
          name: "$user.name",
          total_submissions: 1,
          _id: 0
        }
      },
      {
        $sort: { total_submissions: -1 }
      }
    ]);

    res.json(result);

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;