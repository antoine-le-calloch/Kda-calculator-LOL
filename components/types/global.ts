export interface Kda {
    kills: number;
    deaths: number;
    assists: number;
}

export interface MatchesData {
    nbMatches: number;
    kdaList: Kda[];
    kdaTotal: Kda;
}
