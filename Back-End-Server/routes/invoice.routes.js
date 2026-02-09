import express from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  getInvoicesByCustomer
} from "../controllers/invoice.controller.js";

const router = express.Router();

router.post("/create", createInvoice);
router.get("/", getAllInvoices);
router.get("/:invoiceId", getInvoiceById);
router.get("/by-customer/:customerId", getInvoicesByCustomer);

export default router;
