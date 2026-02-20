import { useEffect, useState } from 'react';
import './App.css';
import ListItem from './components/ListItem';
import { vehicleKeys, type FilteredVehicles } from './types/vehicles';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [vehiclesList, setVehiclesList] = useState<FilteredVehicles[]>([] as FilteredVehicles[]);
  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    if (filters)
      getData(filters.join("-"));
  }, [filters])

  const getData = async (route: string = "") => {
    setLoading(true);
    await fetch(`/api/vehicles/${route}`).then(async (vehicles) => {
      setVehiclesList(await vehicles.json());
    });
    setLoading(false);
  }

  const addFilter = (filterBy: string) => {
    const filterData: string[] = JSON.parse(JSON.stringify(filters));
    const filterIndex: number = filterData.findIndex((value: string) => value === filterBy);
    if (filterIndex >= 0)
      filterData.splice(filterIndex, 1);
    else
      filterData.push(filterBy);
    setFilters(filterData);
  }

  const removeFilter = (index: number) => {
    const filterData: string[] = JSON.parse(JSON.stringify(filters));
    filterData.splice(index, 1);
    setFilters(filterData);
  }

  return (
    <div className='content'>
      <div className='filter'>
        <b>Filter by:</b>
        <div className='filter-inner'>
          <button type='button' onClick={() => getData("")}>All Vehicles</button>
          <button type='button' onClick={() => getData("makes")}>Filter By Makes</button>
          <button type='button' onClick={() => getData("makes/models")}>Filter By Models</button>
        </div>
      </div>

      <div className='filter'>
        <b>Custom Filters:</b>
        <div className='filter-inner'>
          {
            vehicleKeys.map((key: string) => {
              return <label key={`filter-${key}`}>
                <input type='checkbox' onChange={() => addFilter(key)} checked={filters.includes(key)} />
                <span>{key.replace("_", " ")}</span>
              </label>
            })
          }
        </div>
      </div>

      {filters.length ? <div className='filter'>
        <b>Applied Fiilters:</b>
        <div className='filter-inner'>
          {
            filters.map((filter: string, index: number) => {
              return <label>
                <span>
                  {filter.replace("_", " ")}
                </span>
                <button onClick={() => removeFilter(index)}>Remove</button>
              </label>
            })
          }
        </div>
      </div> : <></>}

      {loading ? <h1>Loading...</h1> :
        vehiclesList.map((vehicleItem: FilteredVehicles) => {
          return <ListItem level={1} VehicleData={vehicleItem} />
        })
      }
    </div>
  )
}

export default App
