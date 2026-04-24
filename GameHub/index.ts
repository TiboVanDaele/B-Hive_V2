import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import gameDetailsRouter from "./routes/gamedetailsrouter";

dotenv.config();

const app : Express = express();

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
app.get("/login", (req, res) => {
    res.render("login", { title : "login"});
});

app.use("/game", gameDetailsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
