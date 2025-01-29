import { useEffect } from 'react';
import { useState } from 'react';
import { z } from "zod"
import './App.css'
import { Card } from './components/ui/card';
import { MessageSquareWarning } from 'lucide-react';
import { Skeleton } from './components/ui/skeleton';

const GamesDataResponseSchema = z.array(z.object({
  home_team: z.string(),
  away_team: z.string(),
  date: z.string(),
  venue_id: z.string()
}))

type GamesData = z.infer<typeof GamesDataResponseSchema>

const VenueNameResponseSchema = z.string()

type VenueNameResponse = z.infer<typeof VenueNameResponseSchema>

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

const useVenueName = (venueId: string) => {
  const [venue_loading, setLoading] = useState(false);
  const [venue_error, setError] = useState<any>(null);
  const [venueName, setVenueName] = useState<VenueNameResponse | null>(null);

  const fetchData = async (venueId: string) => {
    setLoading(true);
    try {
      const venue_response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/venueName/${venueId}`);
      const venue_result = await venue_response.json();
      const venueParsedData = VenueNameResponseSchema.parse(venue_result)
      setVenueName(venueParsedData);

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(venueId);
  }, []);

  return { venueName, venue_loading, venue_error, refetch: fetchData };

}

function App() {

  const { data, loading, error } = useGamesData()
  const [showGameAnalysisModal, setShowGameAnalysisModal] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)

  console.log(data)

  return (
    <div className='flex flex-col bg-red font-bold h-screen items-cent'>
      <h1>
        Pluto Pre-Game Analysis
      </h1>
      <h2>
        Bet smarter
      </h2>

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
              <Card className='w-[10rem] h-[10rem] p-4 bg-gray-400 hover:scale-105 duration-300 cursor-pointer' onClick={() => { }}>
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
