import { useEffect } from 'react';
import { useState } from 'react';
import './App.css'

const useGamesData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.0:8000');
      const result = await response.json();
      setData(result);
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

  const { data, loading, error} = useGamesData()

  return (
    <>
    <h1>
      Hello
      {data}
      {loading}
      {error}
    </h1>
    </>
  )
}

export default App
