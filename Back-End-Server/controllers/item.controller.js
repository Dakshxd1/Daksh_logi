import db from "../db.js";

export const getItems = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM items WHERE is_active='Y'"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "UPDATE items SET is_active='N' WHERE id=?",
      [id]
    );

    res.json({ message: "Item deactivated" });
  } catch (err) {
    res.status(500).json(err);
  }
};
