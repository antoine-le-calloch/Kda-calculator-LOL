import {NextRequest, NextResponse} from "next/server";

interface participant {
    "puuid": string,
    "kills": number,
    "deaths": number,
    "assists": number,
}

interface Match {
    "info": {
        "participants": participant[],
    }
    "status"?: {
        "status_code": number,
    }
}

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const summonerName = params.get('summonerName');
    const summonerTagline = params.get('summonerTagline');
    const startDate = params.get('startDate');
    const endDate = params.get('endDate');

    const API_KEY = process.env.RIOT_API_KEY;
    
    if (!summonerName || !summonerTagline || !startDate || !endDate) {
        return NextResponse.json({error: 'Missing required parameters'}, {status: 400});
    }
    
    let kdaList: Kda[] = [];
    let kdaTotal: Kda = {kills: 0, deaths: 0, assists: 0};
    
    try {
        // get account puuid
        const getAccountResponse = await fetch(
            `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${summonerTagline}?api_key=${API_KEY}`);
        const accountData = await getAccountResponse.json();
        if (!accountData || accountData.error || !accountData.puuid) {
            return NextResponse.json({error: 'Summoner not found'}, {status: 404});
        }
        const puuid = accountData.puuid;

        // convert dates to unix timestamps
        const startTime = Math.floor(new Date(startDate).getTime() / 1000);
        const endTime = Math.floor(new Date(endDate).getTime() / 1000);
        
        // get matches ids between the two dates
        const getMatchesResponse = await fetch(
            `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/` +
            `${puuid}/ids?startTime=${startTime}&endTime=${endTime}&start=0&count=100&api_key=${API_KEY}`);
        const matches: [] = await getMatchesResponse.json();
        const nbMatches = matches.length;
        if (nbMatches === 0) {
            return NextResponse.json({error: 'No matches found for this period'}, {status: 404});
        }
        
        // retrieve kda for each match
        for (const matchId of matches) {
            const getMatchResponse = await fetch(
                `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`);
            const match: Match = await getMatchResponse.json();
            if (match.status && match.status.status_code === 429) {
                return NextResponse.json({error: 'Too many requests, please try again in 2 minutes'}, {status: 500});
            }
            const sumData = match.info.participants.find(
                participant => participant.puuid === puuid);
            if (!sumData) {
                return NextResponse.json({error: 'Summoner not found in match'}, {status: 404});
            }
            kdaList.push({ kills: sumData.kills, deaths: sumData.deaths, assists: sumData.assists,});
            kdaTotal.kills += sumData.kills;
            kdaTotal.deaths += sumData.deaths;
            kdaTotal.assists += sumData.assists;
        }
        const matchesData: MatchesData = {
            nbMatches: nbMatches,
            kdaList: kdaList,
            kdaTotal: kdaTotal,
        }
        return NextResponse.json(matchesData, { status: 200 });
    } catch (error) {
        return NextResponse.json({}, {status: 500});
    }
}