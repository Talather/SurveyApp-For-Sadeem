const app = require("./app");
const connectdb = require("./Models/connect");
const PORT = process.env.PORT || 4000;

connectdb();

// console.log(app);
const server = app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
