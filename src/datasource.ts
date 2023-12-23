import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [process.cwd() + '/dist/migrations/*.js'],
});
