import axios from "axios";
const get = axios.get;
let key = "daadbeb4409041009b67662fe5c505f7"
let url = "https://api.twelvedata.com/";
import { getStockData} from './db.mjs';

let database = await getStockData();


export async function searchStockTicker(req,res){
    let stockName = req.body.stockName;
    let route= "symbol_search";
    let response;

    if (!stockName) {
        return res.status(400).json({ message: "Missing stockName parameter." });
    }
    try {
        response = await get(url + route + "?symbol=" + stockName);
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "Internal server error." });
    }

    if (!response || !response.data || !response.data.data || response.data.data.length === 0) {

        return res.status(400).json({ message: "Invalid stockName parameter." });
    }

    

    let name = []
    for(let i=0; i<response.data.data.length ;i++){
        let symbols = await[response.data.data[i].symbol,response.data.data[i].instrument_name,response.data.data[i].exchange]
       
        await name.push(symbols)
    }
     await name
     res.status(200).json(name)
}

export async function searchStock(req,res){
    let stockName = req.body.search;
    
    if(stockName.trim().length==0){
        console.log("empty");
        return res.status(200).json({message: "emptySearch"});
    }
    var regex_name = new RegExp("^" + stockName.toLowerCase().trim(), "i");
    let stock = await database.find({
        $or:[
            {ticker:{ $regex: regex_name,} },
            {"company name":{ $regex: regex_name }} 
            ]}).toArray();

    if(stock.length==0){
        return res.status(400).json("no stock found.");
    }

    return res.json(stock).status(200);
}
  
export async function getPrice(stockName){
    try{
        let route= "price";
        let response = await get(url+route+"?symbol="+stockName+"&apikey="+key);
        return await response.data.price;
    }
    catch(err){
        console.log(err)
    }
}

export async function getStockPrice(req,res){
    let stockName = req.body.symbol;
    console.log(stockName)
    try{
        let route= "price";
        let response = await get(url+route+"?symbol="+stockName+"&apikey="+key);
        return res.status(200).json(response.data.price)
    }
    catch(err){
        console.log(err)
    }
}

export async function isValidSymbol(symbol){
    let price = await getPrice(symbol);

    if (isNaN(price)) {
        return false;
    } else {
        return true;
    }
}

export async function getFundamentals(req,res){
    let ticker = req.body.symbol;
    try{
        let route= "quote";
        let response = await get(url+route+"?symbol="+ticker+"&apikey="+key);
        console.log(response.data);
        return res.status(200).json(response.data)
    }
    catch(err){
        console.log(err)
    }
}