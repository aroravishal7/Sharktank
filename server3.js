var express=require("express");
var mysql2=require("mysql2");
var fileupload=require("express-fileupload");
var app=express();
var path=require("path");
app.use(fileupload());
app.use(express.urlencoded(true)); // it convert post data to json object



app.listen(2006,function(){
    console.log("Server start");
})
app.get("/",function(request,response){

     var filepath=__dirname+"/public/index.html";
     response.sendFile(filepath);
    })
    app.get("/admindash",function(request,response){

        var filepath=__dirname+"/public/admin-dash.html";
        response.sendFile(filepath);
       })
       app.get("/fetchone",function(request,response){

        var filepath=__dirname+"/public/allpitcher.html";
        response.sendFile(filepath);
       })
    app.use(express.static("public"));
    const config={
        host:"127.0.0.1",
        user:"root",
        password:"13131313",
        database:"frst",
        dateStrings:true,
       // timezone: 'ist'
    }
    var mysqldb=mysql2.createConnection(config);
    mysqldb.connect(function(err){
        if(err==null)
        console.log("connected to database successfully");
    else
    console.log(err.message);
    })
    
   app.get("/do-signup",function(request,response){
    
    console.log("sign-in ");
    var email=request.query.email;
    var pwd=request.query.pwd;
     var cb=request.query.cb;
     var statue=1;
     mysqldb.query("insert into users4 values(?,?,?,current_date(),?)",[email,pwd,cb,statue],function(err){
        
         if(err==null)
         response.send("Data save");
     else
     response.send(err.message);
     })
   })
   app.get("/do-login",function(request,resp){
    console.log(request.query);
    var email=request.query.email;
    var pwd=request.query.pwd;
    mysqldb.query("select utype,status from users4 where emailid=? and password=?",[email,pwd],function(err,result){
        //console.log(err.message);
    

        if(err==null)
       // response.send("login succeesss");
         {
            
         if(result.length==1 && result[0].status==1)
            {
             resp.send(result[0].utype);
            }
            else if(result.length==1 && result[0].status==0)
            {
             resp.send("Blocked");
            }
            else 
            {
                resp.send("invalid id/password");
            }
         }
    else
    resp.send(err.message);
    })
   })
   app.post("/saved",function(request,response){
    
    console.log(request.body);
    var filename="nopic.jpg";
    if(request.files!=null)
    {
        var filename=request.body.email2+"-"+request.files.ppic.name;
        var filepath=path.join(__dirname,"public","uploads",filename);
        request.files.ppic.mv(filepath);
    }
    var email=request.body.email2;
    var name=request.body.txtname;
    var number=request.body.txtnumber;
    var address=request.body.txtaddress;
    var city=request.body.txtcity;
    var state=request.body.txtstate;
    var id=request.body.txtid;
    var firm=request.body.txtfirm;
    var linkedin=request.body.txtlinkedin;
    mysqldb.query("insert into kprofile values(?,?,?,?,?,?,?,?,?,?)",[email,name,number,address,city,state,id,filename,firm,linkedin],function(err){
        if(err==null)
        response.send("data saved");
    else
    response.send(err.message);
    })
   })
   app.post("/updated",function(request,response){
    console.log(request.body);
    var filename="nopic.jpg";
    if(request.files!=null)
    {
        var filename=request.body.email2+"-"+request.files.ppic.name;
        var filepath=path.join(__dirname,"public","uploads",filename);
        request.files.ppic.mv(filepath);
    }
    else
     var filename=request.body.hdn;
    var a=request.body.email2;
    var b=request.body.txtname;
    var c=request.body.txtnumber;
    var d=request.body.txtaddress;
    var e=request.body.txtcity;
    var f=request.body.txtstate;
    var g=request.body.txtid;
    var h=request.body.txtfirm;
    var i=request.body.txtlinkedin;
mysqldb.query("update kprofile set name=?,contact=?,address=?,city=?,state=?,idproof=?,proofpic=?,firm=?,linkedin=?where emailid=?",[b,c,d,e,f,g,filename,h,i,a],function(err,result){
    if(err==null)
    {
        if(result.affectedRows==1)
        response.send("record update");
    else
    response.send("invalid id");
    }
    else
    response.send(err.message);
});
   })
   app.get("/get-user-json",function(request,response)
   {
    var email=request.query.email;
    mysqldb.query("select * from kprofile where emailid=?",[email],function(err,result)
    {
    //     if(result.length==1)
    //     {
    //     response.send("already exists");
        
    // }else 
    //     {
    //    response.send("its available");
    //     }

        if(err==null)
        {
      
          
             response.send(result);
        }
        else
        response.send(err.message);
    });
   })
   app.post("/do-change",function(request,response){
    var emailid=request.body.txtemail;
   var opwd=request.body.txtpwd;
    var npwd=request.body.txtpwd1;
    var cpwd=request.body.txtpwd2;
    if(npwd==cpwd)
    {
        mysqldb.query("update users4 set password=? where emailid=? and password=?",[npwd,emailid,opwd],function(err,result){
            if(err==null)
            {
                if(result.affectedRows==1)
                response.send("password changed..");
            else
            response.send("invalid id");
            }
            else
            response.send(err.message);
        })
    }
   })
   app.all("/show-all",function(request,response){
    
   
     mysqldb.query("select * from users4",function(err,result){
        
         if(err==null)
         response.send(result);
     else
     response.send(err.message);
     })
   })
   app.get("/do-block",function(request,response){
    var emailid=request.query.emailid;
    var status=request.query.status;
    mysqldb.query("update users4 set status=0 where emailid=?",[emailid,status],function(err,result){
        if(err==null)
        {
            if(result.affectedRows==1)
            response.send("blocked");
        else
        response.send("invalid id");
        }
        else
        response.send(err.message);
    })
   })
   app.get("/do-resume",function(request,response){
    var emailid=request.query.emailid;
    var status=request.query.status;
    mysqldb.query("update users4 set status=1 where emailid=?",[emailid,status],function(err,result){
        if(err==null)
        {
            if(result.affectedRows==1)
            response.send("resume");
        else
        response.send("invalid id");
        }
        else
        response.send(err.message);
    })
   })
   app.all("/show-all2",function(request,response){
    
   
    mysqldb.query("select * from kprofile",function(err,result){
       
        if(err==null)
        response.send(result);
    else
    response.send(err.message);
    })
  })
  app.post("/do-saved",function(request,response){
    console.log(request.body);
    var email=request.body.email;
    var category=request.body.category;
    var title=request.body.title;
    var min=request.body.min;
    var max=request.body.max;
    var other=request.body.other;
    mysqldb.query("insert into idea values(?,?,?,?,?,?)",[email,category,title,min,max,other],function(err){
        if(err==null)
        response.send("data saved");
    else
    response.send(err.message);
    })
  })
  app.all("/fetch-city",function(request,response){
    
   
    mysqldb.query("select distinct city from kprofile",function(err,result){
       
        if(err==null)
        response.send(result);
    else
    response.send(err.message);
    })
  })
  app.get("/fetch-one",function(request,response){
    var city=request.query.city;
    mysqldb.query("select * from kprofile where city=?",[city],function(err,result){
        response.send(result);
    });
  })

  ////////////////////////////////////
  app.get("/fetch-category",function(request,response){
    var cat=request.query.category;
    var min=request.query.min;
    var max=request.query.max;
    
    mysqldb.query("select * from idea where category=? AND min>=? AND max<=?",[cat,min,max],function(err,result){
        response.send(result);
    });
  })
  app.all("/fetch-cat",function(request,response){
    
   
    mysqldb.query("select * from idea",function(err,result){
       //console.log(result);
        if(err==null)
        response.send(result);
    else
    response.send(err.message);
    })
  })
  app.get("/fetch-ho",function(req,resp){
    var emailid=req.query.email;
   // console.log(emailid);
    mysqldb.query("select * from kprofile where emailid =? ",[emailid],function(err,result)
    {  
  
      if(err==null)
          {
            
            resp.send(result);
          //  console.log(JSON.stringify(result));
            
             
            
          }
     
    else
        resp.send(err.message);
      
    });
  })
  app.post("/do-ssaved",function(request,response){
    console.log(request.body);
    var emailid=request.body.emaill;
    var name=request.body.name;
    var company=request.body.company;
    var contact=request.body.contact;
    var website=request.body.website;
    var networth=request.body.networth;
    var qty=request.body.qty;
    var otherinfo=request.body.otherinfo;
    mysqldb.query("insert into shark values(?,?,?,?,?,?,?,?)",[emailid,name,company,contact,website,networth,qty,otherinfo],function(err){
        if(err==null)
        response.send("data saved");
    else
    response.send(err.message);
    })
  })
  app.all("/do-supdated",function(request,response){
    console.log(request.body);
    var emailid=request.body.emaill;
    var name=request.body.name;
    var company=request.body.company;
    var contact=request.body.contact;
    var website=request.body.website;
    var networth=request.body.networth;
    var qty=request.body.qty;
    var otherinfo=request.body.otherinfo;
    mysqldb.query("update shark set name=?,company=?,contact=?,website=?,networth=?,already=?,otherinfo=? where emailid=?",[name,company,contact,website,networth,qty,otherinfo,emailid],function(err){
        if(err==null)
        response.send("data update");
    else
    response.send(err.message);
    })
  })
  app.get("/ssaved",function(request,response){
    // browser will send data to server through query string will be convert in json object(json stands for java script obj notation) 
   //response.send(process.cwd()); // it is used for taking a folder 
   //response.send(__filename) // it is used for taking a file
  // response.contentType("text/html");  // it converts text to html of response
//response.write(__dirname);
//response.end();

//response.send("****");
response.sendFile(__dirname+"/public/shark-profile.html");

})
 app.all("/fetch-sf",function(request,response){
   
    var nw=request.query.nw;
    var fc=request.query.fc;
    
    mysqldb.query("select * from shark where networth>=? AND already<=?",[nw,fc],function(err,result){
        response.send(result);
    });
  })
  app.get("/fetch-hoo",function(req,resp){
    var emailid=req.query.emailid;
   // console.log(emailid);
    mysqldb.query("select * from shark where emailid =? ",[emailid],function(err,result)
    {  
  
      if(err==null)
          {
            
            resp.send(result);
          //  console.log(JSON.stringify(result));
            
             
            
          }
     
    else
        resp.send(err.message);
      
    });
  })
  app.post("/do-changee",function(request,response){
    var emailid=request.body.txtemail;
   var opwd=request.body.txtpwd;
    var npwd=request.body.txtpwd1;
    var cpwd=request.body.txtpwd2;
    if(npwd==cpwd)
    {
        mysqldb.query("update users4 set password=? where emailid=? and password=?",[npwd,emailid,opwd],function(err,result){
            if(err==null)
            {
                if(result.affectedRows==1)
                response.send("password changed..");
            else
            response.send("invalid id");
            }
            else
            response.send(err.message);
        })
    }
   })
   app.all("/get-user-json1",function(request,response)
   {
    var email=request.query.email;
    mysqldb.query("select * from shark where emailid=?",[email],function(err,result)
    {
    //     if(result.length==1)
    //     {
    //     response.send("already exists");
        
    // }else 
    //     {
    //    response.send("its available");
    //     }

        if(err==null)
        {
      
          
             response.send(result);
        }
        else
        response.send(err.message);
    });
   })