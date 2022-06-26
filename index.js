require("dotenv").config(); // use dotenv (.env)

const app = require("./src/app"); // require the app


const PORT = process.env.PORT || 5000; 
// const PORT = 5000
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
