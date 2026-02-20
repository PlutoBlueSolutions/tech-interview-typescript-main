import express, { Express, Request, Response } from "express";
import path from "path";
import VehicleRepository from "./repositories/vehicle-repository";

export const createApp = (vehicleRepo: VehicleRepository) => {
    const app: Express = express();

    app.use(express.static(path.join(__dirname, "./client/dist")));

    app.get("/api/vehicles", (req: Request, res: Response) => {
        res.json(vehicleRepo.getAll());
    });

    app.get("/api/vehicles/makes", (req: Request, res: Response) => {
        res.json(vehicleRepo.getFiltered(["make"]));
    });

    app.get("/api/vehicles/makes/models", (req: Request, res: Response) => {
        res.json(vehicleRepo.getFiltered(["make", "model"]));
    });

    app.get("/api/vehicles/:filter", (req: Request, res: Response) => {
        res.json(vehicleRepo.getFiltered(req.params['filter'].toString().split("-") as any));
    });

    app.get("*", (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, "./client/dist/index.html"));
    });

    return app;
}