const format = require("pg-format");
const db = require("../connection");
const { convertTimestampToDate } = require("./utils");

const seed = ({ eventsData, usersData, signupsData }) => {
  return db
    .query(`DROP TABLE IF EXISTS signups`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS events`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('community', 'staff')) DEFAULT 'community',
        created_at TIMESTAMP DEFAULT NOW())`);
    })
    .then(() => {
      return db.query(
        `CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        location TEXT NOT NULL,
        date TIMESTAMPTZ NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        image_url TEXT);`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE signups (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        event_id INTEGER REFERENCES events(id),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, event_id));`
      );
    })
    .then(() => {
      const formattedUsersData = usersData.map(convertTimestampToDate);
      const insertUsersQueryStr = format(
        `INSERT INTO users (first_name, last_name, email, password_hash, role, created_at) values %L;`,
        formattedUsersData.map(
          ({
            first_name,
            last_name,
            email,
            password_hash,
            role,
            created_at,
          }) => [first_name, last_name, email, password_hash, role, created_at]
        )
      );

      return db.query(insertUsersQueryStr);
    })
    .then(() => {
      const formattedEventsData = eventsData.map(convertTimestampToDate);
      const insertEventsQueryStr = format(
        `INSERT INTO events (title, description, location, date, created_by, created_at, image_url) values %L;`,
        formattedEventsData.map(
          ({
            title,
            description,
            location,
            date,
            created_by,
            created_at,
            image_url,
          }) => [
            title,
            description,
            location,
            date,
            created_by,
            created_at,
            image_url,
          ]
        )
      );

      return db.query(insertEventsQueryStr);
    })
    .then(() => {
      const formattedSignupsData = signupsData.map(convertTimestampToDate);
      const insertSignupsQueryStr = format(
        `INSERT INTO signups (user_id, event_id, created_at) values %L;`,
        formattedSignupsData.map(({ user_id, event_id, created_at }) => [
          user_id,
          event_id,
          created_at,
        ])
      );

      return db.query(insertSignupsQueryStr);
    });
};

module.exports = seed;
