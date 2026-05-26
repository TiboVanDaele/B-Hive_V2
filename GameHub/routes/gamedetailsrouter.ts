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
            res.status(response.status).render("gamedetails", { game: null, platforms: "", tags: [], error: "Game not found", user: req.session.user  });
            return;
        }

        const game: Game = await response.json();
        const platforms = game.platforms.map(p => p.platform.name).join(", ");
        const tags = game.tags.slice(0, 8);

        res.render("gamedetails", { game, platforms, tags, error: null, user: req.session?.user ?? null });
        const userId = new ObjectId(req.session.user!._id);
        const collections: Collection[] = await collectionCollection.find({ userId }).toArray();
        const isInCollection: boolean = collections.some(collection => collection.games?.some((game) => game === slug));


        res.render("gamedetails", { game, platforms, tags, error: null, isInCollection, user: req.session.user  });
    } catch (err) {
        console.error("RAWG API error:", err);
        res.status(500).render("gamedetails", { game: null, platforms: "", tags: [], error: "Error loading game", user: req.session.user  });
    }
});

export default router;
