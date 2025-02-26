import mongoose from "mongoose";

const ParentSchema = mongoose.Schema({
    name :{
        type:String,
        required :true
    },
    email :{
        type:String,
        unique: true,
        required :true
    },
    password: {
        type:String,
        required:true
    },
    role: {
        type:String,
        required:true,
        default: 'parent'
    },
    isverified :{
        type:Boolean,
        default: false
    },
    
    passwordResetToken:String,
    passwordResetTokenExpiresAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date,
},{timestamps:true})
const Parent =  mongoose.model("Parents",ParentSchema) 
export default Parent
// lastLogin:Date.now,