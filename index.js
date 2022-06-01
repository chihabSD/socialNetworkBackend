require("dotenv").config(); // use dotenv (.env)

const app = require("./src/app"); // require the app

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
