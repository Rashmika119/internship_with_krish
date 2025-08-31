const express=require("express");
const app=express();

app.get("/helloworld",(req,res)=>{
    return res.send("Helloworld");
});

app.listen(5000,()=>{
    console.log('Listening on port 3000');
})
