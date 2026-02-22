import { useEffect, useState } from 'react';
import './App.css';
import ProductListingPage from './pages/ProductListingPage';
import Header from './components/header/header';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [route, setRoute] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    const search: string = location.search.replace("?", "");
    let routeData: string = "";
    let queryData: string = "";

    if (search) {
      const searchData: string[] = search.split("&");

      for (const searchItem of searchData) {
        const splitData: string[] = searchItem.split("=");

        if (splitData[0] === "query")
          routeData = splitData[1];
        else
          queryData += `${queryData ? "&" : ""}${splitData[0]}=${splitData[1]}`;
      }
    }

    setRoute(routeData);
    setQuery(queryData);
    setLoading(false);
  }, [])

  return (
    <div className='content'>
      <Header />
      {loading ? <></> : <ProductListingPage route={route} query={query} />}
    </div>
  )
}

export default App
