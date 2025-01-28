import { useEffect } from 'react';
import { useState } from 'react';
import { z } from "zod"
import './App.css'
import { Card } from './components/ui/card';
import { MessageSquareWarning } from 'lucide-react';
import { Skeleton } from './components/ui/skeleton';

const GamesDataResponseSchema = z.object({
  games: z.array(z.object({}))
})

type GamesData = z.infer<typeof GamesDataResponseSchema>


const useGamesData = () => {
  const [data, setData] = useState<GamesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/games');
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

  return (
    <div className='flex flex-col bg-red font-bold h-screen items-cent'>
      <h1>
        Pluto Game Analysis
      </h1>

      {/* Grid for games to look at and analyse */}
      <div className='flex items-center justify-between gap-x-4 gap-y-4 py-20'>

        {loading && <>
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
          <Skeleton className='w-[10rem] h-[10rem]' />
        </>}

        {!loading && !error && <>
          {data?.games.map( (game) => {

            <Card>
              Hello
            </Card>

          } )}
        </>}

      </div>

      {error && <div className='bg-red-500 p-4 rounded-xl flex items-center justify-center gap-4'><MessageSquareWarning /> <p className='text-white'>Error retrieving game data from server!</p></div>}

    </div>
  )
}

export default App
