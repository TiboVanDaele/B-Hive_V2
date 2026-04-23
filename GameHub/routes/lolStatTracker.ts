import { Router, Request, Response } from "express";

const router = Router();

const apikey = process.env.RG_API_KEY;

router.get("/", (req,res)=>{
    res.render("lolStatTracker")
})

export default router;