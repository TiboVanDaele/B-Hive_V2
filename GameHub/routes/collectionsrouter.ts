import { Router, Request, Response } from "express";
import { Game } from "../types/game";
import { collectionCollection } from "../database";
import { ObjectId } from "mongodb";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = new ObjectId(req.session.user!._id);
        const collections = await collectionCollection.find({ userId }).toArray();
        const apiKey = process.env.RAWG_API_KEY;

        const collectionsWithImages = await Promise.all(collections.map(async col => {
            let coverImage = "/images/collection-image.png";
            if (col.games.length > 0) {
                const res = await fetch(`https://api.rawg.io/api/games/${col.games[0]}?key=${apiKey}`);
                const data = await res.json();
                coverImage = data.background_image || coverImage;
            }
            return { ...col, coverImage };
        }));

        res.render("collections", { collections: collectionsWithImages });
    } catch (err) {
        console.error(err);
        res.status(500).render("collections", { collections: [] });
    }
});

router.get("/api", async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = new ObjectId(req.session.user!._id);
        const collections = await collectionCollection.find({ userId }).toArray();
        res.json(collections);
    } catch (err) {
        res.json([]);
    }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
    const apiKey = process.env.RAWG_API_KEY;

    try {
        const collection = await collectionCollection.findOne({ _id: new ObjectId(req.params.id as string) });

        if (!collection) {
            res.status(404).render("collection", { collection: null });
            return;
        }

        const gamePromises = collection.games.map(slug =>
            fetch(`https://api.rawg.io/api/games/${slug}?key=${apiKey}`)
                .then(res => res.json() as Promise<Game>)
        );

        const rawgGames = await Promise.all(gamePromises);

        const fullCollection = {
            ...collection,
            games: rawgGames.map(game => ({
                name: game.name,
                slug: game.slug,
                image: game.background_image,
                rating: game.rating,
                released: game.released
            }))
        };

        res.render("collection", { collection: fullCollection });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).render("collection", { collection: null });
    }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = new ObjectId(req.session.user!._id);
        const { name } = req.body;

        await collectionCollection.insertOne({
            userId,
            name,
            games: []
        });

        res.redirect("/collections");
    } catch (err) {
        console.error(err);
        res.redirect("/collections");
    }
});

router.post("/:id/add", async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.body;
        await collectionCollection.updateOne(
            { _id: new ObjectId(req.params.id as string) },
            { $addToSet: { games: slug } }
        );
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false });
    }
});

/* collectionss page*/
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        await collectionCollection.deleteOne({ _id: new ObjectId(req.params.id as string) });
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false });
    }
});

/* collection page*/
router.post("/:id/remove", async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.body;
        await collectionCollection.updateOne(
            { _id: new ObjectId(req.params.id as string) },
            { $pull: { games: slug } }
        );
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false });
    }
});
export default router;