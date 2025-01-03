"use client";

import React, {useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import {MatchesData} from "@/components/types/global";

export interface Profile {
    name: string;
    tagline: string;
}

export interface Period {
    startDate: string;
    endDate: string;
}

interface PeriodData {
    profile: Profile;
    period: Period;
    matchesData: MatchesData;
}

export default function Home() {
    const defaultTagline = 'EUW';
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<Profile>({
        name: '', tagline: defaultTagline
    });
    const [period, setPeriod] = useState<Period>({
        startDate: '', endDate: ''
    });
    const [listPeriodData, setListPeriodData] = useState<PeriodData[]>([]);
    
    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!profile.name || !profile.tagline || !period.startDate || !period.endDate){
            toast.error('Please fill all fields !');
            return;
        }else if (period.startDate >= period.endDate || period.endDate >= new Date().toISOString().slice(0, 16)){
            toast.error('Invalid date range !');
            return;
        }
        setLoading(true);
        try{
            const response = await fetch(
                `/api/kda?summonerName=${profile.name}&summonerTagline=${profile.tagline}&startDate=${period.startDate}&endDate=${period.endDate}`
            );
            const matchesData = await response.json();
            if (!matchesData || matchesData.error || !matchesData.nbMatches){
                if (matchesData.error){
                    toast.error(matchesData.error);
                }else{
                    toast.error('Error fetching data ! Please try again later.');
                }
            }else{
                setListPeriodData([...listPeriodData, {profile, period, matchesData}]);
                toast.success('Data fetched successfully !');
                setProfile({name: '', tagline: defaultTagline});
                setPeriod({startDate: '', endDate: ''});
            }
            setLoading(false);
        } catch {
            toast.error('Error fetching data !');
            setLoading(false);
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
            <ToastContainer position="bottom-right"/>
            <div className="flex justify-center mb-4 text-blue-950">
                <form onSubmit={handleSearch} className="p-4 w-full max-w-sm">
                    <label className="text-white font-bold text-xs">Profile</label>
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Summoner Name"
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="p-2 border  rounded-r-none rounded w-full focus:z-10"
                        />
                        <input
                            type="text"
                            placeholder="Tagline"
                            value={profile.tagline}
                            onChange={(e) => setProfile({...profile, tagline: e.target.value})}
                            className="p-2 border rounded-l-none rounded w-1/3"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-white font-bold text-xs">From</label>
                        <div className="flex">
                            <input
                                type="datetime-local"
                                value={period.startDate}
                                onChange={(e) => setPeriod({...period, startDate: e.target.value})}
                                className="p-2 border rounded-r-none rounded w-full"
                            />
                            <button onClick={() => handleAutofill(true)} type="button" className="bg-gradient-to-r from-green-600 to-black
                            text-white font-bold p-1 rounded-l-none rounded w-1/3 hover:text-yellow-500 duration-700">
                                {process.env.NEXT_PUBLIC_AUTOFILL}
                            </button>
                        </div>
                        <label className="text-white font-bold text-xs">To</label>
                        <div className="flex">
                            <input
                                type="datetime-local"
                                value={period.endDate}
                                onChange={(e) => setPeriod({...period, endDate: e.target.value})}
                                className="p-2 border rounded-r-none rounded w-full"
                            />
                            <button onClick={() => handleAutofill(false)} type="button" className="bg-gradient-to-r from-green-600 to-black
                             text-white font-bold p-1 rounded-l-none rounded w-1/3 hover:text-yellow-500 duration-700">
                                {process.env.NEXT_PUBLIC_AUTOFILL}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold p-2 rounded w-full
                    hover:scale-105 duration-700 ease-in-out flex justify-center">
                        {loading ? <div className="loading-spinner"></div> : 'Search'}
                    </button>
                </form>
            </div>
            <div className="mb-2">
                <div className="flex flex-col items-center">
                    {listPeriodData.map(({profile, period, matchesData}, index) => (
                        <div key={index}
                             className="w-full max-w-sm py-1 px-2 border-b-2 border-b-blue-950 bg-blue-900 font-bold relative">
                            {profile.name == process.env.NEXT_PUBLIC_SPECIAL_EVENT_SUMMONER_NAME ?
                                <Image src={'/cheems.png'} alt="special event"
                                       width={48} height={48} className="absolute right-2 top-1"/> :
                                <Image src={'/swole.png'} alt="no event"
                                       width={48} height={48} className="absolute right-2 top-1"/>
                            }
                            <div className="text-yellow-500">
                                {profile.name}#{profile.tagline}
                            </div>
                            <div className="my-2 text-white">
                                <div className="flex justify-center gap-4">
                                    <p className="font-light">Average:</p>
                                    <p className={matchesData.kdaTotal.kills >= matchesData.kdaTotal.deaths ? 'text-green-400' : 'text-red-400'}>
                                        {(matchesData.kdaTotal.kills / matchesData.nbMatches).toFixed(1)} / {(matchesData.kdaTotal.deaths / matchesData.nbMatches).toFixed(1)} / {(matchesData.kdaTotal.assists / matchesData.nbMatches).toFixed(1)}
                                    </p>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <p className="font-light">Total:</p>
                                    <p className={matchesData.kdaTotal.kills >= matchesData.kdaTotal.deaths ? 'text-green-400' : 'text-red-400'}>
                                        {matchesData.kdaTotal.kills} / {matchesData.kdaTotal.deaths} / {matchesData.kdaTotal.assists}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs italic font-light text-gray-300">
                                <div>
                                    {matchesData.nbMatches} games
                                </div>
                                <div>
                                    {(new Date(period.startDate)).toLocaleString('fr-FR')} - {(new Date(period.endDate)).toLocaleString('fr-FR')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
