import axios from "axios";
import exp from "constants";
const get = axios.get;
let key = "90bbccba7a0f440eada9119f0da6688a"
let url = "https://api.twelvedata.com/";
   

export async function searchStock(req,res){
    let stockName = req.query.stockName;
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
  
export async function getPrice(stockName){
    try{
        let route= "price";
        let response = await get(url+route+"?symbol="+stockName+"&apikey="+key);
        return await response.data.price
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
