import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import { isValidEmail } from "../utilities/formValidationFunctions";
import { loginUser } from "../api";
import { UserInfoContext } from "../contexts/UserInfoContext";
import { getUserInfo } from "../api";
import styles from "./Login.module.css";
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
  }, [userInfo.id]);

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
    <div className={styles.loginContainer}>
      <h2 className={styles.heading}>Login</h2>
      <Form onSubmit={handleSubmit} className={styles.form}>
        <fieldset className={styles.fieldset}>
          <Form.Group className={styles.formGroup} controlId="formGroupEmail">
            <Form.Label className={styles.label}>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={loginFormData.email}
              onChange={handleChange}
              className={styles.input}
            />
            {formErrors.email && (
              <p className={styles.error}>{formErrors.email}</p>
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
              value={loginFormData.password}
              onChange={handleChange}
              className={styles.input}
            />
            {formErrors.password && (
              <p className={styles.error}>{formErrors.password}</p>
            )}
          </Form.Group>
          <Form.Group as={Row} className={styles.submitRow}>
            <Col sm={{ span: 10, offset: 2 }}>
              {loading ? (
                <p className={styles.loading}>Loading...</p>
              ) : (
                <button type="submit" className={styles.submitButton}>
                  Log in
                </button>
              )}
            </Col>
          </Form.Group>
        </fieldset>
        {loginError && <p className={styles.error}>{loginError}</p>}
      </Form>
      <p className={styles.signupPrompt}>
        Don't have an account? <Link to="/signup">Sign up here.</Link>
      </p>
    </div>
  );
};

export default Login;
