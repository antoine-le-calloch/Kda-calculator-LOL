"use client";

import React, {useState} from "react";

interface PeriodData {
    profile: Profile;
    period: Period;
    matchesData: MatchesData;
}

export default function Home() {
    const defaultTagline = 'EUW';
    const [profile, setProfile] = useState<Profile>({
        name: '', tagline: defaultTagline
    });
    const [period, setPeriod] = useState<Period>({
        startDate: '', endDate: ''
    });
    const [matchesData, setMatchesData] = useState<MatchesData | null>(null);
    const [listPeriodData, setListPeriodData] = useState<PeriodData[]>([]);
    
    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            const response = await fetch(
                `/api/kda?summonerName=${profile.name}&summonerTagline=${profile.tagline}&startDate=${period.startDate}&endDate=${period.endDate}`
            );
            setMatchesData((await response.json()) as MatchesData);
            if (matchesData) {
                setListPeriodData([...listPeriodData, {profile, period, matchesData}]);
            }
            setProfile({name: '', tagline: defaultTagline});
            setPeriod({startDate: '', endDate: ''});
            setMatchesData(null);
        } catch (error) {
            console.error('Error fetching KDA data:', error);
        }
    };
    
    const handleAutofill = (isStartDate: boolean) => {
        if (isStartDate)
            setPeriod({...period, startDate: process.env.NEXT_PUBLIC_AUTOFILL_START_DATE || ''});
        else
            setPeriod({...period, endDate: process.env.NEXT_PUBLIC_AUTOFILL_END_DATE || ''});
    };
    
    return (
        <div className="container">
            <div className="flex flex-col items-center py-10">
              <h1>Kda calculator</h1>
              <i>League of Legends</i>
            </div>
            <div className="flex justify-center">
                <form onSubmit={handleSearch} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Summoner Name"
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="mb-4 p-2 border  rounded-r-none rounded w-full focus:z-10"
                        />
                        <input
                            type="text"
                            placeholder="Tagline"
                            value={profile.tagline}
                            onChange={(e) => setProfile({...profile, tagline: e.target.value})}
                            className="mb-4 p-2 border rounded-l-none rounded w-1/3"
                        />
                    </div>
                    <div>
                        <div className="flex mb-4">
                            <input
                                type="datetime-local"
                                value={period.startDate}
                                onChange={(e) => setPeriod({...period, startDate: e.target.value})}
                                className="p-2 border rounded-r-none rounded w-full"
                            />
                            <button onClick={() => handleAutofill(true)} type="button" className="bg-emerald-500 text-white font-bold p-1 rounded-l-none rounded
                            hover:bg-emerald-400 duration-700 ease-in-out w-1/3">
                                {process.env.NEXT_PUBLIC_AUTOFILL}
                            </button>
                        </div>
                        <div className="flex mb-4">
                            <input
                                type="datetime-local"
                                value={period.endDate}
                                onChange={(e) => setPeriod({...period, endDate: e.target.value})}
                                className="p-2 border rounded-r-none rounded w-full"
                            />
                            <button onClick={() => handleAutofill(false)} type="button" className="bg-emerald-500 text-white font-bold p-1 rounded-l-none rounded
                            hover:bg-emerald-400 duration-700 ease-in-out w-1/3">
                                {process.env.NEXT_PUBLIC_AUTOFILL}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full
                    hover:bg-blue-400 duration-700 ease-in-out">
                        Search
                    </button>
                </form>
            </div>
            <div>
                <div>
                    {listPeriodData.map(({profile, period, matchesData}, index) => (
                        <div key={index}>
                            <h3>{profile.name}#{profile.tagline}</h3>
                            <p>Kills: {matchesData.kdaTotal.kills}</p>
                            <p>Deaths: {matchesData.kdaTotal.deaths}</p>
                            <p>Assists: {matchesData.kdaTotal.assists}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
