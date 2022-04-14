import React, { useEffect } from "react";
import { useState } from "react";
import {
  auth,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
} from "../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import "../App.css";
import { deepClone, validateEmail } from "../utils/Helper";
import { useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

const iSignUpState = {
  email: "",
  password: "",
  name: "",
};

const iSignInState = {
  email: "",
  password: "",
};

export default function UserAuth({ toast }) {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  //Toggle
  const [signInActive, setSignInActive] = useState(true);

  //SignIn
  const [data, setData] = useState(iSignInState);
  const [errors, setErrors] = useState({});

  //SignUp
  const [signUpData, setSignUpData] = useState(iSignUpState);
  const [sErrors, setSErrors] = useState({});

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);

  const onTextChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    let cError = deepClone(errors);
    delete cError[e.target.name];
    setErrors(cError);
  };

  const onSignIn = (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateEmail(data.email)) {
      toast.error("Invalid Email");
      setErrors({ email: true });
    } else if (data.password == "") {
      toast.error("Enter password");
      setErrors({ password: true });
    } else {
      logInWithEmailAndPassword(data.email, data.password, toast);
    }
  };

  const signupTextChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
    let cError = deepClone(sErrors);
    delete cError[e.target.name];
    setSErrors(cError);
  };

  const onSignUp = (e) => {
    e.preventDefault();
    setSErrors({});
    if (signUpData.name == "") {
      toast.error("Enter Name");
      setSErrors({ name: true });
    } else if (!validateEmail(signUpData.email)) {
      toast.error("Invalid Email");
      setSErrors({ email: true });
    } else if (signUpData.password == "") {
      toast.error("Enter password");
      setSErrors({ password: true });
    } else {
      registerWithEmailAndPassword(signUpData, toast);
    }
  };

  const clearSignInData = () => {
    setSignInActive(false);
    setData(iSignInState);
    setErrors({});
  };

  const clearSignUpData = () => {
    setSignInActive(true);
    setSignUpData(iSignUpState);
    setSErrors({});
  };

  if (loading) {
    return (
      <Backdrop sx={{ color: "#fff" }} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else {
    return (
      <div className="auth-bg">
        <div class="container ">
          <div class="formBx">
            {signInActive ? (
              <div class="form signinForm">
                <form>
                  <h3>Sign In</h3>
                  <input
                    name="email"
                    type="text"
                    className={errors.email ? "error" : ""}
                    onChange={onTextChange}
                    value={data.email}
                    placeholder="Email"
                  />
                  <input
                    name="password"
                    type="password"
                    className={errors.password ? "error" : ""}
                    onChange={onTextChange}
                    value={data.password}
                    placeholder="Password"
                  />
                  <input onClick={onSignIn} type="submit" value="login" />
                </form>
              </div>
            ) : (
              <div class="form signupForm">
                <form>
                  <h3>Sign Up</h3>
                  <input
                    name="name"
                    type="text"
                    className={sErrors.name ? "error" : ""}
                    onChange={signupTextChange}
                    value={signUpData.name}
                    placeholder="Name"
                  />
                  <input
                    name="email"
                    type="text"
                    className={sErrors.email ? "error" : ""}
                    onChange={signupTextChange}
                    value={signUpData.email}
                    placeholder="Email"
                  />
                  <input
                    name="password"
                    type="password"
                    className={sErrors.password ? "error" : ""}
                    onChange={signupTextChange}
                    value={signUpData.password}
                    placeholder="Password"
                  />

                  <input onClick={onSignUp} type="submit" value="Register" />
                </form>
              </div>
            )}
          </div>
          {signInActive ? (
            <>
              <h3 className="signup-heading">Don't Have an Account?</h3>
              <button onClick={clearSignInData} className="signup-btn">
                Signup
              </button>
            </>
          ) : (
            <>
              <h3 className="signup-heading">Already have an Account?</h3>
              <button onClick={clearSignUpData} className="signup-btn">
                SignIn
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
}
