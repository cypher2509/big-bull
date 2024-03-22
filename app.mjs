import express from 'express';
import { register,login } from "./registation.mjs";
import { connectToDb, getDb } from './db.mjs'
import { newGame, provideCash, getPortfolio,declareWinner } from './gameServer.mjs'
import { tradeStock,tradingHistory } from './game.mjs';
import { searchStock } from './market.mjs';
import { verifyToken } from './middleware/authMiddleware.mjs';


const app= express();
const port = 8820;

app.use(express.json());// support json encoded bodies
app.use(express.urlencoded({extended: true}));//incoming objects are strings or arrays

async function createServer(){
    try{
        await connectToDb();
        //registration
        app.post('/newGame',newGame)
        app.post('/register',register);
        app.get('/login',login);
        app.post('/provideCash',provideCash);
        app.post('/tradeStock',verifyToken,tradeStock);
        app.get('/portfolio',getPortfolio);
        app.get('/searchStock',searchStock);
        app.get('/declareWinner',declareWinner);
        app.get('/tradingHistory',verifyToken,tradingHistory);


        app.listen(port, () => {
            console.log('Example app listening at http://localhost:'+port)
        })
    }
    catch(err){
        console.log(err)
    }
}

createServer();