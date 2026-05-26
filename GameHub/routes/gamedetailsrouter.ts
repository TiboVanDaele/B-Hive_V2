import { Router, Request, Response } from "express";
import { Game } from "../types/game";
import { Collection } from "../types/collection";
import { ObjectId } from "mongodb";
import { collectionCollection } from "../database";

const router = Router();

router.get("/:slug", async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const apiKey = process.env.RAWG_API_KEY;

    try {
        const response = await fetch(`https://api.rawg.io/api/games/${slug}?key=${apiKey}`);

        if (!response.ok) {
            res.status(response.status).render("gamedetails", { game: null, platforms: "", tags: [], error: "Game not found", user: null, isInCollection: false });
            return;
        }

        const game: Game = await response.json();
        const platforms = game.platforms.map(p => p.platform.name).join(", ");
        const tags = game.tags.slice(0, 8);

        const userId = new ObjectId(req.session.user!._id);
        const collections: Collection[] = await collectionCollection.find({ userId }).toArray();
        const isInCollection: boolean = collections.some(collection => collection.games?.some((g) => g === slug));

        res.render("gamedetails", { game, platforms, tags, error: null, user: req.session?.user ?? null, isInCollection });
    } catch (err) {
        console.error("RAWG API error:", err);
        res.status(500).render("gamedetails", { game: null, platforms: "", tags: [], error: "Error loading game", user: null, isInCollection: false });
    }
});

export default router;