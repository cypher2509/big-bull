import axios from "axios";
import { url } from "inspector";
let get = axios.get
let key = "" //enter your api from newsapi.org here!

let date = new Date()
date.setDate(date.getDate() - 5);
date = (date.toISOString().split("T")[0]);

async function getNews(topic){
    
    // let url = "https://newsapi.org/v2/everything?q=" + topic +'&apiKey='+ key;
    let url = "https://newsapi.org/v2/everything?q="+topic+"&from="+date+ "&sortBy=popularity&apiKey="+key;
    let response = await get(url);

    return response.data.articles;
}   

export async function getGeneralNews(req,res){
    let articles=  await getNews("NYSE");
    return res.json(articles).status(200);
}

export async function getStockNews(req,res){
    let stock = req.params.name;
    console.log
    stock = stock;
    console.log("searched :  "+stock)
    try{    
        let articles=  await getNews(stock);
        return res.json(articles).status(200);
    }  
    catch(err){
        console.log(err);
    }
    
}