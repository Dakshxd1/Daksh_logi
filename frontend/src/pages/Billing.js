import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Box,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider
} from "@mui/material";

import jsPDF from "jspdf";
import "jspdf-autotable";

function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    api.get("/invoices").then(res => setInvoices(res.data));
  }, []);

  const filtered = invoices.filter(inv =>
    inv.invoice_id.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 EXPORT PDF
  const exportPDF = (inv) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("INVOICE", 14, 20);

    doc.setFontSize(11);
    doc.text(`Invoice ID: ${inv.invoice_id}`, 14, 35);
    doc.text(`Customer ID: ${inv.customer_id}`, 14, 45);
    doc.text(`Subtotal: ₹${inv.subtotal}`, 14, 55);
    doc.text(`GST: ₹${inv.gst}`, 14, 65);
    doc.text(`Total Amount: ₹${inv.total}`, 14, 75);

    doc.text(`Generated On: ${new Date(inv.created_at).toLocaleString()}`, 14, 90);

    doc.save(`${inv.invoice_id}.pdf`);
  };

  return (
    <div style={{ marginLeft: 300, padding: 20 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Billing / Invoices
      </Typography>

      {/* SEARCH */}
      <TextField
        placeholder="Search invoice..."
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* INVOICE LIST */}
      <Box>
        {filtered.map(inv => {
          const isActive = activeId === inv.id;

          return (
            <Box
              key={inv.id}
              onClick={() => {
                setActiveId(inv.id);
                setSelectedInvoice(inv);
              }}
              sx={{
                p: 2,
                mb: "4px",
                cursor: "pointer",
                borderRadius: "8px",
                backgroundColor: isActive ? "#1976d2" : "#fff",
                color: isActive ? "#fff" : "#000",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "#fff"
                }
              }}
            >
              <Typography fontWeight="bold">
                Invoice ID: {inv.invoice_id}
              </Typography>
              <Typography fontSize="13px">
                Customer ID: {inv.customer_id}
              </Typography>
              <Typography fontSize="13px">
                Total: ₹{inv.total}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* INVOICE DETAIL POPUP */}
      <Dialog
        open={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle fontWeight="bold">
          Invoice Details
        </DialogTitle>

        <Divider />

        <DialogContent>
          {selectedInvoice && (
            <Box sx={{ lineHeight: 2 }}>
              <Typography><b>Invoice ID:</b> {selectedInvoice.invoice_id}</Typography>
              <Typography><b>Customer ID:</b> {selectedInvoice.customer_id}</Typography>
              <Typography><b>Subtotal:</b> ₹{selectedInvoice.subtotal}</Typography>
              <Typography><b>GST:</b> ₹{selectedInvoice.gst}</Typography>
              <Typography fontWeight="bold" mt={1}>
                Total Amount: ₹{selectedInvoice.total}
              </Typography>
              <Typography color="text.secondary" mt={1}>
                Created At: {new Date(selectedInvoice.created_at).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => exportPDF(selectedInvoice)}
            variant="outlined"
          >
            Export PDF
          </Button>

          <Button
            variant="contained"
            onClick={() => setSelectedInvoice(null)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Billing;
