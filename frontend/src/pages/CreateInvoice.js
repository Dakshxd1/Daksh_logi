import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider
} from "@mui/material";

function CreateInvoice() {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/customers").then(res => setCustomers(res.data));
    api.get("/items").then(res => setItems(res.data));
  }, []);

  /* ---------------- CUSTOMER SELECT ---------------- */
  const selectCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  /* ---------------- ITEM ADD ---------------- */
  const addItem = (item) => {
    if (item.is_active !== "Y") return;

    setInvoiceItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const increaseQty = (id) => {
    setInvoiceItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decreaseQty = (id) => {
    setInvoiceItems(prev =>
      prev
        .map(i =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter(i => i.quantity > 0)
    );
  };

  /* ---------------- CALCULATIONS ---------------- */
  const subtotal = invoiceItems.reduce(
    (sum, i) => sum + i.selling_price * i.quantity,
    0
  );

  const gst = selectedCustomer?.cust_gst ? 0 : subtotal * 0.18;
  const total = subtotal + gst;

  /* ---------------- SUBMIT INVOICE ---------------- */
  const submitInvoice = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }

    if (invoiceItems.length === 0) {
      alert("Please add at least one item");
      return;
    }

    const payload = {
      customerId: selectedCustomer.id,
      items: invoiceItems.map(i => ({
        itemId: i.id,
        price: i.selling_price,
        quantity: i.quantity
      }))
    };

    try {
      setLoading(true);

      const res = await api.post("/invoices/create", payload);

      alert(`Invoice Created Successfully!\nInvoice ID: ${res.data.invoiceId}`);

      // reset
      setSelectedCustomer(null);
      setInvoiceItems([]);
    } catch (err) {
      alert("Failed to create invoice");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginLeft: 300, padding: 20 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Create Invoice
      </Typography>

      {/* ================= CUSTOMER ================= */}
      <Typography fontWeight="bold">Select Customer</Typography>

      {customers.map(c => (
        <Card
          key={c.id}
          onClick={() => selectCustomer(c)}
          sx={{
            mb: 1,
            cursor: "pointer",
            border:
              selectedCustomer?.id === c.id
                ? "2px solid #1976d2"
                : "1px solid #ddd",
            background:
              selectedCustomer?.id === c.id ? "#e3f2fd" : "#fff"
          }}
        >
          <CardContent>
            <Typography fontWeight="bold">{c.cust_name}</Typography>
            <Typography fontSize="13px">GST: {c.cust_gst}</Typography>
          </CardContent>
        </Card>
      ))}

      <Divider sx={{ my: 3 }} />

      {/* ================= ITEMS ================= */}
      <Typography fontWeight="bold">Select Items</Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 2
        }}
      >
        {items.map(item => {
          const available = item.is_active === "Y";

          return (
            <Card
              key={item.id}
              sx={{
                backgroundColor: available ? "#e3f2fd" : "#ffebee",
                border: available
                  ? "2px solid #1976d2"
                  : "2px solid #d32f2f"
              }}
            >
              <CardContent>
                <Typography fontWeight="bold">
                  {item.item_name}
                </Typography>
                <Typography>₹ {item.selling_price}</Typography>

                <Button
                  fullWidth
                  sx={{ mt: 1 }}
                  variant="contained"
                  disabled={!available}
                  onClick={() => addItem(item)}
                >
                  Add to Invoice
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* ================= PREVIEW ================= */}
      <Typography fontWeight="bold">Invoice Preview</Typography>

      {invoiceItems.map(i => (
        <Box
          key={i.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1
          }}
        >
          <Typography>
            {i.item_name} × {i.quantity}
          </Typography>

          <Box>
            <Button size="small" onClick={() => decreaseQty(i.id)}>−</Button>
            <Button size="small" onClick={() => increaseQty(i.id)}>+</Button>
          </Box>

          <Typography>₹ {i.selling_price * i.quantity}</Typography>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      <Typography>Subtotal: ₹ {subtotal}</Typography>
      <Typography>GST: ₹ {gst}</Typography>
      <Typography fontWeight="bold">Total: ₹ {total}</Typography>

      <Button
        fullWidth
        sx={{ mt: 3 }}
        variant="contained"
        disabled={loading}
        onClick={submitInvoice}
      >
        {loading ? "Creating Invoice..." : "Submit Invoice"}
      </Button>
    </div>
  );
}

export default CreateInvoice;
