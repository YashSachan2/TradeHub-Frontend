import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const GoogleAuth = () => {
  const [loading, setLoading] = useState(false);

  const GOOGLE_CLIENT_ID =
    process.env.REACT_APP_GOOGLE_CLIENT_ID ||
    "613864712862-u8qe0vi59a3c28jlrv0obvenqtd4af94.apps.googleusercontent.com";

  const GOOGLE_LOGIN_URL =
    "http://localhost:8000" + "/api/auth/google-login";

  // Load Google Identity Services
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const SCRIPT_ID = "google-identity-script";
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.id = SCRIPT_ID;
      document.head.appendChild(script);
    }

    const interval = setInterval(() => {
      const g = window.google?.accounts?.id;
      const container = document.getElementById("googleSignInDiv");
      if (g && container) {
        clearInterval(interval);
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
          ux_mode: "popup",
        });
        window.google.accounts.id.renderButton(container, {
          theme: "outline",
          size: "large",
          width: "100%",
        });
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Handle Google login response
  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential)
      return toast.error("Google authentication failed");

    setLoading(true);
    try {
      const res = await fetch(GOOGLE_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      const json = await res.json();
      if (!res.ok) return toast.error(json.message || "Google login failed");

      const data = json.data || json;

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", JSON.stringify(data.userId));
      localStorage.setItem("email", data.email || "");
      localStorage.setItem("first_name", data.first_name || "");
      localStorage.setItem("last_name", data.last_name || "");

      toast.success("Login Successful (Google)");
      setTimeout(() => (window.location.href = "/dashboard"), 1200);
    } catch (err) {
      console.error(err);
      toast.error("Google login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div
        id="googleSignInDiv"
        style={{ display: "flex", justifyContent: "center" }}
      />
      {loading && (
        <p style={{ textAlign: "center", color: "white" }}>
          Signing in with Google...
        </p>
      )}
    </div>
  );
};

export default GoogleAuth;
