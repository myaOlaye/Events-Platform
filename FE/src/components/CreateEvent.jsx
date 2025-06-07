import React, { useReducer, useEffect, useContext, useRef } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserInfoContext } from "../contexts/UserInfoContext";
import { createEvent } from "../api";
import axios from "axios";
import styles from "./CreateEvent.module.css";

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
  const headingRef = useRef(null);

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

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

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
          navigate("/your-events/organising");
        })
        .catch((err) => {
          const msg =
            err.response?.data?.msg ||
            (err.response?.status === 500
              ? "Something went wrong, try again later."
              : "Failed to create event. Please try again later.");
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

  const getLocalDateTime = () => {
    const now = new Date();
    now.setSeconds(0, 0); // optional: remove seconds & milliseconds
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  };

  return (
    <div className={styles.eventFormContainer}>
      <h1 className={styles.formTitle} tabIndex="-1" ref={headingRef}>
        Post a New Event
      </h1>

      {state.errors.general && (
        <p
          className={styles.generalError}
          role="alert"
          aria-live="assertive"
          id="general-error"
        >
          {state.errors.general}
        </p>
      )}

      <Form onSubmit={handleSubmit} className={styles.eventForm} noValidate>
        <Form.Group controlId="event-title" className={styles.formGroup}>
          <Form.Label className={styles.label}>Event Name</Form.Label>
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
            className={styles.input}
            placeholder="Enter event title"
            aria-describedby={state.errors.title ? "title-error" : undefined}
          />
          {state.errors.title && (
            <Form.Control.Feedback
              type="invalid"
              className={styles.errorFeedback}
              role="alert"
              id="title-error"
            >
              {state.errors.title}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group controlId="event-description" className={styles.formGroup}>
          <Form.Label className={styles.label}>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={state.description}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "description",
                value: e.target.value,
              })
            }
            isInvalid={!!state.errors.description}
            className={styles.textarea}
            placeholder="Describe your event"
            aria-describedby={
              state.errors.description ? "description-error" : undefined
            }
          />
          {state.errors.description && (
            <Form.Control.Feedback
              type="invalid"
              className={styles.errorFeedback}
              role="alert"
              id="description-error"
            >
              {state.errors.description}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group controlId="event-location" className={styles.formGroup}>
          <Form.Label className={styles.label}>Location</Form.Label>
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
            className={styles.input}
            placeholder="Where is the event?"
            aria-describedby={
              state.errors.location ? "location-error" : undefined
            }
          />
          {state.errors.location && (
            <Form.Control.Feedback
              type="invalid"
              className={styles.errorFeedback}
              role="alert"
              id="location-error"
            >
              {state.errors.location}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group controlId="event-date" className={styles.formGroup}>
          <Form.Label className={styles.label}>Date & Time</Form.Label>
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
            className={styles.input}
            min={getLocalDateTime()}
            aria-describedby={state.errors.date ? "date-error" : undefined}
          />
          {state.errors.date && (
            <Form.Control.Feedback
              type="invalid"
              className={styles.errorFeedback}
              role="alert"
              id="date-error"
            >
              {state.errors.date}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group controlId="event-image" className={styles.formGroup}>
          <Form.Label className={styles.label}>
            Event Image (Optional)
          </Form.Label>
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
            className={styles.fileInput}
            aria-describedby="image-help"
          />
          <Form.Text id="image-help" muted>
            Choose a JPG, PNG, or GIF (optional).
          </Form.Text>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={state.loading}
          className={styles.submitBtn}
        >
          {state.loading ? (
            <>
              <Spinner
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="visually-hidden">Uploading Event...</span>
            </>
          ) : (
            "Upload Event"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default CreateEvent;
