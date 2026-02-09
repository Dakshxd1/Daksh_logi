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

function Items() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    item_code: "",
    item_name: "",
    selling_price: "",
    is_active: "Y"
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    api.get("/items").then(res => setItems(res.data));
  };

  const openEdit = (item) => {
    setForm(item);
    setEditing(true);
    setOpen(true);
  };

  const saveItem = () => {
    const apiCall = editing
      ? api.put(`/items/${form.id}`, form)
      : api.post("/items", form);

    apiCall.then(() => {
      loadItems();
      setOpen(false);
      setEditing(false);
    });
  };

  const toggleActive = (item) => {
    api.put(`/items/${item.id}`, {
      ...item,
      is_active: item.is_active === "Y" ? "N" : "Y"
    }).then(loadItems);
  };

  return (
    <div style={{ marginLeft: 300, padding: 20 }}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" fontWeight="bold">Item Master</Typography>
        <Button variant="contained" onClick={() => {
          setForm({
            item_code: "",
            item_name: "",
            selling_price: "",
            is_active: "Y"
          });
          setEditing(false);
          setOpen(true);
        }}>
          + Add Item
        </Button>
      </Box>

      {items.map(item => (
        <Box
          key={item.id}
          sx={{
            p: 2,
            mt: 1,
            borderRadius: 2,
            background: item.is_active === "Y" ? "#e3f2fd" : "#ffebee"
          }}
        >
          <Typography fontWeight="bold">{item.item_name}</Typography>
          <Typography>₹ {item.selling_price}</Typography>

          <Box mt={1} display="flex" justifyContent="space-between">
            <Button size="small" onClick={() => openEdit(item)}>Edit</Button>
            <Switch
              checked={item.is_active === "Y"}
              onChange={() => toggleActive(item)}
            />
          </Box>
        </Box>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editing ? "Edit Item" : "Add Item"}</DialogTitle>
        <DialogContent>
          <TextField label="Item Code" fullWidth margin="dense"
            value={form.item_code}
            onChange={e => setForm({ ...form, item_code: e.target.value })} />

          <TextField label="Item Name" fullWidth margin="dense"
            value={form.item_name}
            onChange={e => setForm({ ...form, item_name: e.target.value })} />

          <TextField label="Selling Price" fullWidth margin="dense" type="number"
            value={form.selling_price}
            onChange={e => setForm({ ...form, selling_price: e.target.value })} />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveItem}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Items;
