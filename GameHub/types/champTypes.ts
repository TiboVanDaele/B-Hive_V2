export interface ChampionMasteryData {
  puuid: string;

  championId: number;
  championLevel: number;
  championPoints: number;

  lastPlayTime: number;

  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;

  markRequiredForNextLevel: number;
  tokensEarned: number;

  championSeasonMilestone: number;

  nextSeasonMilestone: NextSeasonMilestoneDTO;
}

export interface NextSeasonMilestoneDTO {
  requireGradeCounts: Record<string, number>;
  rewardMarks: number;
  bonus: boolean;
  totalGamesRequires: number;
}

export interface PUUID{
  puuid: string,
  gameName:string,
  tagLine: string
}