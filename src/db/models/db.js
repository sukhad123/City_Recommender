import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,    
  },
  email: {
    type: String,
    required: true,
    unique: true,     
  },
  age: {
    type: Number,
    default: 18,      
  },
}, { timestamps: true }); 

export default mongoose.models.User || mongoose.model("User", UserSchema);
