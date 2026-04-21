import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { Game } from "../types/game";

const router = Router();

router.get("/game/:slug", async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const apiKey = process.env.RAWG_API_KEY;

    try {
        const response = await fetch(`https://api.rawg.io/api/games/${slug}?key=${apiKey}`);

        if (!response.ok) {
            res.status(response.status).render("gamedetails", { game: null, error: "Game not found" });
            console.log("game not found");
            return;
        }
        console.log("game found");
        const game: Game = await response.json();
        res.render("gamedetails", { game, error: null });
    } catch (err) {
        console.error("RAWG API error:", err);
        res.status(500).render("gamedetails", { game: null, error: "Error loading game" });
    }
});

export default router;
