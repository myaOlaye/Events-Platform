import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import { isValidEmail } from "../utilities/formValidationFunctions";
import { loginUser } from "../api";
import { UserInfoContext } from "../contexts/UserInfoContext";
import { getUserInfo } from "../api";
const Login = () => {
  const { userInfo } = useContext(UserInfoContext);
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { setUserInfo } = useContext(UserInfoContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo.id) {
      navigate("/");
    }
  }, [userInfo]);

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
      .then(() => getUserInfo())
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
        setLoading(false);

        if (err.response.status === 500) {
          setLoginError("Something went wrong. Please try again later");
        } else {
          setLoginError(`${err.response.data.msg}`);
        }
      });
  };

  return (
    <>
      <h2>Login</h2>
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
              {loading ? (
                <p>Loading...</p> // make a spinner soon
              ) : (
                <button type="submit">Log in</button>
              )}
            </Col>
          </Form.Group>
        </fieldset>
        {loginError && <p>{loginError}</p>}
      </Form>{" "}
      <p>
        Don't have an account? <Link to={`/signup`}>Sign up here.</Link>
      </p>
    </>
  );
};

export default Login;
