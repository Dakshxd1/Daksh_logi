import db from "../db.js";

export const getCustomers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM customers WHERE is_active='Y'"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createCustomer = async (req, res) => {
  try {
    const {
      cust_id,
      cust_name,
      cust_address,
      cust_pan,
      cust_gst,
      is_active
    } = req.body;

    await db.query(
      `INSERT INTO customers
       (cust_id, cust_name, cust_address, cust_pan, cust_gst, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [cust_id, cust_name, cust_address, cust_pan, cust_gst, is_active]
    );

    res.json({ message: "Customer added successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { cust_name, cust_address, cust_pan, cust_gst } = req.body;

    await db.query(
      `UPDATE customers
       SET cust_name=?, cust_address=?, cust_pan=?, cust_gst=?
       WHERE id=?`,
      [cust_name, cust_address, cust_pan, cust_gst, id]
    );

    res.json({ message: "Customer updated" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "UPDATE customers SET is_active='N' WHERE id=?",
      [id]
    );

    res.json({ message: "Customer deactivated" });
  } catch (err) {
    res.status(500).json(err);
  }
};
