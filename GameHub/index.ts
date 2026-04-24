import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import gameDetailsRouter from "./routes/gamedetailsrouter";
dotenv.config();

const app : Express = express();

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
    res.render("home", { title : "Home"});
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

app.use("/game", gameDetailsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
