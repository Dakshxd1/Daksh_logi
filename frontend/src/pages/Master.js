import { Card, CardContent, Typography, Grid } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useNavigate } from "react-router-dom";

function Master() {
  const navigate = useNavigate();

  return (
    <div style={{ marginLeft: 300, padding: 20 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Master
      </Typography>

      <Grid container spacing={3}>

        {/* Customer Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{ cursor: "pointer", borderRadius: 2 }}
            onClick={() => navigate("/customers")}
          >
            <CardContent>
              <PeopleIcon fontSize="large" />
              <Typography variant="h6" fontWeight="bold">
                Customers
              </Typography>
              <Typography color="text.secondary">
                Add or view customer data
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Item Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{ cursor: "pointer", borderRadius: 2 }}
            onClick={() => navigate("/items")}
          >
            <CardContent>
              <InventoryIcon fontSize="large" />
              <Typography variant="h6" fontWeight="bold">
                Items
              </Typography>
              <Typography color="text.secondary">
                Add or view item data
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </div>
  );
}

export default Master;
