import db from "../db.js";
import generateInvoiceId from "../utils/generateInvoiceId.js";

/**
 * CREATE INVOICE
 * GST RULE:
 * - If customer HAS GST number → GST = 0
 * - If customer DOES NOT have GST → 18%
 */
export const createInvoice = async (req, res) => {
  try {
    const { customerId, items } = req.body;

    // 1️⃣ Get customer GST
    const [[customer]] = await db.query(
      "SELECT cust_gst FROM customers WHERE id = ?",
      [customerId]
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // 2️⃣ Calculate subtotal
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.price * item.quantity;
    });

    // 3️⃣ GST logic
    const gst = customer.cust_gst ? 0 : subtotal * 0.18;
    const total = subtotal + gst;

    // 4️⃣ Generate invoice ID
    const invoiceId = generateInvoiceId();

    // 5️⃣ Insert invoice
    const [invoiceResult] = await db.query(
      `INSERT INTO invoices
       (invoice_id, customer_id, subtotal, gst, total)
       VALUES (?, ?, ?, ?, ?)`,
      [invoiceId, customerId, subtotal, gst, total]
    );

    const invoiceDbId = invoiceResult.insertId;

    // 6️⃣ Insert invoice items
    for (const item of items) {
      await db.query(
        `INSERT INTO invoice_items
         (invoice_id, item_id, quantity, price, total)
         VALUES (?, ?, ?, ?, ?)`,
        [
          invoiceDbId,
          item.itemId,
          item.quantity,
          item.price,
          item.price * item.quantity
        ]
      );
    }

    res.json({
      invoiceId,
      subtotal,
      gst,
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Invoice creation failed" });
  }
};

/**
 * GET ALL INVOICES
 */
export const getAllInvoices = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM invoices ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * GET INVOICE BY INVOICE ID
 */
export const getInvoiceById = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const [[invoice]] = await db.query(
      "SELECT * FROM invoices WHERE invoice_id = ?",
      [invoiceId]
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (err) {
    res.status(500).json(err);
  }
};

/**
 * GET INVOICES BY CUSTOMER
 */
export const getInvoicesByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM invoices WHERE customer_id = ? ORDER BY created_at DESC",
      [customerId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};
