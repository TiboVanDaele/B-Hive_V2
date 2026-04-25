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
    coverImage: "/images/collection-image.png"
  },
  {
    id: 2,
    name: "Mijn PS5 Games",
    coverImage: "/images/collection-image.png"
  },
  {
    id: 3,
    name: "Mijn Steam Games",
    coverImage: "/images/collection-image.png"
  },
  {
    id: 4,
    name: "100% completed games",
    coverImage: "/images/collection-image.png"
  },
  {
    id: 5,
    name: "Games die ik samen met mijn broer speel",
    coverImage: "/images/collection-image.png"
  },
  {
    id: 6,
    name: "Oldschool games",
    coverImage: "/images/collection-image.png"
  },
  {
    id: 7,
    name: "Slechtste games ooit",
    coverImage: "/images/collection-image.png"
  },
  {
    id: 8,
    name: "Mijn top 5",
    coverImage: "/images/collection-image.png"
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
  res.render("collections", {
    title: "Mijn collecties",
    collections
  });
});
app.get("/login", (req, res) => {
    res.render("login", { title : "login"});
});

app.use("/game", gameDetailsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
