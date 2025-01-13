const express = require("express");
const upload = require("./multer");
const cleanResponseText = require(".");
const app = express();
const cors = require("cors");
const allowedOrigins = ["http://localhost:5173"];
const corsOption = {
    origin:function(origin , callback){
        if(!origin || allowedOrigins.includes(origin)){
            callback(null , true);
        }
        else{
            console.log("blocked by origin: " , origin)
        }
    },
    credentials:true,
    optionsSuccessStatus: 200
};
app.use(express.json());
app.use(cors(corsOption));
app.post("/upload/generateContent" , upload.array("Images" , 8) , async(req , res)=>{
    const prompt = req.body;
    const files = req.files;

    if(!prompt || !files || files.length === 0){
        return res.status(400).json({
            status:"failed",
            message:"fields are missing! "
        })
    }
    const images = files.map((file)=>({
        path:file.path,
        mimeType:file.mimetype
    }))

    const content = await cleanResponseText(prompt.prompt , images);
    
    return res.status(200).json({
        status:"success",
        message:"res is sent!",
        content
    })
})

app.listen(3000 , ()=>{
    console.log("server is connected!")
})