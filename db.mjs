import {MongoClient} from 'mongodb';
const uri ="mongodb://localhost:27017/"
const client = new MongoClient(uri);

var db;

export async function connectToDb(){
    try{
        await client.connect()

        db = await client.db('Bigbull');
        console.log('connected successfully to mongodb');
    }
    catch(err){
        console.log(err);
    }
}

export async function getDb(){
    await client.connect()
    db = await client.db('Bigbull');
    return db
}
export async function closeDBConnection(){
    await client.close();
    return 'Connection closed';
};

export default{connectToDb ,getDb, closeDBConnection}