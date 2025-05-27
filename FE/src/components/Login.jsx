import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Button, Row, Col } from "react-bootstrap";
import { isValidEmail } from "../utilities/formValidationFunctions";
import { loginUser } from "../api";

const Login = () => {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  };

  const validateFormInputs = () => {
    let hasError = false;

    for (const [key, value] of Object.entries(loginFormData)) {
      if (!value.trim()) {
        setFormErrors((currErrors) => {
          return { ...currErrors, [key]: `Please enter your ${key}` };
        });
        hasError = true;
      } else
        setFormErrors((currErrors) => {
          return { ...currErrors, [key]: `` };
        });
    }

    if (!isValidEmail(loginFormData.email)) {
      setFormErrors((currErrors) => {
        return { ...currErrors, email: `Please enter a valid email address` };
      });
      hasError = true;
    } else
      setFormErrors((currErrors) => {
        return { ...currErrors, email: `` };
      });

    return !hasError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateFormInputs();
    if (!isValid) return;

    setLoading(true);

    const reqBody = {
      email: loginFormData.email,
      password: loginFormData.password,
    };

    loginUser(reqBody)
      .then((userData) => {
        console.log(userData);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        if (err.status === 500) {
          setLoginError("Login failed. Please try again later.");
        }
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <fieldset>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={loginFormData.email}
            onChange={handleChange}
          />
          {formErrors.email}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={loginFormData.password}
            onChange={handleChange}
          />
          {formErrors.password}
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Col sm={{ span: 10, offset: 2 }}>
            <Button type="submit">Sign up</Button>
          </Col>
        </Form.Group>
      </fieldset>
      {loginError && <p>{loginError}</p>}
    </Form>
  );
};

export default Login;
