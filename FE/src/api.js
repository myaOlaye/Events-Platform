import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9090/api",
});

export const getEvents = () => {
  return api.get(`/events`).then(({ data: { events } }) => {
    return events;
  });
};

export const signUpUser = (reqBody) => {
  return api
    .post(`/users/signup`, reqBody, {
      withCredentials: true,
    })
    .then(({ data: { user } }) => {
      return user;
    });
};
