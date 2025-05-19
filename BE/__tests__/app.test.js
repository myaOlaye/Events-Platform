const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../data/index");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET /api/events", () => {
  it("responds with object containing all events", () => {
    return request(app)
      .get("/api/events")
      .expect(200)
      .then(({ body: { events } }) => {
        expect(events.length).toBeGreaterThan(0);
        events.forEach((event) => {
          expect(event).toEqual({
            id: expect.any(Number),
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
});
