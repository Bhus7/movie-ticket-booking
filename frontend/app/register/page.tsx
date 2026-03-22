"use client";

// This component shows the register page form and connects to backend register API.

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // This function sends register data to backend.
  const handleRegister = async () => {
    setMessage("");

    if (!name || !email || !password) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Register failed");
        return;
      }

      setMessage("Register successful");

      // This redirects user to login page after successful registration.
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.log("Register error:", error);
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
      {/* This container holds the register form */}
      <div
        style={{
          width: "420px",
          backgroundColor: "#15151d",
          padding: "40px",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        {/* This heading shows register title */}
        <h2
          style={{
            fontSize: "28px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Create Your Account
        </h2>

        {/* This input takes user name */}
        <div style={{ marginBottom: "16px" }}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        {/* This input takes user email */}
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

        {/* This input takes user password */}
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

        {/* This text shows register message */}
        {message && (
          <p
            style={{
              marginBottom: "16px",
              color: message === "Register successful" ? "lightgreen" : "#ff6b6b",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}

        {/* This button submits register form */}
        <button
          onClick={handleRegister}
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
          Register
        </button>

        {/* This text shows login option */}
        <p
          style={{
            marginTop: "18px",
            textAlign: "center",
            fontSize: "14px",
            color: "#9ca3af",
          }}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}