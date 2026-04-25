const router = require("express").Router();
const db = require("../db");

// GET LEADERBOARD
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        s.mentee_id,
        u.name,
        COUNT(s.id) AS total_submissions
      FROM submissions s
      LEFT JOIN users u ON s.mentee_id = u.id
      GROUP BY s.mentee_id, u.name
      ORDER BY total_submissions DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;