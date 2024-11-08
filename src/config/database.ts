import { DataSource } from "typeorm";
import { Anime } from "../entities/Anime";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    entities: [Anime],
    synchronize: true,
    logging: false,
});