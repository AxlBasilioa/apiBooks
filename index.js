import axios from 'axios';
import rateLimit from 'express-rate-limit';
import express from 'express';
// apiConfig.js import
import { saveData, checkBookExistence } from './apiConfig.js';
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
app.post('/addBook', async(req,res)=>{
    //data to book
    // body-parser middleware
    const data = {
        genre:req.body.genre,
        name:req.body.nameBook,
        author:req.body.author,
        dateRelease:req.body.dateRelease,
        ISBN:req.body.isbn,
        editorial:req.body.editorial,
        pageNumber:req.body.pageNumber,
        resume:req.body.resume
    };
    // try-catch
    try{
        // normalize books name
        const bookKey = data.name.replace(/\s+/g,'_').toLowerCase();
        const exists = await checkBookExistence(`/${data.genre}`, bookKey);
        await saveData(`/${data.genre}`, data, `/${bookKey}`);
        return (exists)?res.status(409).send({message:"Book already exists"}):res.status(200).send({message:"Book saved correctly"});
    }catch(e){
        res.status(500).send({message:`Unexpected error, try again later ${e}`});
    }
});
app.listen(PORT, ()=>{
    console.log(`express server at port ${PORT}\ntest it with\ncurl http://localhost:3000/example\nor just http://localhost:3000/example`);
});