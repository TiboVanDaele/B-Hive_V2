import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import gameDetailsRouter from "./routes/gamedetailsrouter";
import gameCompareRouter from "./routes/gamecomparerouter";
import stattracker from "./routes/stattracker"
import collectionsRouter from "./routes/collectionsrouter";
import homeRouter from "./routes/homerouter";
import { connectToDatabase } from "./database";

dotenv.config();
import session from "./session";
import { User } from "./types/user";
import { secureMiddleware } from "./middleware/secureMiddleware";
import { loginRouter } from "./routes/loginRouter";

const app : Express = express();
getGame();
/* MOCK DATA - MOET WEG NADAT WE ALLES BINNENTREKKEN VIA DE API*/
const collections = [
  {
    id: 1,
    name: "Mijn Xbox Games",
    coverImage: "/images/collection-image.png",
    description: "Games die ik op Xbox speel",
    games: [
      {
        name: "GTA V",
        slug: "grand-theft-auto-v",
        image: "/images/collection-image.png",
        rating: 4.5,
        released: "2013"
      }
    ]
  },
  {
    id: 2,
    name: "Mijn PS5 Games",
    coverImage: "/images/collection-image.png",
    description: "PS5 collectie",
    games: []
  }
];
const games = [
  {
    name: "grand-theft-auto-v",
    slug: "grand-theft-auto-v",
    image: "/images/collection-image.png",
    rating: 4.5,
    released: "2013"
  },
  {
    name: "The Witcher 3: Wild Hunt",
    slug: "the-witcher-3-wild-hunt",
    image: "/images/collection-image.png",
    rating: 4.8,
    released: "2015"
  },
  {
    name: "Elden Ring",
    slug: "elden-ring",
    image: "/images/collection-image.png",
    rating: 4.7,
    released: "2022"
  },
  {
    name: "Red Dead Redemption 2",
    slug: "red-dead-redemption-2",
    image: "/images/collection-image.png",
    rating: 4.6,
    released: "2018"
  }
];
const compareGames = [
  {
    name: "DOOM",
    image: "/images/collection-image.png",
    genres: ["Shooter", "Action"],
    platforms: ["PC", "PlayStation", "Xbox"],
    rating: "4.4",
    description: "Snelle shooter met intense actie en klassieke demonenslachting.",
    playtime: 12
  },
  {
    name: "Cyberpunk 2077",
    image: "/images/collection-image.png",
    genres: ["RPG", "Action"],
    platforms: ["PC", "PlayStation", "Xbox"],
    rating: "4.1",
    description: "Open-world RPG in een futuristische stad vol quests, upgrades en keuzes.",
    playtime: 60
  }
];
const user = {
  username: "Jonas",
  profilePic: "/images/collection-image.png",
  level: 5,
  stats: {
    collections: 8,
    games: 42,
    comparisons: 12,
    guesses: 27
  }
};
let attempts = 6;
let guessingGame = {
  name: "DOOM",
  image: "/images/collection-image.png"
};

interface guess{guess:string,
  correct:boolean;
}
let previousGuesses : guess[] = [
  {guess:"Quake",correct:false},
];

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));

app.set("port", process.env.PORT);

app.use(session);

app.get("/", (req, res) => {
  res.render("index", { title: "index" });
});

app.use("/home", secureMiddleware, homeRouter);
app.use("/collections", secureMiddleware, collectionsRouter);

app.get("/login", (req, res) => {
    res.render("login", { title : "login"});
});
let correctGuess = false;
app.get("/suggestions", async (req, res) => {
    const search = req.query.q as string;
    if (!search || search.length < 2) return res.json([]);

    try {
        const response = await fetch(`https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${encodeURIComponent(search)}&page_size=5`);
        const data = await response.json();
        res.json(data.results.map((game: any) => ({ name: game.name, slug: game.slug })));
    } catch {
        res.json([]);
    }
});
async function getGame() {
  try {
        const randomPage = Math.floor(Math.random() * 5) + 1;
        const url = `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&page=${randomPage}&page_size=20`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`RAWG API gaf een status ${response.status} code`);
        }

        const data = await response.json();
        const gamesList = data.results;

        if (!gamesList || gamesList.length === 0) {
            return "GamesList error: list not found"
        }

        const randomIndex = Math.floor(Math.random() * gamesList.length);
        const randomGame = gamesList[randomIndex];

        guessingGame.name = randomGame.name;
        guessingGame.image = randomGame.background_image

    } catch (error) {
        console.error('an issue occurred retrieving RAWG data');
    }
}
app.get("/guessing-game", secureMiddleware, async(req, res) => {
  res.render("guessing-game", {
    title: "Guessing Game",
    game: guessingGame,
    previousGuesses,
    attempts,
    correctGuess
  });
});
app.post("/guessing-game", async(req, res) => {
  let guess = req.body.guess;
  if(guess == "Next-Game-To-Show"){
    correctGuess = false;
    attempts = 7;
  }
  let correct
  if(guess.toUpperCase() == guessingGame.name.toUpperCase()){
    getGame();
    correctGuess = true;
    correct = true;
    guess = guessingGame.name;
  }else if(guessingGame.name.toUpperCase().includes(guess.toUpperCase()) && guess.length >= 5){
    getGame();
    correctGuess = true;
    correct = true;
    guess = guessingGame.name;
  }  
  else{
    attempts -= 1;
    correct = false;
  }
if(guess != "Next-Game-To-Show"){ 
  previousGuesses.push({guess,correct});
}
  res.redirect("/guessing-game");
});
app.get("/account", secureMiddleware, (req, res) => {
  res.render("account", {
    title: "Account",
    user: req.session.user
  });
});
app.use("/game", gameDetailsRouter);
app.use("/compare", gameCompareRouter);
app.use("/rg-stat-tracker", stattracker);
app.use(loginRouter());

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await connectToDatabase();
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
});


