
import {getDb} from './db.mjs';
import { getPrice , isValidSymbol} from './market.mjs';
import jwt from 'jsonwebtoken';
let database = await getDb();


export async function tradeStock(req,res){
    let call = req.body.call;
    let symbol = req.body.symbol;
    let quantity = req.body.quantity;
    let tradeQuantity = quantity;
    console.log(call,symbol)
    try{
 
    // Check if call is valid
    if (!['buy', 'sell'].includes(call)) {
        return res.status(400).json({ message: "Invalid call parameter. Must be 'buy' or 'sell'." });
    }
    
    //Check if symbol is valid
    if (!symbol || typeof symbol !== 'string') {
        return res.status(400).json({ message: "Invalid or missing symbol parameter." });
    }
        
     // Check if quantity is a positive integer
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity parameter. Must be a positive integer." });
    }
  //Authorization: 'Bearer TOKEN'
        
        let token = req.cookies.token;
        if(!token){
            token =await req.headers.authorization;
            token = await token.split(" ")[1]; 
        }
        const decodedToken = jwt.verify(token, "bullrun");
        let userName =decodedToken.userName;
        let gameId = decodedToken.gameId;
    // geting real time stock price.
        symbol = String(symbol).toUpperCase();

        var db = await database.collection(gameId);
        let rate = await getPrice(symbol);
        let cost = await rate*quantity;
    // getting details from the database
        let playerInfo =await db.find({userName:userName}).toArray();
        playerInfo = await playerInfo[0];
        let portfolioValue = await (playerInfo.portfolioValue)
        let prevBalance = await(playerInfo.balance)
        let positionOfStock = 0;
        var stockInPortfolio;

        let portfolio = await playerInfo.portfolio;

    //checking if stock exist in portfolio
        for (var i of await portfolio){
                if(i.symbol == symbol){
                    stockInPortfolio = true;
                    break;
                }
                else{
                    stockInPortfolio = false;
                    positionOfStock++;
                    
                }
        }

// buy call!

        if(call =="buy"){
        //checking for sufficient balance for buying stocks.
            let currBalance = await (prevBalance-cost);
            let currValue = await (portfolioValue)+ cost;

            if(prevBalance<cost || !prevBalance){
                return res.status(400).json("insufficient funds. balance: "+ prevBalance)
            }

        //updating the trading history.
            let tradingHistory = playerInfo.tradingHistory
            const currentDate = new Date(); 
            tradingHistory.push({call: call, symbol:symbol, rate: rate, quantity: quantity,cost: cost, time:currentDate })
            db.updateOne({userName:userName},{$set:{tradingHistory:tradingHistory}})
            

            if(await stockInPortfolio){
                for(var i of await portfolio){
                    if (i.symbol== symbol){
                        quantity =await (await parseInt(i.quantity) +await  parseInt(quantity));
                        var bookValue = cost+ i.bookValue
                        var average = await (bookValue/quantity);
                        break;
                    }
                    
                }


                portfolio.splice(positionOfStock,1)
                portfolio.push({symbol:symbol,avgPrice:await average.toFixed(2),quantity:quantity, bookValue:bookValue})

                
                db.updateOne({userName:userName},{$set:{portfolio: portfolio, balance:await currBalance, portfolioValue:await currValue}})
                res.status(200).json(portfolio);
            }
            //stock not in portfolio
            else{
                portfolio.push({symbol:symbol,avgPrice:rate ,quantity:quantity, bookValue: cost})
                db.updateOne({userName:userName},{$set:{portfolio:portfolio, balance:await currBalance, portfolioValue:await currValue}})
                res.status(200).json(portfolio);
            }
           
        
        }
        if(call=="sell"){
            if(await stockInPortfolio){
                let portfolio = await playerInfo.portfolio;
                for(var i of await portfolio){
                    if (i.symbol== symbol){
                        var avgPrice = i.avgPrice;
                        var bookValue = i.bookValue - (i.avgPrice* quantity);
                        quantity = parseInt(i.quantity) - parseInt(quantity);

                    }
                }
                if (quantity<0){
                    return res.status(400).json("insufficient quantity.")
                }
                let currBalance = await (prevBalance+cost)
                let currValue = await (portfolioValue - cost);

                const currentDate = new Date(); 
                let tradingHistory = playerInfo.tradingHistory
                tradingHistory.push({call: call, symbol:symbol, rate: rate, quantity: tradeQuantity,cost: cost, time:currentDate })
                db.updateOne({userName:userName},{$set:{tradingHistory:tradingHistory}})

                portfolio.splice(positionOfStock,1)
                if(quantity!=0){
                    portfolio.push({symbol:symbol,avgPrice:avgPrice ,quantity:quantity, bookValue:bookValue})
                }
                db.updateOne({userName:userName},{$set:{portfolio:portfolio, balance:await currBalance, portfolioValue: await currValue}})

                res.status(200).json(portfolio);
            }
            else{
                res.status(400).json("You dont have any stocks for company.")
            }
        }    
    }
    catch(err){
        console.log(err)
        return res.status(500).json('you are not authorised.')
    }
    
}

export async function tradingHistory(req,res){
     //Authorization: 'Bearer TOKEN'
     let token = req.cookies.token;
     if(!token){
        console.log("token not in cookie");
        token =await req.headers.authorization;
        token = await token.split(" ")[1]; 
        console.log("token from header in tradeHistory: "+ token);      
    }
    console.log("token from th           "+token)
     const decodedToken = jwt.verify(token, "bullrun");
     let userName =decodedToken.userName;
     let gameId = decodedToken.gameId;
 // geting real time stock price.
    var db = await database.collection(gameId);
    let player = await db.find({userName:userName}).toArray()
    player =await player[0]
     let history = player.tradingHistory
     res.status(200).json(history)
    
}

export async function playerPortfolio(req,res){
    let token = req.cookies.token;
    const decodedToken = jwt.verify(token, "bullrun");
    let userName =decodedToken.userName;
    let gameId = decodedToken.gameId;
    var db = await database.collection(gameId)
// getting details from the database
    let playerInfo =await db.find({userName:userName}).toArray();
    let playerPort = await playerInfo[0].portfolio;
    for (let i of playerPort) {
        let symbol = i.symbol;
        let currRate = await getPrice(symbol);
        let currValue = currRate * i.quantity;
        
        // Set properties dynamically based on the loop iteration
        i["currRate"] = currRate;
        i["currValue"] = currValue;
        i["pl"] = (currValue - parseInt(i.bookValue)).toFixed(2);
    }
    playerInfo.portfolio = playerPort;
    return res.status(200).json(playerInfo)
}