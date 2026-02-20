export type FilteredVehicles = {
    title: string;
    vehicles?: Vehicle[];
    children?: FilteredVehicles[];
}

export type Vehicle = {
    make: string;
    model: string;
    trim: string;
    colour: string;
    price: number;
    co2_level: number;
    transmission: string;
    fuel_type: string;
    engine_size: number;
    date_first_reg: string;
    mileage: number
};