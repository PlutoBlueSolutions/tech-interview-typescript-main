import fs from "fs";
import { FilteredVehicles, Vehicle } from "../types/vehicles";

class VehicleRepository {
  private _vehicles: Vehicle[];

  constructor() {
    const file = fs.readFileSync("./repositories/vehicles.json", "utf8");
    this._vehicles = JSON.parse(file);
  }

  filterVehicles(keys: (keyof Vehicle)[], vehicles: Vehicle[], depth: number): FilteredVehicles[] {
    if (depth >= keys.length)
      return [];

    const key = keys[depth];
    const grouped: Record<string, Vehicle[]> = {};

    for (const vehicle of vehicles) {
      const value = String(vehicle[key]);
      if (!grouped[value])
        grouped[value] = [];
      grouped[value].push(vehicle);
    }

    return Object.entries(grouped).map(([title, group]) => ({
      title,
      vehicles: depth === (keys.length - 1) ? group : [],
      children: depth < (keys.length - 1) ? this.filterVehicles(keys, group, depth + 1) : [],
    }));
  };

  getFiltered(keys: (keyof Vehicle)[]): FilteredVehicles[] {
    return this.filterVehicles(keys, this._vehicles, 0);
  }

  getAll(): FilteredVehicles[] {
    return [{ title: "All Vehicles", vehicles: this._vehicles }] as FilteredVehicles[];
  }
}

export default VehicleRepository;
