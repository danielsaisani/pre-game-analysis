import { useEffect } from "react";
import { z } from "zod";
import { Modal } from "./ui/modal";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Histogram } from "./ui/histogram";
import { transformData } from "../lib/utils";

const SimulationsDataResponseSchema = z.array(z.object({
    team_name: z.string(),
    simulation_run: z.number(),
    results: z.number()
}))

type SimulationsData = z.infer<typeof SimulationsDataResponseSchema>


const useSimulationsData = (teamName: string) => {
    const [data, setData] = useState<SimulationsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchData = async (teamName: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/simulations/${teamName}`);
            const result = await response.json();
            const parsedData = SimulationsDataResponseSchema.parse(result)
            setData(parsedData);

        } catch (err) {
            setError(err);
            console.error(error)
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData(teamName);
    }, []);

    return { data, loading };
};

interface ViewPreGameAnalysisModalProps {
    onClose: (closed: boolean) => void
    homeTeam: string
    awayTeam: string
}

export function ViewPreGameAnalysisModal({ onClose, homeTeam, awayTeam }: ViewPreGameAnalysisModalProps) {

    const { data: homeTeamData, loading: homeTeamLoading } = useSimulationsData(homeTeam);
    const { data: awayTeamData, loading: awayTeamLoading } = useSimulationsData(awayTeam);

    const loading = homeTeamLoading || awayTeamLoading

    let tally = 0
    if (homeTeamData && awayTeamData) {
        for (let i = 0; i < homeTeamData?.length; i++) {

            if (homeTeamData[i].results > awayTeamData[i].results) {
                tally++
            }
        }
    }

    const winningRate = homeTeamData ? (tally / homeTeamData.length) * 100 : 0

    const combinedData = transformData([
        ...(homeTeamData || []),
        ...(awayTeamData || [])
    ]);

    return (
        <Modal onClose={onClose}>
            <h1>{homeTeam} vs {awayTeam}</h1>
            <h2>(Home: {homeTeam} | Away: {awayTeam})</h2>
            <div className="flex flex-col px-50 gap-24">
                {loading && (!homeTeamData && !awayTeamData) && <div className="flex justify-center items-center"><Skeleton className="w-[40rem] h-[30rem]" /></div>}
                {homeTeamData && awayTeamData && <div className="w-[20rem]">
                    <Histogram width={700} height={400} data={combinedData} />
                </div>}
                {loading && <div className="flex justify-center items-center"><Skeleton className="w-[10rem] h-[5rem]" /></div>}
                {!loading && homeTeam && winningRate && <span>
                    Winning rate for home team, {homeTeam} is {winningRate.toFixed(2)} %
                </span>}
            </div>
        </Modal>
    )
}