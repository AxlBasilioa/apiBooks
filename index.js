import axios from 'axios';
import rateLimit from 'express-rate-limit';
import express from 'express';
// apiConfig.js import
import { saveData, checkBookExistence, uniqueID } from './apiConfig.js';
const PORT = 3000;
const app = express();
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max:5,
    message:'Max petitions reached, wait 1 hour and try again'
});
app.use(limiter);
app.use(express.json());
app.get("/example", async(req,res)=>{
    res.json({message:"example"});
});
// upload new Books on my BD
app.get('/query-book', async(req,res)=>{
    try{
        if(req.query.name){
            // customComputing for name searching
        }else if(req.query.genre){
            // customComputing returning all books of 1 genre
        }

    }catch(e){
        res.status(500).send({message:`Unexpected error, try again later\n${e}`})
    }
});
app.post('/add-book', async(req,res)=>{
    //data to book
    // body-parser middleware
    const id = await uniqueID(req.body.genre);
    // change id to return some number, not string chars
    //maybe try to transform data into bytes and operate them
    //customComputing required maybe?
    const data = {
        id:id,
        genre:req.body.genre,
        name:req.body.nameBook,
        author:req.body.author,
        dateRelease:req.body.dateRelease,
        editorial:req.body.editorial,
        pageNumber:req.body.pageNumber,
        resume:req.body.resume
    };
    // try-catch
    try{
        // normalize books name
        const exists = await checkBookExistence(`/${data.genre}`, data.id);
        await saveData(`/${data.genre}`, data, `/${data.id}`);
        return (exists)?res.status(409).send({message:"Book already exists"}):res.status(200).send({message:`Book ${data.name} saved correctly`});
    }catch(e){
        res.status(500).send({message:`Unexpected error, try again later ${e}`});
    }
});
app.listen(PORT, ()=>{
    console.log(`express server at port ${PORT}\ntest it with\ncurl http://localhost:3000/example\nor just http://localhost:3000/example`);
});
