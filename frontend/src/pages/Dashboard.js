import { useEffect, useState } from "react";
import api from "../services/api";
import { Grid, Card, CardContent, Typography } from "@mui/material";

function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    items: 0,
    invoices: 0,
    revenue: 0
  });

  useEffect(() => {
    Promise.all([
      api.get("/customers"),
      api.get("/items"),
      api.get("/invoices")
    ]).then(([c, i, inv]) => {
      setStats({
        customers: c.data.length,
        items: i.data.length,
        invoices: inv.data.length,
        revenue: inv.data.reduce((sum, x) => sum + Number(x.total), 0)
      });
    });
  }, []);

  const CardBox = ({ title, value }) => (
    <Card>
      <CardContent>
        <Typography fontWeight="bold">{title}</Typography>
        <Typography variant="h5">{value}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ marginLeft: 300, padding: 20 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}><CardBox title="Customers" value={stats.customers} /></Grid>
        <Grid item xs={12} md={3}><CardBox title="Items" value={stats.items} /></Grid>
        <Grid item xs={12} md={3}><CardBox title="Invoices" value={stats.invoices} /></Grid>
        <Grid item xs={12} md={3}><CardBox title="Revenue" value={`₹${stats.revenue}`} /></Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
