"use client";

// This component shows the top navigation bar of the website.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [hoveredItem, setHoveredItem] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // This effect checks if the user token exists in local storage.
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // This effect closes the dropdown when user clicks outside.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // This function removes token and logs out the user.
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowUserMenu(false);
    window.location.href = "/";
  };

  // This function returns style for menu links.
  const getLinkStyle = (name: string) => {
    return {
      color: hoveredItem === name ? "#ff4d4d" : "white",
      transform: hoveredItem === name ? "translateY(-2px)" : "translateY(0px)",
      transition: "all 0.2s ease",
      cursor: "pointer",
      textDecoration: "none",
    };
  };

  // This function returns style for buttons.
  const getButtonStyle = (name: string, filled: boolean) => {
    return {
      backgroundColor: filled
        ? hoveredItem === name
          ? "#e63c3c"
          : "#ff4d4d"
        : hoveredItem === name
        ? "rgba(255,255,255,0.12)"
        : "transparent",
      color: "white",
      border: filled ? "none" : "1px solid white",
      padding: "8px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      transform: hoveredItem === name ? "translateY(-2px)" : "translateY(0px)",
      boxShadow:
        hoveredItem === name
          ? "0 6px 16px rgba(0,0,0,0.25)"
          : "none",
    };
  };

  return (
    <nav
      style={{
        width: "100%",
        padding: "20px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
        color: "white",
      }}
    >
      {/* This shows the logo on the left side. */}
      <Link href="/" style={{ textDecoration: "none", color: "white" }}>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          QuickShow
        </div>
      </Link>

      {/* This container keeps the menu items near the middle. */}
      <div
        style={{
          display: "flex",
          gap: "36px",
          alignItems: "center",
          marginLeft: "120px",
        }}
      >
        <Link
          href="/"
          style={getLinkStyle("Home")}
          onMouseEnter={() => setHoveredItem("Home")}
          onMouseLeave={() => setHoveredItem("")}
        >
          Home
        </Link>

        <a
          href="#"
          style={getLinkStyle("Movies")}
          onMouseEnter={() => setHoveredItem("Movies")}
          onMouseLeave={() => setHoveredItem("")}
        >
          Movies
        </a>

        <a
          href="#"
          style={getLinkStyle("Theaters")}
          onMouseEnter={() => setHoveredItem("Theaters")}
          onMouseLeave={() => setHoveredItem("")}
        >
          Theaters
        </a>

        <a
          href="#"
          style={getLinkStyle("Releases")}
          onMouseEnter={() => setHoveredItem("Releases")}
          onMouseLeave={() => setHoveredItem("")}
        >
          Releases
        </a>
      </div>

      {/* This container shows auth buttons or user icon on the right side. */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        {!isLoggedIn ? (
          <>
            <Link href="/login">
              <button
                style={getButtonStyle("Login", false)}
                onMouseEnter={() => setHoveredItem("Login")}
                onMouseLeave={() => setHoveredItem("")}
              >
                Login
              </button>
            </Link>

            <Link href="/register">
              <button
                style={getButtonStyle("Register", true)}
                onMouseEnter={() => setHoveredItem("Register")}
                onMouseLeave={() => setHoveredItem("")}
              >
                Register
              </button>
            </Link>
          </>
        ) : (
          <div
            ref={userMenuRef}
            style={{
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.5)",
                backgroundColor: "transparent",
                color: "white",
                cursor: "pointer",
                fontSize: "18px",
              }}
              onMouseEnter={() => setHoveredItem("User")}
              onMouseLeave={() => setHoveredItem("")}
            >
              👤
            </button>

            {showUserMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "52px",
                  right: 0,
                  minWidth: "140px",
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "10px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "white",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}