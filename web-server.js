/* eslint-disable no-console */
const express = require("express");
const { join } = require("path");
const morgan = require("morgan");
const serveStatic = require("serve-static");
const app = express();

var staticPage = serveStatic('dist', {})
app.use(staticPage)

app.use(morgan("dev"));
app.use(express.static(join(__dirname, "dist")));

app.use((_, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.listen(3000, () => console.log("Listening on port 3000"));


app.get(/^((?!\/api\/).)*$/, function (req, res) {
  res.sendFile(__dirname + '/dist/index.html')
});