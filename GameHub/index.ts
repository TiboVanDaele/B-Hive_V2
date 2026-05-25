import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import gameDetailsRouter from "./routes/gamedetailsrouter";
import gameCompareRouter from "./routes/gamecomparerouter";
import stattracker from "./routes/stattracker"
import collectionsRouter from "./routes/collectionsrouter";
import homeRouter from "./routes/homeRouter";
import { connectToDatabase } from "./database";

dotenv.config();
import session from "./session";
import { secureMiddleware } from "./middleware/secureMiddleware";
import { loginRouter } from "./routes/loginRouter";
import { Db, MongoClient } from "mongodb";

const app : Express = express();
getGame();

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
  if(correctGuess){
    const uri = process.env.MONGO_URI;
    
    if(uri === undefined)
        {
            console.error("MONGO_URI moet ingevuld zijn in de env");
            process.exit();
        }
    
    const client = new MongoClient(uri);
    let db: Db;
      try {
          await client.connect();
          db = client.db("login-B-Hive");
          const collection = db.collection("users");          
          const user = req.session.user

          if(user){

          await collection.updateOne({username:user.username},{$inc:{xp:attempts}})


          }
      } catch (e) {
          console.error(e);
      }finally{
          await client.close();
      }
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


