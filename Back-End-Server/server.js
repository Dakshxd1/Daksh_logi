import express from "express";
import cors from "cors";

import customerRoutes from "./routes/customer.routes.js";
import itemRoutes from "./routes/item.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/invoices", invoiceRoutes);

app.listen(5001, () => {
  console.log("Server running on port 5001");
});
