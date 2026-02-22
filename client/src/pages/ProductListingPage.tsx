import { useEffect, useState } from "react";
import { vehicleKeys, type FilteredVehicles, type VehicleDataSet } from "../types/vehicles";
import ListItem from "../components/listItem/ListItem";

interface Props {
    route?: string;
    query?: string;
}

const ProductListingPage: React.FC<Props> = ({ route, query }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [vehiclesList, setVehiclesList] = useState<FilteredVehicles[]>([] as FilteredVehicles[]);
    const [sidebarFilters, setSidebarFilters] = useState<Record<string, (string | number | Date)[]>>({});
    const [activeFilters, setActiveFilters] = useState<Record<string, (string | number | Date)[]>>({});
    const [filters, setFilters] = useState<string[]>([]);

    useEffect(() => {
        if (query) {
            const searchData: string[] = query.split("&");
            const filterList: Record<string, (string | number | Date)[]> = {};

            for (const searchItem of searchData) {
                const splitData: string[] = searchItem.split("=");
                filterList[splitData[0]] = splitData[1].split(",").map((value: string) => decodeURIComponent(value));
            }

            setActiveFilters(filterList);
        }

        if (route)
            setFilters(route.split("|"));

        getData(`${route ? "/" : ""}${route}${query ? "?" : ""}${query}`);
    }, [route, query])

    const getData = async (route: string = "") => {
        setLoading(true);
        await fetch(`/api/vehicles${route}`).then(async (response) => {
            if (response.ok) {
                const responseData: VehicleDataSet = await response.json();
                setVehiclesList(responseData.VehicleData);
                setSidebarFilters(responseData.Filter || []);
            }
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
        navigateToURL(activeFilters, filterData);
    }

    const removeFilter = (index: number) => {
        const filterData: string[] = JSON.parse(JSON.stringify(filters));
        filterData.splice(index, 1);
        navigateToURL(activeFilters, filterData);
    }

    const addSidebarFilter = (title: string, value: (string | number | Date)) => {
        const filterList: Record<string, (string | number | Date)[]> = JSON.parse(JSON.stringify(activeFilters));

        if (filterList[title]) {
            const index: number = filterList[title].findIndex((val: string | number | Date) => val === value);
            if (index >= 0)
                filterList[title].splice(index, 1);
            else
                filterList[title].push(value);
        } else {
            filterList[title] = [value];
        }

        navigateToURL(filterList, filters);
    }

    const navigateToURL = (activeFilterList: Record<string, (string | number | Date)[]>, filterList: string[]) => {
        let routeData: string = "";

        Object.keys(activeFilterList).map((key: string, index: number) => {
            if (activeFilterList[key].length)
                routeData += `${(index ? "&" : "?")}${key}=${activeFilterList[key].join(",")}`;
        });

        if (filterList.length)
            routeData += (routeData ? "&" : "?") + `query=${filterList.join("|")}`;

        location.href = `${location.pathname}${routeData}`;
    }

    return <>
        <div className='sidebar'>
            {
                Object.keys(sidebarFilters).map((key: string) => {
                    const title = key.replaceAll("_", " ");
                    let min = 0;
                    let max = 0;

                    switch (typeof sidebarFilters[key][0]) {
                        case "number":
                            min = Math.min(...sidebarFilters[key] as number[]);
                            max = Math.max(...sidebarFilters[key] as number[]);

                            return <div className='input'>
                                <b>{title}</b>
                                <input type='number' min={min} max={max} placeholder={min.toString()} />
                                <input type='number' min={min} max={max} placeholder={max.toString()} />
                            </div>
                        case "string":
                            return <div className='input'>
                                <b>{title}</b>
                                {
                                    sidebarFilters[key].map((value) => {
                                        const valueString: string = (value as string).toUpperCase();

                                        return <label>
                                            <input type='checkbox' onChange={() => addSidebarFilter(key, valueString)} checked={activeFilters[key] ? activeFilters[key].includes(valueString) : false} />
                                            <span>{value as string}</span>
                                        </label>
                                    })
                                }
                            </div>
                        default:
                            return <></>
                    }
                })
            }
        </div>

        <div className='content-inner'>
            <div className='filter'>
                <b>Filter by:</b>
                <div className='filter-inner'>
                    <button type='button' onClick={() => navigateToURL(activeFilters, [])}>All Vehicles</button>
                    <button type='button' onClick={() => navigateToURL(activeFilters, ["make"])}>Filter By Makes</button>
                    <button type='button' onClick={() => navigateToURL(activeFilters, ["make", "model"])}>Filter By Models</button>
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
    </>
}

export default ProductListingPage;