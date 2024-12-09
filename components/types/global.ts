interface Kda {
    kills: number;
    deaths: number;
    assists: number;
}

interface Profile {
    name: string;
    tagline: string;
}

interface Period {
    startDate: string;
    endDate: string;
}

interface MatchesData {
    nbMatches: number;
    kdaList: Kda[];
    kdaTotal: Kda;
}