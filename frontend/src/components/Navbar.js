import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Typography
  } from "@mui/material";
  
  import DashboardIcon from "@mui/icons-material/Dashboard";
  import InventoryIcon from "@mui/icons-material/Inventory";
  import ReceiptIcon from "@mui/icons-material/Receipt";
  import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
  
  import { Link, useLocation } from "react-router-dom";
  
  const drawerWidth = 260;
  
  function Navbar() {
    const location = useLocation();
  
    const menuItems = [
      {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/"
      },
      {
        text: "Master",
        icon: <InventoryIcon />,
        path: "/master"
      },
      {
        text: "Create Invoice",
        icon: <AddCircleOutlineIcon />,
        path: "/create-invoice"
      },
      {
        text: "Billing",
        icon: <ReceiptIcon />,
        path: "/billing"
      }
    ];
  
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f4f6f8",
            borderRight: "none",
            padding: "16px 12px"
          }
        }}
      >
        {/* Floating sidebar */}
        <Box
          sx={{
            height: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            paddingTop: 3
          }}
        >
          {/* Title */}
          <Typography
            variant="h6"
            align="center"
            fontWeight="bold"
            sx={{ mb: 3 }}
          >
            Billing System
          </Typography>
  
          <List>
            {menuItems.map(item => {
              const isActive = location.pathname === item.path;
  
              return (
                <ListItem
                  key={item.text}
                  button
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: "12px",
                    mx: 1,
                    mb: 0.5,
                    backgroundColor: isActive ? "#1976d2" : "transparent",
                    color: isActive ? "#fff" : "#000",
                    "&:hover": {
                      backgroundColor: "#1976d2",
                      color: "#fff"
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#fff" : "#000",
                      minWidth: "40px"
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
  
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: "bold"
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    );
  }
  
  export default Navbar;
  