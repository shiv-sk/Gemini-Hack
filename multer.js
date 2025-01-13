const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination:function(req , file , cb){
        cb(null , "./temp/imgs");
    },
    filename:function(req ,file , cb){
        const ext = path.extname(file.originalname);
        const filename = `${file.fieldname}-${Date.now()}${ext}`;
        cb(null , filename);
    }
})
const upload = multer({ storage: storage })
module.exports = upload;