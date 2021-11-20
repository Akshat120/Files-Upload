require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
 
// Middleware
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(methodOverride('_method'))

const mongoURI = process.env.CONNECTIONSTRING;


app.get('/',(req,res)=>{
    res.render('index') 
});


app.listen(3000,()=>{
    console.log("Server Started.");
})


