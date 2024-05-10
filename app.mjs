import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";

import { register,login } from "./registation.mjs";
import { connectToDb, getDb } from './db.mjs'
import { newGame, provideCash, getPortfolio,declareWinner } from './gameServer.mjs'
import { tradeStock,tradingHistory, playerPortfolio } from './game.mjs';
import { getStockPrice, searchStock } from './market.mjs';
import {editWatchlist, getWatchlist} from './watchlist.mjs';
import { verifyToken } from './middleware/authMiddleware.mjs';



const app= express();
const port = 8820;

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(cookieParser());
app.use(express.static(__dirname + '/view'));
app.use(express.json());// support json encoded bodies
app.use(express.urlencoded({extended: true}));//incoming objects are strings or arrays
app.use(bodyParser.json()); // support json encoded bodies

async function createServer(){
    try{
        await connectToDb();
        //registration
        app.post('/newGame',newGame)
        app.post('/provideCash',provideCash);
        app.post('/declareWinner',declareWinner);
        app.post('/register',register);
        app.post('/login',login);
        app.post('/tradeStock',verifyToken,tradeStock);
        app.get('/portfolio',verifyToken,getPortfolio);
        app.post('/searchStock',searchStock);
        app.get('/tradingHistory',verifyToken,tradingHistory);
        app.post('/getPrice',getStockPrice);
        app.get('/playerPortfolio',verifyToken,playerPortfolio);
        app.post('/editWatchlist',verifyToken,editWatchlist);
        app.get('/getWatchlist',verifyToken,getWatchlist);
        app.listen(port, () => {
            console.log('Example app listening at http://localhost:'+port)
        })
    }
    catch(err){
        console.log(err)
    }
}

createServer();