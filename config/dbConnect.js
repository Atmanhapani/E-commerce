const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  try {
    const connect = mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connection Successful...");
  } 
  catch (err) {
    console.log("Database error");
  }
};

module.exports=dbConnect;
