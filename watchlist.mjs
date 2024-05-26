import {getDb} from './db.mjs';
import jwt from 'jsonwebtoken';
import { getPrice } from './market.mjs';
import { json } from 'stream/consumers';
let database = await getDb();


export async function editWatchlist(req,res){
    let symbol = req.body.symbol;
    let action = req.body.action;

    let token = req.cookies.token;
    if(!token){
        token =await req.headers.authorization;
        token = await token.split(" ")[1]; 
    }
    const decodedToken = jwt.verify(token, "bullrun");
    let userName =decodedToken.userName;
    let gameId = decodedToken.gameId;
    
    var db = await database.collection(gameId);
    let playerInfo =await db.find({userName:userName}).toArray();
    let watchlist = playerInfo[0].watchlist;
    
    if(action== "add"){
        if(watchlist.length >0){
            for(let i of watchlist){
                if(symbol == i){
                    res.status(404).json({message:"stock already added to the watchlist."});
                    return
                }
            }
        }
        
        watchlist.push(symbol);
        db.updateOne({userName:userName},{$set:{watchlist:watchlist}});
        res.status(200).json({message:"added to the watchlist."})
    }

    let index = 0;
    let found = false;
    if(action =="remove"){
        if(watchlist.length>0){
            for(let i of watchlist){
                if(i == symbol){
                    found = true;
                    break
                }
                index++;
            }
            if(found){
                watchlist.splice(index,1);
                db.updateOne({userName:userName},{$set:{watchlist:watchlist}});
                res.status(200).json({message:"deleted from the watchlist."})
            }
        }
    }

}

export async function getWatchlist(req,res){
    let token = req.cookies.token;
    if(!token){
        token =await req.headers.authorization;
        token = await token.split(" ")[1]; 
    }
    const decodedToken = jwt.verify(token, "bullrun");
    let userName =decodedToken.userName;
    let gameId = decodedToken.gameId;
    var db = await database.collection(gameId)
    let playerInfo =await db.find({userName:userName}).toArray();
    let watchlist = playerInfo[0].watchlist;
    let wlist=[];
    if(watchlist.length>0){
        for(let i of watchlist){
            let listItem ={};
            listItem.symbol = i;
            listItem.price =await getPrice(i);
            wlist.push(listItem);
        }
    }
    else{
        return res.status(400).json({message:"empty watchlist"})
    }
   
    return res.status(200).json({wlist});


}