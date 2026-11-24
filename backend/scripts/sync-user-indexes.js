require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Sincronizando Índices de User....");
    const result = await User.syncIndexes();
    console.log("Índices actuales:", result);
    await mongoose.disconnect();
};

run();