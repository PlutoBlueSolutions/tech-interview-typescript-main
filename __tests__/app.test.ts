import request from "supertest";
import { createApp } from "../app";
import VehicleRepository from "../repositories/vehicle-repository";
import { FilteredVehicles, Vehicle } from "../types/vehicles";

describe("Vehicle API Routes", () => {
    let mockRepo: jest.Mocked<VehicleRepository>;
    const validVehicle: Vehicle = {
        "price": 12999,
        "make": "BMW",
        "model": "1 SERIES",
        "trim": "118d SE 5dr [Nav]",
        "colour": "Alpine white",
        "co2_level": 104,
        "transmission": "Manual",
        "fuel_type": "Diesel",
        "engine_size": 1995,
        "date_first_reg": "28/12/2017",
        "mileage": 11271
    };
    const validVehicleData: FilteredVehicles = {
        title: "Valid Vehicle",
        vehicles: [validVehicle]
    }

    beforeEach(() => {
        mockRepo = {
            getAll: jest.fn(),
            getFiltered: jest.fn(),
        } as any;
    });

    it("GET /api/vehicles returns all vehicles", async () => {
        mockRepo.getAll.mockReturnValue([validVehicleData]);

        const app = createApp(mockRepo);
        const res = await request(app).get("/api/vehicles");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([validVehicleData]);
        expect(mockRepo.getAll).toHaveBeenCalled();
    });

    it("GET /api/vehicles/makes calls getFiltered with ['make']", async () => {
        mockRepo.getFiltered.mockReturnValue([validVehicleData]);

        const app = createApp(mockRepo);
        const res = await request(app).get("/api/vehicles/makes");

        expect(res.status).toBe(200);
        expect(mockRepo.getFiltered).toHaveBeenCalledWith(["make"]);
    });

    it("GET /api/vehicles/makes/models calls getFiltered with ['make','model']", async () => {
        const app = createApp(mockRepo);

        await request(app).get("/api/vehicles/makes/models");

        expect(mockRepo.getFiltered).toHaveBeenCalledWith(["make", "model"]);
    });

    it("GET /api/vehicles/:filter splits params correctly", async () => {
        const app = createApp(mockRepo);

        await request(app).get("/api/vehicles/make-model");

        expect(mockRepo.getFiltered).toHaveBeenCalledWith(["make", "model"]);
    });
});