"use client";

import React, {useState} from "react";

export default function Home() {
    const [summonerName, setSummonerName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [kdaList, setKdaList] = useState<Kda[]>([]);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            const response = await fetch(
                `/api/kda?summonerName=${summonerName}&startDate=${startDate}&endDate=${endDate}`
            );
            
            const data = await response.json();
            setKdaList(data);
        } catch (error) {
            console.error('Error fetching KDA data:', error);
        }
    };
    
    return (
        <div className="container">
            <div className="flex flex-col items-center py-10">
              <h1>Kda calculator</h1>
              <i>League of Legends</i>
            </div>
            <div className="flex justify-center">
                <form onSubmit={handleSearch} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                    <input
                        type="text"
                        placeholder="Summoner Name"
                        value={summonerName}
                        onChange={(e) => setSummonerName(e.target.value)}
                        className="mb-4 p-2 border rounded w-full"
                    />
                    <div>
                        <div className="flex mb-4">
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="p-2 border rounded-r-none rounded w-full"
                            />
                            <button type="button" className="bg-emerald-500 text-white font-bold p-1 rounded-l-none rounded
                            hover:bg-emerald-400 duration-700 ease-in-out">
                                autofill
                            </button>
                        </div>
                        <div className="flex mb-4">
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="p-2 border rounded-r-none rounded w-full"
                            />
                            <button type="button" className="bg-emerald-500 text-white font-bold p-1 rounded-l-none rounded
                            hover:bg-emerald-400 duration-700 ease-in-out">
                                autofill
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
                    {kdaList.map((kdaList) => (
                        <div>
                            <h3>Your KDA:</h3>
                            <p>Kills: {kdaList.kills}</p>
                            <p>Deaths: {kdaList.deaths}</p>
                            <p>Assists: {kdaList.assists}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
