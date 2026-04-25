import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import gameDetailsRouter from "./routes/gamedetailsrouter";
dotenv.config();

const app : Express = express();
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
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));

app.set("port", process.env.PORT);

app.get("/", (req, res) => {
    res.render("index", { title : "index"});
});
app.get("/home", (req, res) => {
  res.render("Home", {
    title: "Home",
    games
  });
});
app.get("/collections", (req, res) => {
  res.render("collections", { collections });
});

app.get("/collections/:id", (req, res) => {
  const collection = collections.find(c => c.id === Number(req.params.id));
  res.render("collection", { collection });
});
app.get("/login", (req, res) => {
    res.render("login", { title : "login"});
});

app.get("/compare", (req, res) => {
  res.render("compare", {
    title: "Game vergelijking",
    games: compareGames
  });
});

app.get("/account", (req, res) => {
  res.render("account", {
    title: "Account",
    user
  });
});
app.use("/game", gameDetailsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
