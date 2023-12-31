const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { error } = require("console");

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    
    const data = {
        members :[
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url ="https://us21.api.mailchimp.com/3.0/lists/52537fb33d";
    const options = {
        method : "POST",
        auth : "pranit:bbaa0778e6d6a849ab50291b5d6cdacb-us21"
    };
    const request = https.request(url,options,function(response){
        response.on("data",function(data){
            const errors = JSON.parse(data).error_count;
            if (response.statusCode === 200 && errors===0){
                res.sendFile(__dirname+"/success.html");
            }
            else{
                res.sendFile(__dirname+"/failure.html");
            }     
        });
        
        
    });
    request.write(jsonData);
    request.end(); 
}); 

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(3000,function(){
    console.log("Server running!")
});

//apikey bbaa0778e6d6a849ab50291b5d6cdacb-us21
//audienceid 52537fb33d 