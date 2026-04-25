const router = require("express").Router();
const db = require("../db");
const auth = require("../middleware/auth");


// GET ALL SUBMISSIONS WITH FEEDBACK (JOIN)
// Supports ?mentee_id=X for filtering
router.get("/", async (req, res) => {
  try {
    const { mentee_id } = req.query;

    let query = `
      SELECT 
        s.id,
        s.challenge_id,
        s.mentee_id,
        s.answer,
        s.status,
        s.created_at,
        f.comment,
        f.score
      FROM submissions s
      LEFT JOIN feedback f 
      ON s.id = f.submission_id
    `;

    const params = [];

    if (mentee_id) {
      query += " WHERE s.mentee_id = $1";
      params.push(mentee_id);
    }

    query += " ORDER BY s.id DESC";

    const result = await db.query(query, params);

    res.json(result.rows);

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

    await db.query(
      "INSERT INTO submissions(challenge_id, mentee_id, answer, status) VALUES($1,$2,$3,$4)",
      [challenge_id, mentee_id, answer, "pending"]
    );

    res.json({ message: "Submission successful" });

  } catch (err) {
    console.log("POST ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


// EXPORT ROUTER
module.exports = router;