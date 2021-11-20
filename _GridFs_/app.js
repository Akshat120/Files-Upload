require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
 
// Middleware
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(methodOverride('_method'))

const mongoURI = process.env.CONNECTIONSTRING;
const conn =  mongoose.createConnection(mongoURI);

let gridFSBucket;
let gfs;

conn.once('open',()=>{
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'uploads'});
})

const storage = new GridFsStorage({
    url:mongoURI, 
    file:(req,file)=>{
        return new Promise((resolve,reject)=>{
            crypto.randomBytes(16,(err,buf)=>{
                if(err) return reject(err);

                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            })
        })
    },
})
const upload = multer({storage}); 

// routes

app.get('/',(req,res)=>{
    gfs.files.find().toArray((err,files)=>{
        if(!files || files.length==0)
        {
            res.render('index',{files:false});
        }
        else
        {
             files.map(file=>{
                 if(file.contentType === "image/jpeg" || file.contentType === "image/png")
                 {
                    file.isImage = true;
                 } else {
                    file.isImage = false; 
                 }
             });
             res.render('index',{files:files});
        }
    })
});

app.post('/upload',upload.single('file'),(req,res)=>{
    //res.json({file:req.file});
    res.redirect('/');
});

app.get('/files',(req,res)=>{
    gfs.files.find().toArray((err,files)=>{
        if(!files || files.length==0)
        {
            return res.status(404).json({
                err : "No Files Exists" 
            });
        }
        else
        {
            return res.json(files);
        }
    })  
})

app.get('/files/:filename',(req,res)=>{
    gfs.files.findOne({filename:req.params.filename},(err, file)=>{
        if(!file || file.length==0)
        {
             return res.status(404).json({
                err : "No Files Exists" 
            });
        } 
        
        return res.json(file);
    })  
})

app.get('/image/:filename',(req,res)=>{
    gfs.files.findOne({filename:req.params.filename},(err, file)=>{
        if(!file || file.length==0)
        {
             return res.status(404).json({
                err : "No Files Exists" 
            });
        } 
        
        if(file.contentType === "image/jpeg" || file.contentType === "image/png" )
        {
            const  readstream = gridFSBucket.openDownloadStream(file._id);
            readstream.pipe(res);  
        } else {
            res.status(404).json({
                err: "Not an image"
            })
        }
    }); 
});


// listen
app.listen(3000,()=>{
    console.log("Server Started.");
})


