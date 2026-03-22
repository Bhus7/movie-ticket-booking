"use client";

// This component shows the login page form and connects to backend login API.

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // This function sends login data to backend.
  const handleLogin = async () => {
    setMessage("");

    // This checks if email and password are entered.
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    // This checks whether the entered email is admin email.
    const isAdmin = email === "admin@gmail.com";

    // This selects the correct backend login route.
    const loginUrl = isAdmin
      ? "http://localhost:5001/api/auth/admin-login"
      : "http://localhost:5001/api/auth/login";

    try {
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      // This shows backend error message if login fails.
      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      // This stores admin token separately after successful admin login.
      if (isAdmin) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("admin", JSON.stringify(data.admin));
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setMessage("Login successful");

      // This redirects admin and normal user to different pages.
      setTimeout(() => {
        if (isAdmin) {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 1000);
    } catch (error) {
      console.log("Login error:", error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0b0b0f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <div
        style={{
          width: "400px",
          backgroundColor: "#15151d",
          padding: "40px",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Login to QuickShow
        </h2>

        <div style={{ marginBottom: "16px" }}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "#22222b",
              color: "white",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "#22222b",
              color: "white",
              outline: "none",
            }}
          />
        </div>

        {message && (
          <p
            style={{
              marginBottom: "16px",
              color: message === "Login successful" ? "lightgreen" : "#ff6b6b",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#ff4d4d",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <p
          style={{
            marginTop: "18px",
            textAlign: "center",
            fontSize: "14px",
            color: "#9ca3af",
          }}
        >
          Don't have an account? Register
        </p>
      </div>
    </div>
  );
}