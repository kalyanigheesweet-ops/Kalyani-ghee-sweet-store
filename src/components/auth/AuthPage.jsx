import { Link, useNavigate } from "@tanstack/react-router";
import { Mail, LockKeyhole, Phone, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/kalyani-logo.svg";
import backgroundImage from "@/assets/Kalyani background.png";
import { AuthInput } from "./AuthInput";
import "./AuthPage.css";
import {
  createAccount,
  getRememberedIdentifier,
  getSession,
  login,
  signInWithGoogle,
  validatePassword,
} from "@/lib/auth-security";
import { useStore } from "@/lib/store";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const indianMobilePattern = /^(?:\+91|91)?[6-9]\d{9}$/;

const emptyLogin = {
  identifier: "",
  password: "",
};

const emptySignup = {
  fullName: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
};

function normalizeMobile(value) {
  return value.replace(/[\s-]/g, "");
}

function validateLogin(values) {
  const errors = {};
  const identifier = values.identifier.trim();
  const normalizedIdentifier = normalizeMobile(identifier);

  if (!identifier) {
    errors.identifier = "Enter your email or mobile number.";
  } else if (!emailPattern.test(identifier) && !indianMobilePattern.test(normalizedIdentifier)) {
    errors.identifier = "Enter a valid email or Indian mobile number.";
  }
  if (!values.password) errors.password = "Enter your password.";
  return errors;
}

function validateSignup(values) {
  const errors = {};
  if (values.fullName.trim().length < 2) errors.fullName = "Enter your full name.";
  if (!emailPattern.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (!indianMobilePattern.test(normalizeMobile(values.mobile.trim()))) {
    errors.mobile = "Enter a valid 10-digit Indian mobile number.";
  }
  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;
  if (values.confirmPassword !== values.password)
    errors.confirmPassword = "Passwords do not match.";
  return errors;
}

function GoogleButton({ onSignIn, submitting, large = false }) {
  return (
    <button
      className={`auth-google-button${large ? " auth-google-button--large" : ""}`}
      type="button"
      onClick={onSignIn}
      disabled={submitting}
    >
      <span className="google-mark" aria-hidden="true">
        G
      </span>
      {submitting ? "Connecting to Google..." : "Continue with Google"}
    </button>
  );
}

export function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { refreshAuth, user } = useStore();
  const [loginValues, setLoginValues] = useState({
    ...emptyLogin,
    identifier: getRememberedIdentifier(),
  });
  const [signupValues, setSignupValues] = useState(emptySignup);
  const [loginErrors, setLoginErrors] = useState({});
  const [signupErrors, setSignupErrors] = useState({});
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [submitting, setSubmitting] = useState("");
  const [status, setStatus] = useState({});

  const submitGoogle = async () => {
    setSubmitting("google");
    try {
      await signInWithGoogle();
    } catch (error) {
      setStatus((current) => ({
        ...current,
        [mode]: error instanceof Error ? error.message : "Unable to sign in with Google.",
      }));
    } finally {
      setSubmitting("");
    }
  };

  useEffect(() => {
    void getSession().then((session) => {
      if (user || session) navigate({ to: "/" });
    });
  }, [navigate, user]);

  const updateLoginValue = (field) => (event) => {
    setLoginValues((current) => ({ ...current, [field]: event.target.value }));
    setLoginErrors((current) => ({ ...current, [field]: "" }));
    setStatus((current) => ({ ...current, login: "" }));
  };

  const updateSignupValue = (field) => (event) => {
    setSignupValues((current) => ({ ...current, [field]: event.target.value }));
    setSignupErrors((current) => ({ ...current, [field]: "" }));
    setStatus((current) => ({ ...current, signup: "" }));
  };

  const togglePassword = (field) => {
    setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }));
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    const nextErrors = validateLogin(loginValues);
    setLoginErrors(nextErrors);
    setStatus((current) => ({ ...current, login: "" }));
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting("login");
    try {
      await login(loginValues.identifier, loginValues.password);
      refreshAuth();
      setStatus((current) => ({ ...current, login: "Login successful. Redirecting..." }));
      await new Promise((resolve) => setTimeout(resolve, 350));
      navigate({ to: "/" });
    } catch (error) {
      setStatus((current) => ({
        ...current,
        login: error instanceof Error ? error.message : "Unable to sign in. Try again.",
      }));
    } finally {
      setSubmitting("");
    }
  };

  const submitSignup = async (event) => {
    event.preventDefault();
    const nextErrors = validateSignup(signupValues);
    setSignupErrors(nextErrors);
    setStatus((current) => ({ ...current, signup: "" }));
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting("signup");
    try {
      await createAccount({
        name: signupValues.fullName,
        email: signupValues.email,
        mobile: normalizeMobile(signupValues.mobile),
        password: signupValues.password,
      });
      refreshAuth();
      setStatus((current) => ({ ...current, signup: "Account created securely. Redirecting..." }));
      await new Promise((resolve) => setTimeout(resolve, 350));
      navigate({ to: "/" });
    } catch (error) {
      setStatus((current) => ({
        ...current,
        signup: error instanceof Error ? error.message : "Unable to create your account.",
      }));
    } finally {
      setSubmitting("");
    }
  };

  const setBackground = {
    backgroundImage: `linear-gradient(90deg, rgba(255, 246, 222, 0.13), rgba(255, 246, 222, 0.52) 50%, rgba(255, 246, 222, 0.13)), url(${backgroundImage})`,
  };

  return (
    <main className="auth-page" style={setBackground}>
      <div className="auth-page-inner">
        <div className="auth-grid">
          {mode === "login" ? (
            <section className="auth-card" aria-labelledby="login-heading">
              <AuthFormHeader
                title="Welcome Back!"
                subtitle="Login to your account"
                headingId="login-heading"
              />
              <form className="auth-form" onSubmit={submitLogin} noValidate>
                <AuthInput
                  id="identifier"
                  label="Email or Mobile Number"
                  placeholder="Email or Mobile Number"
                  value={loginValues.identifier}
                  onChange={updateLoginValue("identifier")}
                  icon={Mail}
                  error={loginErrors.identifier}
                  autoComplete="username"
                  inputMode="email"
                  maxLength={254}
                />
                <AuthInput
                  id="login-password"
                  label="Password"
                  type="password"
                  placeholder="Password"
                  value={loginValues.password}
                  onChange={updateLoginValue("password")}
                  icon={LockKeyhole}
                  error={loginErrors.password}
                  showPassword={visiblePasswords.password}
                  onTogglePassword={() => togglePassword("password")}
                  autoComplete="current-password"
                  maxLength={128}
                />
                <button
                  className="auth-forgot auth-forgot-button"
                  type="button"
                  onClick={() =>
                    setStatus((current) => ({
                      ...current,
                      login:
                        "Password reset requires a verified email service. Please contact the store.",
                    }))
                  }
                >
                  Forgot Password?
                </button>
                <SubmitButton label="Login" submitting={submitting === "login"} />
                <div className="auth-divider" aria-hidden="true">
                  OR
                </div>
                <GoogleButton
                  onSignIn={submitGoogle}
                  submitting={submitting === "google"}
                  large
                />
                {status.login && (
                  <p className="auth-status" role="status">
                    {status.login}
                  </p>
                )}
                <p className="auth-switch">
                  Don't have an account?<Link to="/signup">Sign Up</Link>
                </p>
              </form>
            </section>
          ) : (
            <section className="auth-card" aria-labelledby="signup-heading">
              <AuthFormHeader
                title="Create Your Account"
                subtitle="Join us for a sweeter experience"
                headingId="signup-heading"
              />
              <form className="auth-form" onSubmit={submitSignup} noValidate>
                <AuthInput
                  id="fullName"
                  label="Full Name"
                  placeholder="Full Name"
                  value={signupValues.fullName}
                  onChange={updateSignupValue("fullName")}
                  icon={UserRound}
                  error={signupErrors.fullName}
                  autoComplete="name"
                  maxLength={80}
                />
                <AuthInput
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="Email Address"
                  value={signupValues.email}
                  onChange={updateSignupValue("email")}
                  icon={Mail}
                  error={signupErrors.email}
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                />
                <AuthInput
                  id="mobile"
                  label="Mobile Number"
                  type="tel"
                  placeholder="Mobile Number"
                  value={signupValues.mobile}
                  onChange={updateSignupValue("mobile")}
                  icon={Phone}
                  error={signupErrors.mobile}
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={15}
                />
                <AuthInput
                  id="signup-password"
                  label="Password"
                  type="password"
                  placeholder="Password"
                  value={signupValues.password}
                  onChange={updateSignupValue("password")}
                  icon={LockKeyhole}
                  error={signupErrors.password}
                  showPassword={visiblePasswords.signupPassword}
                  onTogglePassword={() => togglePassword("signupPassword")}
                  autoComplete="new-password"
                  maxLength={128}
                />
                <AuthInput
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm Password"
                  value={signupValues.confirmPassword}
                  onChange={updateSignupValue("confirmPassword")}
                  icon={LockKeyhole}
                  error={signupErrors.confirmPassword}
                  showPassword={visiblePasswords.confirmPassword}
                  onTogglePassword={() => togglePassword("confirmPassword")}
                  autoComplete="new-password"
                  maxLength={128}
                />
                <SubmitButton label="Sign Up" submitting={submitting === "signup"} />
                <div className="auth-divider" aria-hidden="true">
                  OR
                </div>
                <GoogleButton onSignIn={submitGoogle} submitting={submitting === "google"} />
                {status.signup && (
                  <p className="auth-status" role="status">
                    {status.signup}
                  </p>
                )}
                <p className="auth-switch">
                  Already have an account?<Link to="/login">Login</Link>
                </p>
              </form>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function AuthFormHeader({ title, subtitle, headingId }) {
  return (
    <header>
      <img className="auth-brand-mark" src={logo} alt="Kalyani Ghee Sweets" />
      <p className="auth-since">Since 2002</p>
      <h1 id={headingId}>{title}</h1>
      <p className="auth-subtitle">{subtitle}</p>
    </header>
  );
}

function SubmitButton({ label, submitting }) {
  return (
    <button className="auth-primary-button" type="submit" disabled={submitting}>
      {submitting ? "Please wait..." : label}
      {!submitting && (
        <span className="auth-arrow" aria-hidden="true">
          →
        </span>
      )}
    </button>
  );
}
