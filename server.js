const express = require("express");
const app = express();

const path = require("path");
app.use(
  "/public",
  express.static(path.join(__dirname, "public"))
);

let port = 4000;
app.listen(port, () => {
  console.log(`server running on part ${port}`);
});
