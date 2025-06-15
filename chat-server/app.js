const express = require("express");
const morgan=require("morgan");
const routes=require("./routes/index");
const app=express(); 
const rateLimit=require("express-rate-limit");
const helmet=require("helmet");
const mongosanitize=require("express-mongo-sanitize");
const bodyParser=require("body-parser");
const xss=require("xss");
const cors= require("cors");

// app.use(express.urlencoded({extended:true}));

// app.use(mongosanitize());

// app.use(xss());


app.use(cors({
    origin:"*",
    methods:["GET","PATCH","POST","DELETE","PUT"],
    credentials:true
}))

app.use(express.json({limit:"10kb"}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

app.use(helmet());

if(process.env.NODE_ENV==="devlopment"){
    app.use(morgan("dev"));
}

const limiter=rateLimit({
    max:3000,
    windowMs: 60 *60*1000,//in one hour
    message:"To many requests from this Ip,Please try agin in one hour"
})

app.use(routes);

app.use("./talkkk",limiter);



module.exports=app;