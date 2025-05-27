import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9090/api",
});

export const getEvents = () => {
  return api
    .get(`/events`, {
      withCredentials: true,
    })
    .then(({ data: { events } }) => {
      return events;
    });
};

export const signupUser = (reqBody) => {
  return api.post(`/users/signup`, reqBody).then(({ data: { user } }) => {
    return user;
  });
};

export const loginUser = (reqBody) => {
  return api.post(`/users/login`, reqBody).then(({ data: { userData } }) => {
    return userData;
  });
};
