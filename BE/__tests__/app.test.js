const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../data/index");
require("dotenv").config({ path: "./BE/.env.secrets" });
const jwt = require("jsonwebtoken");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

const createToken = (role, id = 1) => {
  const payload = { id, name: "Test User", role };
  return jwt.sign(payload, process.env.JWT_SECRET);
};

describe("GET /api/events", () => {
  test("200: returns an array of all events for logged in user", () => {
    const token = createToken("community");
    const cookie = `access_token=${token}`;
    return request(app)
      .get("/api/events")
      .set("Cookie", [cookie])
      .expect(200)
      .then(({ body: { events } }) => {
        expect(events.length > 0);
        events.forEach((event) => {
          expect(event).toMatchObject({
            title: expect.any(String),
            description: expect.any(String),
            location: expect.any(String),
            date: expect.any(String),
            created_by: expect.any(Number),
            created_at: expect.any(String),
            image_url: expect.any(String),
          });
        });
      });
  });
  test("401: returns No token message for non logged in user", () => {
    return request(app)
      .get("/api/events")
      .expect(401)
      .then(({ body: { message } }) => {
        expect(message).toBe("No token");
      });
  });
});

describe("POST /api/events", () => {
  test("201: should allow staff to create an event and respond with event object", () => {
    const newEvent = {
      title: "new test event",
      description: "test event",
      location: "test location",
      date: "2025-06-21T18:00:00Z",
      image_url: "https://example.com/images/music-festival.jpg",
    };
    const token = createToken("staff");
    const cookie = `access_token=${token}`;

    return request(app)
      .post("/api/events")
      .set("Cookie", [cookie])
      .send(newEvent)
      .expect(201)
      .then(({ body: { newEvent } }) => {
        const expectedOutput = {
          id: expect.any(Number),
          title: "new test event",
          description: "test event",
          location: "test location",
          date: "2025-06-21T18:00:00.000Z",
          created_by: 1,
          image_url: "https://example.com/images/music-festival.jpg",
          created_at: expect.any(String),
        };
        expect(newEvent).toMatchObject(expectedOutput);
      });
  });
  test("403: should forbid community members from creating an event", () => {
    const newEvent = {
      title: "new test event",
      description: "test event",
      location: "test location",
      date: "2025-06-21T18:00:00Z",
      created_by: 3,
      image_url: "https://example.com/images/music-festival.jpg",
    };
    const token = createToken("community");
    const cookie = `access_token=${token}`;

    return request(app)
      .post("/api/events")
      .set("Cookie", [cookie])
      .send(newEvent)
      .expect(403)
      .then(({ body: { message } }) => {
        expect(message).toBe("Forbidden");
      });
  });
});

describe("GET /api/users/:user_id/events", () => {
  test("200: should return an array of all events a community member is signed up to", () => {
    const token = createToken("community", 2);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/2/events")
      .set("Cookie", cookie)
      .expect(200)
      .then(({ body: { events } }) => {
        expect(events.length).toBe(2);
        events.forEach((event) => {
          expect(event).toMatchObject({
            id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            location: expect.any(String),
            date: expect.any(String),
            created_by: expect.any(Number),
            image_url: expect.any(String),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("200: should return an array of all events a staff member is signed up to", () => {
    const token = createToken("staff", 4);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/4/events")
      .set("Cookie", cookie)
      .expect(200)
      .then(({ body: { events } }) => {
        expect(events.length).toBe(1);
        events.forEach((event) => {
          expect(event).toMatchObject({
            id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            location: expect.any(String),
            date: expect.any(String),
            created_by: expect.any(Number),
            image_url: expect.any(String),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("403: should return forbidden if a community user tries to access another users signups", () => {
    const token = createToken("community", 1);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/2/events")
      .set("Cookie", cookie)
      .expect(403)
      .then(({ body: { message } }) => {
        expect(message).toBe("Forbidden");
      });
  });
  test("403: should return forbidden if a staff member tries to access another users signups", () => {
    // This makes sense as we dont want all staff members to see all events that different users have signed up with as it may not be theres
    // may want to eventually extend so that a staff member can see all events a user has signed up to that they created
    const token = createToken("staff", 1);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/2/events")
      .set("Cookie", cookie)
      .expect(403)
      .then(({ body: { message } }) => {
        expect(message).toBe("Forbidden");
      });
  });
  test("200: should return an empty array if a user is signed up to no events", () => {
    const token = createToken("staff", 3);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/3/events")
      .set("Cookie", cookie)
      .expect(200)
      .then(({ body: { events } }) => {
        expect(events.length).toBe(0);
      });
  });

  test("400: responds with bad request if user_id is invalid data type", () => {
    const token = createToken("staff", 3);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/invalid/events")
      .set("Cookie", cookie)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});
