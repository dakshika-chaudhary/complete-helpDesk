import express from 'express';
import FAQ from "../models/faqModel.js";

const router = express.Router();

router.post("/",async(req,res)=>{
    try{
        const faq = new FAQ(req.body);
        await faq.save();
        res.status(201).json(faq);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/", async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;