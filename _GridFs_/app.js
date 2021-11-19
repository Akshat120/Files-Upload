const express = require('express');
const app = express();

app.get('/',(req,res)=>{
    res.send('GridFs');
});

module.exports = app;