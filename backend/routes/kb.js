import express from "express";
import Article from "../models/Article.js";
const router = express.Router();

//all articles
router.get("/",async(req,res)=>{
   try{
      const q = req.query.q;
      const filter = q ? {$text : {$search:q}}:{};
      const articles = await Article.find(filter).sort({ createdAt: -1 }).limit(100);
      res.json(articles);
   }
   catch(err){
    res.status(500).json({ message: err.message });
   }
})

//single article
router.get("/:id",async(req,res)=>{
    try{
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
    }
    catch(err){
         res.status(500).json({ message: err.message });
    }
})

export default router;