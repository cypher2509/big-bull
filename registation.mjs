import {getDb} from './db.mjs';
import jwt from 'jsonwebtoken';
let database = await getDb();

export async function register(req,res){
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let dob = req.body.dob;
    let userName = req.body.userName;
    let password = req.body.password;
    let gameId = req.body.gameId;

    
    var db;

    let collections = (await database.listCollections().toArray());
    for (var i of collections){
        if (i.name == gameId){
            db = database.collection(gameId);
        }
    }
    if(!db){
        return res.status(400).json("Invalid gameId.")
    }

//name verification
    if(!firstName){
        return await res.status(400).json("Please enter your firstName.")
    }
    if(!lastName){
        return await res.status(400).json("Please enter your LastName.")
    }
   
   
//userName verification
    let userNamePattern = /^[a-zA-Z0-9_]+$/
    let matchedUserName = userNamePattern.exec(userName)

    if(!userName){
        return res.status(400).json("Plese enter your username.")
    }
    if(!matchedUserName){
        return res.status(400).json("User name can only include alphabets, numbers and underscore.")
    }
    let existingUsername =  await db.find({"userName":userName}).toArray();
    if(existingUsername.length ==1){
        return res.status(400).json("User name already exist.")
    }


//dob verification
   
    if(!dob){
        return await res.status(400).json("Please enter your Date of Birth.")
    }

//password verification
    let passwordPattern = /^.{8,}$/;
    let matchedPassword = passwordPattern.exec(password)

    if(!password){
        return res.status(400).json("Please enter password")
    }
    if(!matchedPassword){
        return res.status(400).json("Your password should be atleast 8 characters long.")
    }

    if(!gameId){
        return res.status(400).json("Please enter your game's id.")
    }

//starting Cash
let gameSettings = await db.find({settings:"settings"}).toArray();
let startingCash = await parseInt(gameSettings[0].startingCash);


   
//sending data


    var loginDetails = {}
    loginDetails.firstName = firstName;
    loginDetails.lastName = lastName;
    loginDetails.dob = dob;
    loginDetails.userName = userName;
    loginDetails.password = password;
    loginDetails.balance = startingCash;
    loginDetails.portfolioValue =0;
    loginDetails.portfolio = [];
    loginDetails.tradingHistory =[];
    loginDetails.watchlist = [];


    await db.insertOne(loginDetails);

    const token = jwt.sign({ userName: userName , gameId: gameId}, 'bullrun',{expiresIn: '1h'});
    res.cookie("token", token);
    return res.status(200).json({ token :token , message : 'Account created.'});
}

export async function login(req,res){
    let userName = req.body.userName;
    let password = req.body.password;
    let gameId = req.body.gameId;
    var db;

    let collections = (await database.listCollections().toArray());
    for (var i of collections){
        if (i.name == gameId){
            db = await database.collection(gameId);
        }
    }

    if(!db){
        return res.status(400).json("Invalid gameId.")
    }


    let account = await db.find({"userName":userName}).toArray();
    if(account.length==0){
        return res.status(400).json("Invalid userName.")
    }

    if(account[0].password== password){
        const token = jwt.sign({ userName: userName ,gameId: gameId}, 'bullrun',{expiresIn: '1h'});
        
        res.cookie("token", token);
        res.status(200).json({ token :token , message: 'login successful.'});
    }
    else{
        return res.status(400).json("Invalid password.")

    }
}

export async function logout(req,res){
    return res.clearCookie("token").json("cookies cleared");
}