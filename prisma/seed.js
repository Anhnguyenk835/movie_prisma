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
  await prisma.review.deleteMany();
  await prisma.movieActor.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.actor.deleteMany();
  await prisma.user.deleteMany();
  await prisma.director.deleteMany();
  console.log(
    "Cleared existing data (reviews, movieActors, movies, actors, users, directors)"
  );

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

  // Helper: map movie title to id for later relations
  const moviesByTitle = {};
  directors.forEach((d) => {
    d.movies.forEach((m) => {
      moviesByTitle[m.title] = m.id;
    });
  });

  // Create users
  const users = await prisma.user.createMany({
    data: [
      { email: "u1@example.com", name: "Alice" },
      { email: "u2@example.com", name: "Bob" },
      { email: "u3@example.com", name: "Charlie" },
      { email: "u4@example.com", name: "Diana" },
      { email: "u5@example.com", name: "Eve" },
    ],
  });
  console.log(`Created ${users.count} users`);

  // Create actors
  const actors = await prisma.actor.createMany({
    data: [
      { name: "Leonardo DiCaprio" },
      { name: "Christian Bale" },
      { name: "Tom Hardy" },
      { name: "Joseph Gordon-Levitt" },
      { name: "Elliot Page" },
      { name: "Matthew McConaughey" },
      { name: "Cillian Murphy" },
      { name: "Samuel L. Jackson" },
      { name: "Uma Thurman" },
      { name: "Brad Pitt" },
    ],
  });
  console.log(`Created ${actors.count} actors`);

  // Attach actors to a few movies (many-to-many) using simple matching by title list
  const actorRecords = await prisma.actor.findMany();
  const actorByName = {};
  actorRecords.forEach((a) => {
    actorByName[a.name] = a.id;
  });

  const movieActorPairs = [
    ["Inception", "Leonardo DiCaprio"],
    ["Inception", "Joseph Gordon-Levitt"],
    ["Inception", "Tom Hardy"],
    ["The Dark Knight", "Christian Bale"],
    ["The Dark Knight", "Cillian Murphy"],
    ["Interstellar", "Matthew McConaughey"],
    ["Pulp Fiction", "Samuel L. Jackson"],
    ["Pulp Fiction", "Uma Thurman"],
    ["Once Upon a Time in Hollywood", "Brad Pitt"],
  ].flatMap(([movieTitle, actorName]) => {
    const movieId = moviesByTitle[movieTitle];
    const actorId = actorByName[actorName];
    return movieId && actorId ? [{ movieId, actorId }] : [];
  });

  if (movieActorPairs.length) {
    const createdLinks = await prisma.movieActor.createMany({
      data: movieActorPairs,
      skipDuplicates: true,
    });
    console.log(
      `Linked actors to movies (MovieActor rows): ${createdLinks.count}`
    );
  }

  // Create reviews with varied ratings for stats testing
  const reviewPayload = [
    {
      movie: "Inception",
      rating: 5,
      userEmail: "u1@example.com",
      content: "Mind-blowing",
    },
    {
      movie: "Inception",
      rating: 4,
      userEmail: "u2@example.com",
      content: "Great visuals",
    },
    {
      movie: "The Dark Knight",
      rating: 5,
      userEmail: "u3@example.com",
      content: "Best Batman",
    },
    {
      movie: "Interstellar",
      rating: 4,
      userEmail: "u4@example.com",
      content: "Space epic",
    },
    {
      movie: "Interstellar",
      rating: 3,
      userEmail: "u5@example.com",
      content: "Long but good",
    },
    {
      movie: "Pulp Fiction",
      rating: 5,
      userEmail: "u1@example.com",
      content: "Classic",
    },
    {
      movie: "Jurassic Park",
      rating: 4,
      userEmail: "u2@example.com",
      content: "Dinosaurs!",
    },
    {
      movie: "Avatar",
      rating: 2,
      userEmail: "u3@example.com",
      content: "Too long",
    },
    {
      movie: "Titanic",
      rating: 1,
      userEmail: "u4@example.com",
      content: "Not for me",
    },
    {
      movie: "Tenet",
      rating: 2,
      userEmail: "u5@example.com",
      content: "Confusing",
    },
  ];

  // Fetch user ids by email for FK mapping
  const userRecords = await prisma.user.findMany();
  const userByEmail = {};
  userRecords.forEach((u) => {
    userByEmail[u.email] = u.id;
  });

  const reviewsToCreate = reviewPayload
    .map((r) => ({
      movieId: moviesByTitle[r.movie],
      userId: userByEmail[r.userEmail],
      rating: r.rating,
      content: r.content,
    }))
    .filter((r) => r.movieId && r.userId);

  if (reviewsToCreate.length) {
    const createdReviews = await prisma.review.createMany({
      data: reviewsToCreate,
    });
    console.log(`Created ${createdReviews.count} reviews`);
  }

  console.log("\nSeeding Summary:");
  directors.forEach((director) => {
    console.log(`  - ${director.name}: ${director.movies.length} movies`);
  });

  console.log("\nReview Summary (for stats testing):");
  const reviewAgg = await prisma.review.groupBy({
    by: ["rating"],
    _count: { rating: true },
    orderBy: { rating: "asc" },
  });
  reviewAgg.forEach((r) => {
    console.log(`  - ${r.rating} star: ${r._count.rating} reviews`);
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
