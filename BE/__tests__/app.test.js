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

const createToken = (role) => {
  const payload = { id: 1, name: "Test User", role };
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
