import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";

import { register,login, logout } from "./registation.mjs";
import { connectToDb, getDb } from './db.mjs'
import { newGame, provideCash, getPortfolio,declareWinner } from './gameServer.mjs'
import { tradeStock,tradingHistory, playerPortfolio } from './game.mjs';
import { getStockPrice, searchStock,getFundamentals } from './market.mjs';
import {editWatchlist, getWatchlist} from './watchlist.mjs';
import { verifyToken } from './middleware/authMiddleware.mjs';
import { getGeneralNews, getStockNews } from './news.mjs';

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
        //user authentication
        app.post('/newGame',newGame);
        app.post('/register',register);
        app.post('/login',login);
        app.get('/logout',logout);

        //account actions
        app.patch('/tradeStock',verifyToken,tradeStock);
        app.patch('/editWatchlist',verifyToken,editWatchlist);

        //account details
        app.get('/portfolio',verifyToken,getPortfolio);
        app.get('/tradingHistory',verifyToken,tradingHistory);
        app.get('/playerPortfolio',verifyToken,playerPortfolio);
        app.get('/watchlist',verifyToken,getWatchlist);

        //stock & news details
        app.get('/stock/:ticker',searchStock);
        app.get('/stockPrice/:symbol',getStockPrice);
        app.get('/fundamentals/:symbol',getFundamentals);
        app.get('/generalNews/',getGeneralNews);
        app.get('/stockNews/:name',getStockNews);

        // admin controls
        app.patch('/provideCash',provideCash);
        app.post('/winner',declareWinner);

        app.listen(port, () => {
            console.log('Example app listening at http://localhost:'+port)
        })

    }
    catch(err){
        console.log(err)
    }
}

createServer();