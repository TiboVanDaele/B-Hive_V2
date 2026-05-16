import { Router, Request, Response } from "express";
import { ChampionMasteryData , PUUID} from "../types/champTypes";

const router = Router();

const tempAPIKEY:string = "RGAPI-ba518650-d0c3-479a-8598-ae495c84e4df"

router.get("/",(req, res)=>{
    let ChampNames:string[] = [];
    let ChampSplashArtUrl:string[] = [];
    let ChampLevels:number[] = [];
    let ChampLevelProgress:string[] = [];
    res.render("statTracker",
        {
            ChampNames:ChampNames,
            ChampSplashArtUrl:ChampSplashArtUrl,
            ChampLevels:ChampLevels,
            ChampLevelProgress:ChampLevelProgress
        });
})

router.post("/",(req,res)=>{
    let gtag: string = req.body.GamerTag;
    res.redirect("/rg-stat-tracker/"+gtag.replace("#","."))
})

router.post("/:gtag",(req,res)=>{
    let gtag: string = req.body.GamerTag;
    res.redirect("/rg-stat-tracker/"+gtag.replace("#","."))
})

router.get("/:gtag", async(req: Request, res: Response): Promise<void> => {
    let gtag: string = req.params.gtag as string;

    let ChampNames:string[] = [];
    let ChampSplashArtUrl:string[] = [];
    let ChampLevels:number[] = [];
    let ChampLevelProgress:string[] = [];

    console.log(gtag)
    const resp = await fetch("https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/"+gtag.replace(".","/")+"?api_key=RGAPI-14dc5a67-693d-416e-b39c-1c02da24f388")
    console.log(resp.status)
    const puuid: PUUID = await resp.json();

    if(gtag.length > 0){
        const response = await fetch("https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/"+ puuid.puuid +"?api_key="+process.env.RG_API_KEY);
        const champMasteryData: ChampionMasteryData[] = await response.json();

        const champRes = await fetch("https://ddragon.leagueoflegends.com/cdn/14.10.1/data/en_US/champion.json");
        const champData = await champRes.json();

        const champMap: Record<number, string> = {};

        if(champRes.status == 200){
        Object.values(champData.data).forEach((champ: any) => {
            champMap[parseInt(champ.key)] = champ.name;
        }); }

        if(response.status == 200 && champRes.status == 200){
        for(let i = 0; i < 10; i++){
        ChampNames.push(champMap[champMasteryData[i].championId]);
        ChampSplashArtUrl.push(`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champMap[champMasteryData[i].championId].replace(" ","")}_0.jpg`);
        ChampLevels.push(champMasteryData[i].championLevel);
        ChampLevelProgress.push(((champMasteryData[i].championPointsSinceLastLevel/(champMasteryData[i].championPointsSinceLastLevel + champMasteryData[i].championPointsUntilNextLevel))*100).toFixed(0))
        }}
    }
    res.render("statTracker",
        {
            ChampNames:ChampNames,
            ChampSplashArtUrl:ChampSplashArtUrl,
            ChampLevels:ChampLevels,
            ChampLevelProgress:ChampLevelProgress
        });
})

export default router;