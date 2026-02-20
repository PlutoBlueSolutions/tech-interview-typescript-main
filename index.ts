import VehicleRepository from "./repositories/vehicle-repository";
import { createApp } from "./app";

const port = 3000;

const vehicleRepo = new VehicleRepository();

const app = createApp(vehicleRepo);

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});