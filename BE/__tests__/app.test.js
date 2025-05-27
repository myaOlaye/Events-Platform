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
  const payload = { id, firstName: "Test", lastName: "User", role };
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
  test("401: returns No token msg for non logged in user", () => {
    return request(app)
      .get("/api/events")
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No token");
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
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Forbidden");
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
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Forbidden");
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
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Forbidden");
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
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users/:user_id/events/:event_id/status", () => {
  test("200: Responds yes if user is signed up", () => {
    const token = createToken("community", 2);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/2/events/2/status")
      .set("Cookie", cookie)
      .expect(200)
      .then(({ body: { status } }) => {
        expect(status).toBe("User 2 is signed up for event 2");
      });
  });
  test("200: Responds no if user is not signed up", () => {
    const token = createToken("community", 2);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/2/events/1/status")
      .set("Cookie", cookie)
      .expect(200)
      .then(({ body: { status } }) => {
        expect(status).toBe("User 2 is not signed up for event 1");
      });
  });
  test("403: Responds forbidden if a staff member tries to see if another user is signed up for an event", () => {
    const token = createToken("staff", 3);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/2/events/2/status")
      .set("Cookie", cookie)
      .expect(403)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Forbidden");
      });
  });
  test("403: Responds forbidden if a community member tries to see if another user is signed up for an event", () => {
    const token = createToken("community", 1);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/2/events/2/status")
      .set("Cookie", cookie)
      .expect(403)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Forbidden");
      });
  });
  test("400: Responds bad request if user_id is invalid data type", () => {
    const token = createToken("staff", 3);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/invalid/events/2/status")
      .set("Cookie", cookie)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("400: Responds bad request if event_id is invalid data type", () => {
    const token = createToken("staff", 3);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/3/events/invalid/status")
      .set("Cookie", cookie)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users/:user_id/created-events", () => {
  test("200: Should return an array of events created by a staff member", () => {
    const token = createToken("staff", 3);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/3/created-events")
      .set("Cookie", cookie)
      .expect(200)
      .then(({ body: { createdEvents } }) => {
        expect(createdEvents.length).toBe(2);
        createdEvents.forEach((event) => {
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
  test("200: Should return an empty array if a staff member has not created any events", () => {
    const token = createToken("staff", 5);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/5/created-events")
      .set("Cookie", cookie)
      .expect(200)
      .then(({ body: { createdEvents } }) => {
        expect(createdEvents.length).toBe(0);
      });
  });
  test("403: Should return forbidden if a community member tries to access this endpoint", () => {
    const token = createToken("community", 1);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/1/created-events")
      .set("Cookie", cookie)
      .expect(403)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Forbidden");
      });
  });
  test("403: Should return forbidden if a staff member tries to access another staff members created events", () => {
    const token = createToken("staff", 5);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/3/created-events")
      .set("Cookie", cookie)
      .expect(403)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Forbidden");
      });
  });
  test("400: Should return bad request if user_id is invalid data type", () => {
    const token = createToken("staff", 5);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/invalid/created-events")
      .set("Cookie", cookie)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("GET /api/event/:event_id", () => {
  test("200: responds with given event when request made by staff member", () => {
    const token = createToken("staff", 3);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/events/1")
      .set("Cookie", [cookie])
      .expect(200)
      .then(({ body: { event } }) => {
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
  test("200: responds with given event when request made by community member", () => {
    const token = createToken("community", 1);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/events/1")
      .set("Cookie", [cookie])
      .expect(200)
      .then(({ body: { event } }) => {
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
  test("404: responds with Not found when event of given id does not exist", () => {
    const token = createToken("community", 1);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/events/100")
      .set("Cookie", [cookie])
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  test("400: responds with bad request when invalid id data type", () => {
    const token = createToken("community", 1);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/events/invalid")
      .set("Cookie", [cookie])
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/events/:event_id", () => {
  test("204: responds with empty object (no content) after authorised staff member deletes an event", () => {
    const token = createToken("staff", 3);
    const cookie = `access_token=${token}`;

    return request(app)
      .delete("/api/events/1")
      .set("Cookie", cookie)
      .expect(204)
      .then(({ body }) => {
        expect(body).toMatchObject({});
      });
  });
  test("403: responds with Forbidden if staff member who did not create the event tries to delete it", () => {
    const token = createToken("staff", 4);
    const cookie = `access_token=${token}`;

    return request(app)
      .delete("/api/events/1")
      .set("Cookie", cookie)
      .expect(403)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Forbidden");
      });
  });
  test("403: responds with forbidden if community member tries to delete event", () => {
    const token = createToken("community", 1);
    const cookie = `access_token=${token}`;

    return request(app)
      .delete("/api/events/1")
      .set("Cookie", cookie)
      .expect(403)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Forbidden");
      });
  });
  test("404: Responds with Not found if event id does not exist", () => {
    const token = createToken("staff", 3);
    const cookie = `access_token=${token}`;

    return request(app)
      .delete("/api/events/100")
      .set("Cookie", cookie)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });

  test("400: Responds with bad request if event_id is invalid data type", () => {
    const token = createToken("staff", 3);
    const cookie = `access_token=${token}`;

    return request(app)
      .delete("/api/events/invalid")
      .set("Cookie", cookie)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("POST /api/signups", () => {
  test("200: Returns signup object when signup successfully created for staff member", () => {
    const token = createToken("staff", 3);
    const cookie = `access_token=${token}`;
    const newSignUp = { user_id: 3, event_id: 2 };

    return request(app)
      .post("/api/signups")
      .set("Cookie", cookie)
      .send(newSignUp)
      .expect(200)
      .then(({ body: { signup } }) => {
        expect(signup).toMatchObject({
          id: expect.any(Number),
          user_id: expect.any(Number),
          event_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("200: Returns signup object when signup successfully created for community member", () => {
    const token = createToken("community", 1);
    const cookie = `access_token=${token}`;
    const newSignUp = { user_id: 1, event_id: 3 };

    return request(app)
      .post("/api/signups")
      .set("Cookie", cookie)
      .send(newSignUp)
      .expect(200)
      .then(({ body: { signup } }) => {
        expect(signup).toMatchObject({
          id: expect.any(Number),
          user_id: expect.any(Number),
          event_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("403: Returns forbidden when user tries to sign up another user for an event", () => {
    const token = createToken("staff", 3);
    const cookie = `access_token=${token}`;
    const newSignUp = { user_id: 1, event_id: 2 };

    return request(app)
      .post("/api/signups")
      .set("Cookie", cookie)
      .send(newSignUp)
      .expect(403)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Forbidden");
      });
  });
  test("409: Returns conflict when user tries to sign up for an event they're already signed up for", () => {
    const token = createToken("community", 1);
    const cookie = `access_token=${token}`;
    const newSignUp = { user_id: 1, event_id: 1 };

    return request(app)
      .post("/api/signups")
      .set("Cookie", cookie)
      .send(newSignUp)
      .expect(409)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Conflict");
      });
  });
});

describe("GET /api/users/auth/me", () => {
  test("200: returns user info when user has access token (is logged in)", () => {
    const token = createToken("staff", 3);
    const cookie = `access_token=${token}`;

    return request(app)
      .get("/api/users/auth/me")
      .set("Cookie", cookie)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          id: 3,
          firstName: expect.any(String),
          lastName: expect.any(String),

          role: "staff",
        });
      });
  });
  test("401: returns unauthorised when user is not logged in and therefore has no access token", () => {
    return request(app)
      .get("/api/users/auth/me")
      .expect(401)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No token");
      });
  });
});
