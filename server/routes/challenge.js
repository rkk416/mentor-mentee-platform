const router = require("express").Router();
const db = require("../db");
const auth = require("../middleware/auth");

// CREATE CHALLENGE (protected - mentor only)
router.post("/create", auth, async (req, res) => {
  try {
    const { mentor_id, title, description, subject, difficulty, deadline, session_id } = req.body;

    if (!mentor_id || !title || !description) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await db.query(
      "INSERT INTO challenges(mentor_id,title,description,subject,difficulty,deadline,session_id) VALUES($1,$2,$3,$4,$5,$6,$7)",
      [mentor_id, title, description, subject || null, difficulty || null, deadline || null, session_id || null]
    );

    res.json({ message: "Challenge Created ✅" });

  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


// GET ALL CHALLENGES
router.get("/all", async (req, res) => {
  try {

    const result = await db.query(`
      SELECT 
        c.*, 
        s.title AS session_title
      FROM challenges c
      LEFT JOIN sessions s ON c.session_id = s.id
      ORDER BY c.id DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.log("FETCH ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;