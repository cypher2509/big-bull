import { validateHeaderValue } from 'http';
import jwt from 'jsonwebtoken';
import {getDb,closeDBConnection} from './db.mjs'
import { getPrice } from './market.mjs';

let database = await getDb();
const adminPasskey ="WolfOfWallstreet"

export async function newGame(req,res){
    let passkey = req.body.passkey;
    let gameId = req.body.gameId;
    let startingCash = req.body.startingCash;

    if(passkey!= adminPasskey){
        return res.status(400).json({data:'you are not authorised. Ask the developer for the admin password'})
    }
    if(!gameId){
        return res.status(400).json({data:'please enter an id for the game.'})
    }
    let cashPattern = ( /^\d+$/ );
    let cashPatternCorrect = cashPattern.exec(startingCash);
    if(!cashPatternCorrect){
        return res.status(400).json({message:"please enter starting amount in integers."})
    }


    let collections = (await database.listCollections().toArray());
    for (var i of collections){
        if (i.name == gameId){
            return res.status(400).json({data:"gameId already exists."})
        }
    }

    let db = await database.createCollection(gameId);
    await db.insertOne({settings:"settings",startingCash: startingCash})
    return res.status(200).json({data:"game created"})


    
}

export async function provideCash(req,res){
    let passkey = req.body.passkey;
    let gameId = req.body.gameId;
    let cash = req.body.cash;

    let db;

    if(passkey!= adminPasskey){
        return res.status(400).json({data:'you are not authorised. Ask the developer for the admin password'})
    }
    let collections = (await database.listCollections().toArray());
    for (var i of collections){
        if (i.name == gameId){
           db = await database.collection(gameId);
        }
    }

    if(!db){
        return res.status(400).json("Invalid gameId.")
    }

    let cashPattern = ( /^\d+$/ );
    let cashPatternCorrect = await cashPattern.exec(cash);
    if(!cashPatternCorrect){
        return res.status(400).json({message:"please enter integers only."})
    }
    let players =await db.find({}).toArray();
    let newBalance;
    for(var i of players){
        let balance = await i.balance;
        newBalance = parseInt(balance) + parseInt(cash);
        db.updateOne({userName:i.userName}, {$set: {"balance": newBalance}})
    }
    return res.status(200).json("amount added in all accounts:" + cash)
   
}

export async function getPortfolio(req,res){
    let db;
    let token = req.cookies.token;
    if(!token){
        token =await req.headers.authorization;
        token = await token.split(" ")[1]; 
    }
    const decodedToken = jwt.verify(token, "bullrun");
    let gameId = decodedToken.gameId;
    let collections = (await database.listCollections().toArray());
    for (var i of collections){
        if (i.name == gameId){
           db = await database.collection(gameId);
        }
    }
    if(!db){
        return res.status(400).json("Invalid gameId.")
    }
    let players = await db.find({}).toArray();
    let playersNetValue = [];
    
    for(var i of players){

        let userName = await i.userName;
        let portfolioValue = 0; 
            //updating the portfolio value. 
        if(i.portfolio!=null){
            for(var j of i.portfolio){
                let symbol =await  j.symbol
                let currPrice =await  getPrice(symbol);
                let lotValue = await (currPrice * j.quantity)
                portfolioValue = portfolioValue + lotValue;
            }
        db.updateOne({userName:userName},{$set:{portfolioValue:portfolioValue}})
        playersNetValue.push({userName:userName,portfolioValue:portfolioValue});
        }
    }
    res.status(200).json(playersNetValue)
}

export async function declareWinner(req,res){
    let passkey = req.body.passkey
    let gameId = req.body.gameId;
    let db;
    let collections = (await database.listCollections().toArray());
    for (var i of collections){
        if (i.name == gameId){
           db = await database.collection(gameId);
        }
    }
    if(passkey!= adminPasskey){
        return res.status(400).json({data:'you are not authorised. Ask the developer for the admin password'})
    }
    if(!db){
        return res.status(400).json("Invalid gameId.")
    }
    
    let players = await db.find({}).toArray();
    let playersNetValue = [];
    let winner;
    let totalValue;
    for(var i of await players){

        let userName = await i.userName;
        let portfolioValue = 0;
        let totalValue = i.balance;
//updating the portfolio value.
        if(i.portfolio!=null){
            for(var j of i.portfolio){
                let symbol =await  j.symbol
                let currPrice =await  getPrice(symbol);
                let lotValue = await (currPrice * j.quantity)
                totalValue = totalValue + lotValue;
            }

        }
        playersNetValue.push({userName:userName,portfolioValue:totalValue});
    }
    for(var i of playersNetValue){
        if(typeof i.userName ==="string"){
            if(!winner){
                winner = i;
            }
            else{
                if(winner.portfolioValue<i.portfolioValue){
                    winner = i;
                }
            }     
        }
    }
    try{
       // db.drop()
    }
    catch(err){
        console.log(err)
        return res.status(400).json(err);
    }
    return res.status(200).json(winner)
}

