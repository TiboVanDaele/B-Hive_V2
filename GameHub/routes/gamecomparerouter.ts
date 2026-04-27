import { Router, Request, Response } from "express";
import { Game } from "../types/game";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
    const game1 = req.query.game1;
    const game2 = req.query.game2;
    const apiKey = process.env.RAWG_API_KEY;

    var games:Game[] = [];
    console.log(game1);
    console.log(apiKey);

    try {
        const response = await fetch(`https://api.rawg.io/api/games/${game1}?key=${apiKey}`);
        if (!response.ok) {
        res.status(500).render("compare", { games:null, error: "Error loading game" });
            return;
        }

        const game1Details:Game = await response.json();
        games.push(game1Details);
        console.log("Game details 1:" + game1Details);
    } catch (err) {
        console.error("RAWG API error:", err);
        res.status(500).render("compare", { games:null, error: "Error loading game" });
    }

    try {
        const response = await fetch(`https://api.rawg.io/api/games/${game2}?key=${apiKey}`);

        if (!response.ok) {
            res.status(500).render("compare", { games:null, error: "Error loading game" });
            return;
        }

        const game2Details:Game = await response.json();
        console.log(response.json);
        games.push(game2Details);
        console.log("Game details 2:" + game2Details);
    } catch (err) {
        console.error("RAWG API error:", err);
        res.status(500).render("compare", { games:null, error: "Error loading game" });
    }

    res.render("compare", {games});
});

export default router;
