import express from "express";

export function homeRouter() {
    const router = express.Router();

    router.get("/home", async(req, res) => {
        res.render("home");
    });

    return router;
}