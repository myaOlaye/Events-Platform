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
import styles from "./Signup.module.css";

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
    <div className={styles.signupContainer}>
      <h2 className={styles.heading}>Sign Up</h2>
      <Form onSubmit={handleSubmit} className={styles.form}>
        <fieldset disabled={state.loading} className={styles.fieldset}>
          <Form.Group
            className={styles.formGroup}
            controlId="formGroupFirstName"
          >
            <Form.Label className={styles.label}>First name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={state.formInputs.firstName}
              onChange={handleChange}
              className={styles.input}
            />
            {state.errors.firstName && (
              <p className={styles.error}>{state.errors.firstName}</p>
            )}
          </Form.Group>

          <Form.Group
            className={styles.formGroup}
            controlId="formGroupLastName"
          >
            <Form.Label className={styles.label}>Last name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={state.formInputs.lastName}
              onChange={handleChange}
              className={styles.input}
            />
            {state.errors.lastName && (
              <p className={styles.error}>{state.errors.lastName}</p>
            )}
          </Form.Group>

          <Form.Group className={styles.formGroup} controlId="formGroupEmail">
            <Form.Label className={styles.label}>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={state.formInputs.email}
              onChange={handleChange}
              className={styles.input}
            />
            {state.errors.email && (
              <p className={styles.error}>{state.errors.email}</p>
            )}
          </Form.Group>

          <Form.Group
            className={styles.formGroup}
            controlId="formGroupPassword"
          >
            <Form.Label className={styles.label}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={state.formInputs.password}
              onChange={handleChange}
              className={styles.input}
            />
            {state.errors.password && (
              <p className={styles.error}>{state.errors.password}</p>
            )}
          </Form.Group>

          <div className={styles.roleSelect}>
            <Form.Check
              type="radio"
              label="Staff"
              name="role"
              id="formHorizontalRadios1"
              value="staff"
              checked={state.formInputs.role === "staff"}
              onChange={handleChange}
              className={styles.radio}
            />
            <Form.Check
              type="radio"
              label="Community member"
              name="role"
              id="formHorizontalRadios2"
              value="community"
              checked={state.formInputs.role === "community"}
              onChange={handleChange}
              className={styles.radio}
            />
          </div>

          <Form.Group as={Row} className={styles.submitRow}>
            <Col sm={{ span: 10, offset: 2 }}>
              {state.loading ? (
                <p className={styles.loading}>Loading...</p>
              ) : (
                <Button
                  type="submit"
                  className={styles.submitButton}
                  disabled={state.loading}
                >
                  Sign up
                </Button>
              )}
            </Col>
          </Form.Group>

          {state.errors.signup && (
            <p className={styles.error}>{state.errors.signup}</p>
          )}
        </fieldset>

        <p className={styles.loginPrompt}>
          Already have an account? <Link to="/login">Login here.</Link>
        </p>
      </Form>
    </div>
  );
};

export default Signup;
