import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contextProviderDeclare } from "../store/ContextProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate=useNavigate();
  const getContextObject=useContext(contextProviderDeclare);
  const {setLoggedIn,isloggedIn,setAuthor}=getContextObject;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_DJANGO_URL}/author/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        alert("Login successful!");
        // Optionally save token
        localStorage.setItem('token', data.token);
        setAuthor(data);
        setLoggedIn(!isloggedIn);
        navigate('/');
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginLeft: "40%", marginRight: "40%", marginTop: "3%", marginBottom: "3%" }}>
      <main className="form-signin w-100 m-auto">
        <form onSubmit={handleLogin}>
          <img className="mb-4" src="/logo.png" alt="Logo" width="72" height="57" />
          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>

          <div className="form-floating" style={{ marginTop: "4%" }}>
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          {error && <div className="alert alert-danger mt-3">{error}</div>}

          <button
            className="btn btn-primary w-100 py-2"
            type="submit"
            style={{ marginTop: "4%" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="mt-5 mb-3 text-body-secondary">© 2017–2025</p>
        </form>
      </main>
    </div>
  );
};

export default Login;
