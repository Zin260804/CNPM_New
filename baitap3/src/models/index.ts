import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";
import configFile from "../config/config.json";

const basename = path.basename(__filename);
const env = (process.env.NODE_ENV as "development" | "production" | "test") || "development";
const config = (configFile as any)[env];

interface DB {
    [key: string]: any;
    sequelize?: Sequelize;
    Sequelize?: typeof Sequelize;
}

const db: DB = {};

let sequelize: Sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
    .filter((file: string) => {
        return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".ts" && // nếu chạy ts trực tiếp
            file.indexOf(".test.ts") === -1
        );
    })
    .forEach((file: string) => {
        const model = require(path.join(__dirname, file)).default(sequelize, DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName: string) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
