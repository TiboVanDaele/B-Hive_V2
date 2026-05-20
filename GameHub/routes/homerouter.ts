import { Router, Request, Response } from "express";
import { Game } from "../types/game";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
    const apiKey = process.env.RAWG_API_KEY;
    const search = req.query.q as string | undefined;
    const genres = req.query.genres as string | undefined;

    try {
        const page = req.query.page ? Number(req.query.page) : 1;
        let url = `https://api.rawg.io/api/games?key=${apiKey}&page_size=20&page=${page}`;

        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (genres) url += `&genres=${genres}`;

        const response = await fetch(url);
        const data = await response.json();

        const games = data.results.map((game: Game) => ({
            name: game.name,
            slug: game.slug,
            image: game.background_image,
            rating: game.rating,
            released: game.released
        }));

        res.render("Home", {
            title: "Home",
            games,
            search: search || "",
            activeGenres: genres ? genres.split(",") : [],
            currentPage: page,
            hasNext: !!data.next,
            hasPrev: page > 1
        });
    } catch (err) {
        console.error("RAWG API error:", err);
        res.render("Home", { title: "Home", games: [], search: "", activeGenres: [] });
    }
});
export default router;