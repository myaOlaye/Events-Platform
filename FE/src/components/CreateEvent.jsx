import React, { useReducer, useEffect, useContext } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserInfoContext } from "../contexts/UserInfoContext";
import { createEvent } from "../api";
import axios from "axios";

const initialState = {
  title: "",
  description: "",
  location: "",
  date: "",
  imageFile: null,
  errors: {},
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const CreateEvent = () => {
  const { userInfo } = useContext(UserInfoContext);
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!userInfo.id) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (userInfo.role && userInfo.role !== "staff") {
      navigate("/unauthorised");
    }
  }, [userInfo.role, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!state.title.trim()) errors.title = "Title is required";
    if (!state.description.trim())
      errors.description = "Description is required";
    if (!state.location.trim()) errors.location = "Location is required";
    if (!state.date.trim()) errors.date = "Date is required";
    return errors;
  };

  const uploadImageToCloudinary = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Events-platform"); // Replace with your Cloudinary upload preset
    formData.append("cloud_name", "dhxm9kci5"); // Replace with your Cloudinary cloud name

    return axios
      .post("https://api.cloudinary.com/v1_1/dhxm9kci5/image/upload", formData)
      .then((res) => res.data.secure_url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors });
      return;
    }

    dispatch({ type: "SET_LOADING", loading: true });

    const proceedWithCreation = (imageUrl) => {
      const newEvent = {
        title: state.title,
        description: state.description,
        location: state.location,
        date: new Date(state.date).toISOString(),
        image_url:
          imageUrl ||
          "https://res.cloudinary.com/dhxm9kci5/image/upload/v1748883028/placeholder-img_qib2ks.jpg",
      };

      createEvent(newEvent)
        .then(() => {
          dispatch({ type: "RESET" });
          navigate("/");
        })
        .catch((err) => {
          const msg =
            err.response?.data?.msg ||
            (err.response?.status === 500
              ? "Something went wrong, try again later."
              : "Failed to create event.");
          dispatch({ type: "SET_ERRORS", errors: { general: msg } });
          dispatch({ type: "SET_LOADING", loading: false });
        });
    };

    if (state.imageFile) {
      uploadImageToCloudinary(state.imageFile)
        .then((url) => proceedWithCreation(url))
        .catch(() => {
          dispatch({
            type: "SET_ERRORS",
            errors: { general: "Image upload failed, try again." },
          });
          dispatch({ type: "SET_LOADING", loading: false });
        });
    } else {
      proceedWithCreation(""); // No image = default image will be used in backend
    }
  };

  return (
    <>
      <h2>Post a new event</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Event Name</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={state.title}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "title",
                value: e.target.value,
              })
            }
            isInvalid={!!state.errors.title}
          />
          <Form.Control.Feedback type="invalid">
            {state.errors.title}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={3}
            value={state.description}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "description",
                value: e.target.value,
              })
            }
            isInvalid={!!state.errors.description}
          />
          <Form.Control.Feedback type="invalid">
            {state.errors.description}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={state.location}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "location",
                value: e.target.value,
              })
            }
            isInvalid={!!state.errors.location}
          />
          <Form.Control.Feedback type="invalid">
            {state.errors.location}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date & Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="date"
            value={state.date}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "date",
                value: e.target.value,
              })
            }
            isInvalid={!!state.errors.date}
          />
          <Form.Control.Feedback type="invalid">
            {state.errors.date}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Event Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "imageFile",
                value: e.target.files[0],
              })
            }
          />
        </Form.Group>

        {state.errors.general && (
          <p className="text-danger">{state.errors.general}</p>
        )}

        <Button variant="primary" type="submit" disabled={state.loading}>
          {state.loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Upload Event"
          )}
        </Button>
      </Form>
    </>
  );
};

export default CreateEvent;
