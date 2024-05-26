import axios from "axios";
import { url } from "inspector";
let get = axios.get
let key = "201850af5c6e434e99979e2db7916a97"

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
    let stock = req.body.name;
    stock = stock;

    console.log("searched :  "+stock)
    let articles=  await getNews(stock);
    return res.json(articles).status(200);
}
