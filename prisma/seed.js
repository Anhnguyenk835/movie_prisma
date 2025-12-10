import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({
  connectionString: process.env.SUPABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Starting database seeding...");

  // Clear existing data
  await prisma.movie.deleteMany();
  await prisma.director.deleteMany();
  console.log("Cleared existing data");

  // Create directors
  const directors = await Promise.all([
    prisma.director.create({
      data: {
        name: "Christopher Nolan",
        movies: {
          create: [
            { title: "Inception", revenue: 836.8 },
            { title: "The Dark Knight", revenue: 1005.0 },
            { title: "Interstellar", revenue: 701.8 },
            { title: "Tenet", revenue: 365.3 },
            { title: "Dunkirk", revenue: 527.3 },
          ],
        },
      },
      include: { movies: true },
    }),

    prisma.director.create({
      data: {
        name: "Steven Spielberg",
        movies: {
          create: [
            { title: "Jurassic Park", revenue: 1029.2 },
            { title: "E.T.", revenue: 792.9 },
            { title: "Jaws", revenue: 476.5 },
            { title: "Saving Private Ryan", revenue: 482.3 },
            { title: "Indiana Jones", revenue: 389.9 },
          ],
        },
      },
      include: { movies: true },
    }),

    prisma.director.create({
      data: {
        name: "Quentin Tarantino",
        movies: {
          create: [
            { title: "Pulp Fiction", revenue: 213.9 },
            { title: "Django Unchained", revenue: 425.4 },
            { title: "Inglourious Basterds", revenue: 321.5 },
            { title: "Kill Bill Vol. 1", revenue: 180.9 },
            { title: "Once Upon a Time in Hollywood", revenue: 377.6 },
          ],
        },
      },
      include: { movies: true },
    }),

    prisma.director.create({
      data: {
        name: "Martin Scorsese",
        movies: {
          create: [
            { title: "The Wolf of Wall Street", revenue: 392.0 },
            { title: "Goodfellas", revenue: 46.8 },
            { title: "The Departed", revenue: 291.5 },
            { title: "Shutter Island", revenue: 294.8 },
            { title: "Casino", revenue: 116.1 },
          ],
        },
      },
      include: { movies: true },
    }),

    prisma.director.create({
      data: {
        name: "James Cameron",
        movies: {
          create: [
            { title: "Avatar", revenue: 2923.7 },
            { title: "Titanic", revenue: 2264.7 },
            { title: "Avatar: The Way of Water", revenue: 2320.3 },
            { title: "Terminator 2", revenue: 520.9 },
            { title: "Aliens", revenue: 131.1 },
          ],
        },
      },
      include: { movies: true },
    }),
  ]);

  console.log(`Created ${directors.length} directors`);

  const totalMovies = directors.reduce((sum, d) => sum + d.movies.length, 0);
  console.log(`Created ${totalMovies} movies`);

  console.log("\nSeeding Summary:");
  directors.forEach((director) => {
    console.log(`  - ${director.name}: ${director.movies.length} movies`);
  });

  console.log("\n🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
