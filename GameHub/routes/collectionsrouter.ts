import {Router, Request, Response} from "express";
import {Game} from "../types/game";

const router = Router();

router.get("/:id", async (req: Request, res:Response): Promise<void> => {
    const id = Number(req.params.id);
    const apiKey= process.env.RAWG_API_KEY;

    //mockdata - moeten we nog vervangen door mongoldb
    const collections = [
        {
            id: 1,
            name: "Mijn Xbox Games",
            coverImage: "/images/collection-image.png",
            description: "Games die ik op Xbox speel",
            games: ["grand-theft-auto-v", "elden-ring"]
        },
        {
            id: 2,
            name: "Mijn PS5 Games",
            coverImage: "/images/collection-image.png",
            description: "PS5 collectie",
            games: ["dead-island-2"]
        }
    ];

    const collection = collections.find(c => c.id === id)

    if (!collection) {
        res.status(404).render("collection", {collection:null});
        return;      
    };
    try {
        // Haal voor elke slug de echte game data op via RAWG
        const gamePromises = collection.games.map(slug =>
            fetch(`https://api.rawg.io/api/games/${slug}?key=${apiKey}`)
                .then(res => res.json() as Promise<Game>)
        );

        const rawgGames = await Promise.all(gamePromises);

         // Bouw collection object me echte data
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
        console.error("RAWG API error:", err);
        res.status(500).render("collection", { collection: null });
    }
});

export default router;