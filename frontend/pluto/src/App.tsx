import { useEffect } from 'react';
import { useState } from 'react';
import { z } from "zod"
import './App.css'
import { Card } from './components/ui/card';
import { MessageSquareWarning } from 'lucide-react';
import { Skeleton } from './components/ui/skeleton';
import { ViewPreGameAnalysisModal } from './components/ViewGameAnalysisModal';

const GamesDataResponseSchema = z.array(z.object({
  home_team: z.string(),
  away_team: z.string(),
  date: z.string(),
  venue_id: z.string()
}))

type GamesData = z.infer<typeof GamesDataResponseSchema>



const useGamesData = () => {
  const [data, setData] = useState<GamesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/games`);
      const result = await response.json();
      const parsedData = GamesDataResponseSchema.parse(result)
      setData(parsedData);

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

function App() {

  const { data, loading, error } = useGamesData()
  const [showGameAnalysisModal, setShowGameAnalysisModal] = useState(false)
  const [homeTeam, setHomeTeam] = useState<string | null>(null)
  const [awayTeam, setAwayTeam] = useState<string | null>(null)

  return (
    <div className='flex flex-col bg-red font-bold h-screen items-cent'>
      <div className='flex flex-col items-center gap-2'>
        <h1>
          Pluto Pre-Game Analysis
        </h1>
        <h2>
          Bet Smarter with Pluto: Your Pre-Game Analysis Platform for Predicting Sports Winners
        </h2>
      </div>

      {/* This is quite a hacky solution, will need to eventually find a way to enforce the home and away team being defined on the invocation of this modal */}
      {showGameAnalysisModal && homeTeam && awayTeam && <ViewPreGameAnalysisModal onClose={() => { setShowGameAnalysisModal(false) }} homeTeam={homeTeam} awayTeam={awayTeam} />}

      {/* Grid for games to look at and analyse */}
      <div className='flex flex-wrap justify-center gap-4 py-20'>

        {loading && <>
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' /><Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' /><Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' /><Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' /><Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' /><Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' /><Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' /><Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' /><Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
        </>}

        {!loading && (
          <div className='flex flex-wrap justify-center gap-4'>
            {data?.map((game) => (
              <Card className='w-[10rem] h-[10rem] p-4 bg-gray-400 hover:scale-105 duration-300 cursor-pointer' onClick={() => {
                setShowGameAnalysisModal(true)
                setHomeTeam(game.home_team)
                setAwayTeam(game.away_team)
              }}>
                {game.home_team} vs {game.away_team}
              </Card>
            ))}
          </div>
        )}


      </div>

      {error && !loading && <div className='bg-red-500 p-4 rounded-xl flex items-center justify-center gap-4'><MessageSquareWarning /> <p className='text-white'>Error retrieving game data from server!</p></div>}

    </div>
  )
}

export default App
