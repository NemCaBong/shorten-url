// const mongoose = require("mongoose");

// dùng từ khóa import thì k thấy module nó sẽ
// tự báo lỗi
import mongoose from "mongoose";

// cú pháp ES6
export const connect = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connect success");
  } catch (error) {
    console.log("Connect failed ", error);
  }
};
