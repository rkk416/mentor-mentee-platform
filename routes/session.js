const router = require("express").Router();
const Session = require("../models/Session");
const auth = require("../middleware/auth");

// CREATE SESSION (protected)
router.post("/", auth, async (req, res) => {
  const { title, description } = req.body;

  try {
    const session = await Session.create({ title, description });
    // Map _id to id for backwards compatibility
    res.json({ ...session.toObject(), id: session._id });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET ALL SESSIONS
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find().sort({ _id: -1 }).lean();
    const mapped = sessions.map(s => ({ ...s, id: s._id }));
    res.json(mapped);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;