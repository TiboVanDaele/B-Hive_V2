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

app.set("port", process.env.PORT || 3000);

app.use("/", gameDetailsRouter);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});