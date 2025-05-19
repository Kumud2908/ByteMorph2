import mongoose from "mongoose";
const fileSchema=new mongoose.Schema(
    {
        fileName:{type:String,required:true},
        fileUrl:{type:String,required:true},
        fileType:{type:String,required:false},
        

    },
    {timestamps:true}
);

const File=mongoose.model("File",fileSchema);
export default File
