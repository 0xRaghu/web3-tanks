const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mapRoutes = require("./routes/mapRoutes");
const tankRoutes = require("./routes/tankRoutes");
const simulateRoutes = require("./routes/simulateRoutes");
const metadataRoutes = require("./routes/metadataRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const scoreRoutes = require("./routes/scoreRoutes");

app.use("/map", mapRoutes);
app.use("/tank", tankRoutes);
app.use("/simulate", simulateRoutes);
app.use("/metadata", metadataRoutes);
app.use("/token", tokenRoutes);
app.use("/score", scoreRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
