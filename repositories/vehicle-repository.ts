import fs from "fs";
import { FilteredVehicles, Vehicle, VehicleDataSet, vehicleKeys } from "../types/vehicles";

class VehicleRepository {
  private _vehicles: Vehicle[];

  constructor() {
    const file = fs.readFileSync("./repositories/vehicles.json", "utf8");
    this._vehicles = JSON.parse(file);
  }

  getNavigation(): Record<string, string[]> {
    const navigation: Record<string, string[]> = {};
    const nav: (keyof Vehicle)[] = ["make", "transmission", "fuel_type", "colour"];

    for (const vehicle of this._vehicles) {
      nav.forEach((navItem: keyof Vehicle) => {
        let navValue: string = vehicle[navItem] as string;

        if (navItem === "colour")
          navValue = this.getColour(navValue);

        if (navigation[navItem]) {
          if (!navigation[navItem].includes(navValue))
            navigation[navItem].push(navValue);
        } else
          navigation[navItem] = [navValue]
      })
    }

    return navigation;
  }

  parseKey(rawKey: string): { key: keyof Vehicle; filterValue?: string; } {
    const match = rawKey.match(/^(\w+)(?:\[(.+)\])?$/);

    if (match)
      return {
        key: match[1] as keyof Vehicle,
        filterValue: match[2]?.toUpperCase()
      };

    return { key: rawKey as keyof Vehicle, filterValue: "" };
  }

  filterVehicles(keys: (keyof Vehicle)[], vehicles: Vehicle[], depth: number, query?: Record<string, string>): FilteredVehicles[] {
    if (depth >= keys.length)
      return [];

    const { key, filterValue } = this.parseKey(keys[depth]);

    if (filterValue) {
      vehicles = vehicles.filter(vehicle => {
        let vehicleValue = String(vehicle[key]).toUpperCase();

        if (key === "colour")
          vehicleValue = this.getColour(vehicleValue);

        return filterValue.split(",").includes(vehicleValue);
      });
    }

    const grouped: Record<string, Vehicle[]> = {};

    for (const vehicle of vehicles) {
      let value = String(vehicle[key]).toUpperCase();

      if (key === "colour")
        value = this.getColour(value);

      if (!grouped[value])
        grouped[value] = [];
      grouped[value].push(vehicle);
    }

    return Object.entries(grouped).map(([title, group]) => ({
      title,
      vehicles: depth === (keys.length - 1) ? this.getAll(query, group).VehicleData[0].vehicles : [],
      children: depth < (keys.length - 1) ? this.filterVehicles(keys, this.getAll(query, group).VehicleData[0].vehicles as Vehicle[], depth + 1, query) : [],
    }));
  };

  flattenVehicles(nodes: FilteredVehicles[]): Vehicle[] {
    const result: Vehicle[] = [];

    for (const node of nodes) {
      if (node.vehicles?.length) {
        result.push(...node.vehicles);
      }

      if (node.children?.length) {
        result.push(...this.flattenVehicles(node.children));
      }
    }

    return result;
  }

  getFiltered(keys: (keyof Vehicle)[], query?: Record<string, string>): VehicleDataSet {
    const baseData: FilteredVehicles[] = this.filterVehicles(keys, this._vehicles, 0);
    const vehicleData: FilteredVehicles[] = this.filterVehicles(keys, this._vehicles, 0, query);
    const vehicles: Vehicle[] = this.flattenVehicles(baseData);

    return {
      VehicleData: vehicleData,
      Filter: this.getFilters(vehicles as Vehicle[])
    };
  }

  getAll(query?: Record<string, string>, vehicles?: Vehicle[]): VehicleDataSet {
    let baseData: Vehicle[] = vehicles ?? this._vehicles;
    let vehicleData: Vehicle[] = baseData;

    if (query && Object.keys(query).length) {
      Object.entries(query).forEach(([key, rawValue]) => {
        const keyString = key as keyof Vehicle;
        const values = rawValue.split(",").map(v => v.toUpperCase());

        vehicleData = vehicleData.filter(vehicle => {
          let vehicleValue = String(vehicle[keyString]).toUpperCase();

          if (keyString === "colour") {
            vehicleValue = this.getColour(vehicleValue);
          }

          return values.includes(vehicleValue);
        });
      });
    }

    return { VehicleData: [{ title: "All Vehicles", vehicles: vehicleData }] as FilteredVehicles[], Filter: this.getFilters(baseData) };
  }

  getFilters(vehicles: Vehicle[]): Record<string, (string | number | Date)[]> {
    const filters: Record<string, (string | number | Date)[]> = {};

    if (vehicles.length) {
      for (const vehicle of vehicles) {
        vehicleKeys.forEach((key) => {
          let value = vehicle[key];
          value = typeof value === "string" ? value.toUpperCase() : value;

          if (key === "colour" && typeof value === "string") {
            value = this.getColour(value);
          }

          if (!filters[key])
            filters[key] = [];

          if (value && !filters[key].includes(value)) {
            const isDate = key.includes("date");
            if (isDate) {
              const splitDate = (value as string).split("/");
              value = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
            }

            filters[key].push(isDate ? new Date(value) : value);
          }
        })
      }
    }

    return filters;
  }

  getColour(colour: string): string {
    const baseColors = [
      "red",
      "blue",
      "black",
      "white",
      "grey",
      "silver",
      "orange",
      "yellow",
      "purple",
      "green",
      "brown",
      "beige",
      "gold",
      "steel"
    ];

    for (const base of baseColors) {
      if (colour.toLowerCase().replace("/", " ").split(" ").includes(base))
        colour = base.toUpperCase();
    }

    return colour;
  }
}

export default VehicleRepository;
