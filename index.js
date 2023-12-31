require("dotenv").config();

const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middleware/errorMiddleware");
const connection = require("./database/db");

const userRoute = require("./routes/userRoutes");
const departmentRoute = require("./routes/departmentRoutes");
const districtRoutes=require('./routes/districtRoutes');
const complainRoutes=require('./routes/complainRoutes');
const analyticsRoutes=require("./routes/analyticsRoutes");

const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("hello!!!!");
});

app.use("/user", userRoute);
app.use("/dept", departmentRoute);
app.use("/dist",districtRoutes);
app.use("/comp",complainRoutes);

app.use("/analytics",analyticsRoutes);


app.use(errorMiddleware);

connection();
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
