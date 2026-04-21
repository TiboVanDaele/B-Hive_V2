import { Router, Request, Response } from "express";
import { Game } from "../types/game";

const router = Router();

router.get("/:slug", async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const apiKey = process.env.RAWG_API_KEY;

    try {
        const response = await fetch(`https://api.rawg.io/api/games/${slug}?key=${apiKey}`);

        if (!response.ok) {
            res.status(response.status).render("gamedetails", { game: null, platforms: "", tags: [], error: "Game not found" });
            return;
        }

        const game: Game = await response.json();
        const platforms = game.platforms.map(p => p.platform.name).join(", ");
        const tags = game.tags.slice(0, 8);

        res.render("gamedetails", { game, platforms, tags, error: null });
    } catch (err) {
        console.error("RAWG API error:", err);
        res.status(500).render("gamedetails", { game: null, platforms: "", tags: [], error: "Error loading game" });
    }
});

export default router;
