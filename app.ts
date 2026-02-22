import express, { Express, Request, Response } from "express";
import path from "path";
import VehicleRepository from "./repositories/vehicle-repository";

export const createApp = (vehicleRepo: VehicleRepository) => {
    const app: Express = express();

    app.use(express.static(path.join(__dirname, "./client/dist")));

    app.get("/api/navigation", (req: Request, res: Response) => {
        res.json(vehicleRepo.getNavigation());
    });

    app.get("/api/vehicles", (req: Request, res: Response) => {
        res.json(vehicleRepo.getAll(req.query as Record<string, string>));
    });

    // Extra endpoint to have a bit of fun with filtering - splits up the url by a dash, then filters each section. 
    // Example: make-model will filter by make, then by model. make-fuel_type-colour will filter first by make, then by fuel_type, then by colour.
    app.get("/api/vehicles/:filter", (req: Request, res: Response) => {
        res.json(vehicleRepo.getFiltered(req.params.filter.toString().split("|") as any, req.query as Record<string, string>));
    });

    app.get("*", (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, "./client/dist/index.html"));
    });

    return app;
}