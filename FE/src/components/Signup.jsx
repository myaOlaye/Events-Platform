import React, { useEffect, useReducer, useContext } from "react";
import Form from "react-bootstrap/Form";
import { Row, Col, Button } from "react-bootstrap";
import signupReducer from "../reducers/signupReducer";
import { useNavigate, Link } from "react-router-dom";
import {
  formatFieldName,
  isValidEmail,
  isStrongPassword,
} from "../utilities/formValidationFunctions";
import { signupUser } from "../api";
import { UserInfoContext } from "../contexts/UserInfoContext";

const initialState = {
  formInputs: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "community",
  },
  errors: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    signup: false,
  },
  loading: false,
};

const Signup = () => {
  const { userInfo, setUserInfo } = useContext(UserInfoContext);
  const [state, dispatch] = useReducer(signupReducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo.id) {
      navigate("/");
    }
  }, [userInfo]);

  const handleChange = (e) => {
    dispatch({
      type: "set_signup_error",
      value: "",
    });
    dispatch({
      type: "set_input",
      field: e.target.name,
      value: e.target.value,
    });
  };

  const validateFormInputs = () => {
    let hasError = false;

    for (const [key, value] of Object.entries(state.formInputs)) {
      if (!value.trim()) {
        dispatch({
          type: "set_form_error",
          field: key,
          value: `Please enter your ${formatFieldName(key)}`,
        });

        hasError = true;
      } else
        dispatch({
          type: "set_form_error",
          field: key,
          value: ``,
        });
    }

    if (!isValidEmail(state.formInputs.email)) {
      dispatch({
        type: "set_form_error",
        field: "email",
        value: "Please enter a valid email address",
      });
      hasError = true;
    } else
      dispatch({
        type: "set_form_error",
        field: "email",
        value: ``,
      });

    if (!isStrongPassword(state.formInputs.password)) {
      dispatch({
        type: "set_form_error",
        field: "password",
        value:
          "Your password must have minimum 8 characters and include at least 1 letter and 1 number",
      });
      hasError = true;
    } else
      dispatch({
        type: "set_form_error",
        field: "password",
        value: ``,
      });

    return !hasError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateFormInputs();
    if (!isValid) return;

    dispatch({ type: "set_loading", value: true });

    const reqBody = {
      first_name: state.formInputs.firstName,
      last_name: state.formInputs.lastName,
      email: state.formInputs.email,
      password: state.formInputs.password,
      role: state.formInputs.role,
    };

    signupUser(reqBody)
      .then(({ id, first_name, last_name, role, email }) => {
        setUserInfo({
          id,
          email,
          firstName: first_name,
          lastName: last_name,
          role,
        });
        navigate("/");
      })
      .catch((err) => {
        dispatch({ type: "set_loading", value: false });
        console.log(err);
        if (err.response.status === 500) {
          dispatch({
            type: "set_signup_error",
            value: `Something went wrong. Please try again later.`,
          });
        } else {
          dispatch({
            type: "set_signup_error",
            value: `${err.response.data.msg}`,
          });
        }
      });
  };

  return (
    <>
      <h2>Sign Up</h2>
      <Form onSubmit={handleSubmit}>
        <fieldset disabled={state.loading}>
          <Form.Group className="mb-3" controlId="formGroupFirstName">
            <Form.Label>First name</Form.Label>
            <Form.Control
              type="name"
              name="firstName"
              placeholder="Enter first name"
              value={state.formInputs.firstName}
              onChange={handleChange}
            />
            {state.errors.firstName}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupLastName">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter last name"
              name="lastName"
              value={state.formInputs.lastName}
              onChange={handleChange}
            />
            {state.errors.lastName}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={state.formInputs.email}
              onChange={handleChange}
            />
            {state.errors.email}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={state.formInputs.password}
              onChange={handleChange}
            />
            {state.errors.password}
          </Form.Group>
          <Col sm={10}>
            <Form.Check
              type="radio"
              label="Staff"
              name="role"
              id="formHorizontalRadios1"
              value="staff"
              checked={state.formInputs.role === "staff"}
              onChange={handleChange}
            />
            <Form.Check
              type="radio"
              label="Community member"
              name="role"
              id="formHorizontalRadios2"
              value="community"
              checked={state.formInputs.role === "community"}
              onChange={handleChange}
            />
          </Col>
          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 10, offset: 2 }}>
              {state.loading ? (
                <p>Loading...</p> // make a spinner soon
              ) : (
                <Button type="submit" disabled={state.loading}>
                  Sign up
                </Button>
              )}
            </Col>
          </Form.Group>
          {state.errors.signup && <p>{state.errors.signup}</p>}
        </fieldset>
      </Form>
      <p>
        Already have an account? <Link to={`/login`}>Login here.</Link>
      </p>
    </>
  );
};

export default Signup;
