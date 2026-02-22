export type VehicleDataSet = {
    VehicleData: FilteredVehicles[];
    Filter: Record<string, (string | number | Date)[]>;
}

export type FilteredVehicles = {
    title: string;
    vehicles?: Vehicle[];
    children: FilteredVehicles[];
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

export const vehicleKeys = [
    "make",
    "model",
    "colour",
    "price",
    "transmission",
    "fuel_type"
] as const;