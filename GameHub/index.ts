import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import gameDetailsRouter from "./routes/gamedetailsrouter";
import gameCompareRouter from "./routes/gamecomparerouter";
import stattracker from "./routes/stattracker"
import collectionsRouter from "./routes/collectionsrouter";
import homeRouter from "./routes/homerouter";
import { connectToDatabase, updateAvatar, updateUser, userCollection } from "./database";
import bcrypt from "bcrypt";

dotenv.config();
import session from "./session";
import { secureMiddleware } from "./middleware/secureMiddleware";
import { loginRouter } from "./routes/loginRouter";
import { Db, MongoClient, ObjectId } from "mongodb";

const app : Express = express();
//Max 10Mb image size for user avatar, so we don't go over the 16Mb document limit of Mongodb
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; 
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

app.use((req, res, next) => {
    res.locals.user = req.session?.user ?? null;
    next();
});

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
    attempts = 6;
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

app.post("/account/avatar", secureMiddleware, express.raw({
    type: ["image/png", "image/jpeg", "image/webp"],
    limit: MAX_IMAGE_SIZE,
  }), async (req, res) => {
    const user = req.session.user!;
    const fileBuffer = req.body;

  try {
    const { ObjectId } = await import("mongodb");
    const objectId = typeof user._id === "string" ? new ObjectId(user._id) : user._id;
    const dbUser = await userCollection.findOne({ _id: objectId });
    if (!dbUser) throw new Error("Gebruiker niet gevonden");

    if(!Buffer.isBuffer(fileBuffer)){
      throw new Error("Ongeldige avatar afbeelding upload");
    }
    const contentType: string | undefined = req.headers["content-type"];

    if (!contentType?.startsWith("image/")) {
      throw new Error("Enkel het uploaden van afbeeldingen is toegestaan. Kijk formaat na")
    }

    await updateAvatar(user._id!, fileBuffer, contentType);

    res.render("account", {
      title: "Account",
      user: req.session.user,
      updateSuccess: "Avatar succesvol bijgewerkt"
    });
  }
    catch(e){
      console.log(e);
    }
  });

app.post("/account/update", secureMiddleware, async (req, res) => {
  const { newUsername, currentPassword, newPassword, confirmPassword } = req.body;
  const user = req.session.user!;

  try {
    const { ObjectId } = await import("mongodb");
    const objectId = typeof user._id === "string" ? new ObjectId(user._id) : user._id;
    const dbUser = await userCollection.findOne({ _id: objectId });
    if (!dbUser) throw new Error("Gebruiker niet gevonden");

    const passwordValid = await bcrypt.compare(currentPassword, dbUser.password!);
    if (!passwordValid) throw new Error("Huidig wachtwoord is onjuist");

    if (newPassword) {
      if (newPassword !== confirmPassword) throw new Error("Wachtwoorden komen niet overeen");
      if (newPassword.length < 6) throw new Error("Nieuw wachtwoord moet minstens 6 tekens zijn");
    }

    await updateUser(user._id!, newUsername || undefined, newPassword || undefined);

    if (newUsername) req.session.user!.username = newUsername;

    res.render("account", {
      title: "Account",
      user: req.session.user,
      updateSuccess: "Profiel succesvol bijgewerkt"
    });
  } catch (e: any) {
    res.render("account", {
      title: "Account",
      user: req.session.user,
      updateError: e.message
    });
  }
});

app.put("/api/users/current-game", secureMiddleware, async (req, res) => {
    try {
        const { slug, name, image } = req.body;
        const { ObjectId } = await import("mongodb");
        const objectId = typeof req.session.user!._id === "string"
            ? new ObjectId(req.session.user!._id)
            : req.session.user!._id;

        await userCollection.updateOne(
            { _id: objectId },
            { $set: { current_game: { slug, name, image } } }
        );

        req.session.user!.current_game = { slug, name, image };
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false });
    }
});

app.delete("/api/users/current-game", secureMiddleware, async (req, res) => {
    try {
        const { ObjectId } = await import("mongodb");
        const objectId = typeof req.session.user!._id === "string"
            ? new ObjectId(req.session.user!._id)
            : req.session.user!._id;

        await userCollection.updateOne(
            { _id: objectId },
            { $unset: { current_game: "" } }
        );

        req.session.user!.current_game = undefined;
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false });
    }
});

app.use("/game", gameDetailsRouter);
app.use("/compare", gameCompareRouter);
app.use("/rg-stat-tracker", stattracker);
app.use(loginRouter());

app.get("/users/:id/avatar", async (req, res) => {
  const user = await userCollection.findOne({
    _id: new ObjectId(req.params.id),
  });

  if (!user?.avatar) {
    return res.status(404).send("No avatar");
  }

  res.setHeader("Content-Type", user.avatar.contentType);
  return res.send(user.avatar.data.buffer);
});

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
