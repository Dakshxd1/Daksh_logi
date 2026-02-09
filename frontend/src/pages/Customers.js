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
  Switch
} from "@mui/material";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    id: null,
    cust_id: "",
    cust_name: "",
    cust_address: "",
    cust_pan: "",
    cust_gst: "",
    is_active: "Y"
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    api.get("/customers").then(res => setCustomers(res.data));
  };

  const openEdit = (c) => {
    setForm(c);
    setEditing(true);
    setOpen(true);
  };

  const validate = () => {
    if (!PAN_REGEX.test(form.cust_pan)) {
      alert("Invalid PAN format");
      return false;
    }
    if (!GST_REGEX.test(form.cust_gst)) {
      alert("Invalid GST format");
      return false;
    }
    return true;
  };

  const saveCustomer = () => {
    if (!validate()) return;

    const apiCall = editing
      ? api.put(`/customers/${form.id}`, form)
      : api.post("/customers", form);

    apiCall.then(() => {
      loadCustomers();
      setOpen(false);
      setEditing(false);
    });
  };

  const toggleActive = (c) => {
    api.put(`/customers/${c.id}`, {
      ...c,
      is_active: c.is_active === "Y" ? "N" : "Y"
    }).then(loadCustomers);
  };

  return (
    <div style={{ marginLeft: 300, padding: 20 }}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" fontWeight="bold">
          Customer Master
        </Typography>
        <Button variant="contained" onClick={() => {
          setForm({
            cust_id: "",
            cust_name: "",
            cust_address: "",
            cust_pan: "",
            cust_gst: "",
            is_active: "Y"
          });
          setEditing(false);
          setOpen(true);
        }}>
          + Add Customer
        </Button>
      </Box>

      {customers.map(c => (
        <Box
          key={c.id}
          sx={{
            p: 2,
            mt: 1,
            borderRadius: 2,
            background: c.is_active === "Y" ? "#e3f2fd" : "#ffebee"
          }}
        >
          <Typography fontWeight="bold">{c.cust_name}</Typography>
          <Typography fontSize="13px">{c.cust_address}</Typography>
          <Typography fontSize="13px">PAN: {c.cust_pan}</Typography>
          <Typography fontSize="13px">GST: {c.cust_gst}</Typography>

          <Box mt={1} display="flex" justifyContent="space-between">
            <Button size="small" onClick={() => openEdit(c)}>Edit</Button>
            <Box display="flex" alignItems="center">
              <Typography fontSize="12px">Active</Typography>
              <Switch
                checked={c.is_active === "Y"}
                onChange={() => toggleActive(c)}
              />
            </Box>
          </Box>
        </Box>
      ))}

      {/* DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editing ? "Edit Customer" : "Add Customer"}</DialogTitle>
        <DialogContent>
          <TextField label="Customer ID" fullWidth margin="dense"
            value={form.cust_id}
            onChange={e => setForm({ ...form, cust_id: e.target.value })} />

          <TextField label="Customer Name" fullWidth margin="dense"
            value={form.cust_name}
            onChange={e => setForm({ ...form, cust_name: e.target.value })} />

          <TextField label="Address" fullWidth margin="dense"
            value={form.cust_address}
            onChange={e => setForm({ ...form, cust_address: e.target.value })} />

          <TextField label="PAN" fullWidth margin="dense"
            value={form.cust_pan}
            onChange={e => setForm({ ...form, cust_pan: e.target.value.toUpperCase() })} />

          <TextField label="GST" fullWidth margin="dense"
            value={form.cust_gst}
            onChange={e => setForm({ ...form, cust_gst: e.target.value.toUpperCase() })} />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveCustomer}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Customers;
