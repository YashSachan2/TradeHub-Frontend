// import "./signup.css";
// import React, { useEffect, useState } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { PresentationControls, Stage, useGLTF } from "@react-three/drei";
// import { toast } from "react-toastify";

// function Model(props) {
//   const { scene } = useGLTF("/ethereum/scene.gltf");
//   useFrame(({ clock }) => {
//     scene.rotation.y = Math.sin(clock.getElapsedTime() * 1) * 0.3;
//   });
//   return <primitive object={scene} {...props} />;
// }

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const BACKEND_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
//   const AUTH_BASE = "/api/auth";
//   const LOGIN_URL = `${BACKEND_BASE}${AUTH_BASE}/login`;
//   const GOOGLE_LOGIN_URL = `${BACKEND_BASE}${AUTH_BASE}/google-login`;

//   const GOOGLE_CLIENT_ID =
//     process.env.REACT_APP_GOOGLE_CLIENT_ID ||
//     "613864712862-u8qe0vi59a3c28jlrv0obvenqtd4af94.apps.googleusercontent.com";

//   // --- Google Identity Services ---
//   useEffect(() => {
//     if (!GOOGLE_CLIENT_ID) return;

//     const SCRIPT_ID = "google-identity-script";
//     if (!document.getElementById(SCRIPT_ID)) {
//       const script = document.createElement("script");
//       script.src = "https://accounts.google.com/gsi/client";
//       script.async = true;
//       script.defer = true;
//       script.id = SCRIPT_ID;
//       document.head.appendChild(script);
//     }

//     const interval = setInterval(() => {
//       const g = window.google?.accounts?.id;
//       const container = document.getElementById("googleSignInDiv");
//       if (g && container) {
//         clearInterval(interval);
//         window.google.accounts.id.initialize({
//           client_id: GOOGLE_CLIENT_ID,
//           callback: handleGoogleCredentialResponse,
//           ux_mode: "popup",
//         });
//         window.google.accounts.id.renderButton(container, { theme: "outline", size: "large", width: "100%" });
//       }
//     }, 200);

//     return () => clearInterval(interval);
//   }, []);

//   // --- Handle Google login ---
//   const handleGoogleCredentialResponse = async (response) => {
//     if (!response?.credential) return toast.error("Google authentication failed");
//     setLoading(true);
//     try {
//       const res = await fetch(GOOGLE_LOGIN_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token: response.credential }),
//       });
//       const json = await res.json();
//       if (!res.ok) return toast.error(json.message || "Google login failed");

//       const data = json.data || json;
//       if (rememberMe) localStorage.setItem("token", data.token);
//       else sessionStorage.setItem("token", data.token);

//       localStorage.setItem("userId", JSON.stringify(data.userId));
//       localStorage.setItem("email", data.email || "");
//       localStorage.setItem("first_name", data.first_name || "");
//       localStorage.setItem("last_name", data.last_name || "");

//       toast.success("Login Successful (Google)");
//       setTimeout(() => (window.location.href = "/dashboard"), 1200);
//     } catch (err) {
//       console.error(err);
//       toast.error("Google login error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- Email/password login ---
//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch(LOGIN_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();
//       const payload = data.data || data;
//       if (!payload?.token) {
//         toast.error(data.message || "Login failed");
//         setLoading(false);
//         return;
//       }

//       if (rememberMe) localStorage.setItem("token", payload.token);
//       else sessionStorage.setItem("token", payload.token);

//       localStorage.setItem("userId", JSON.stringify(payload.userId));
//       localStorage.setItem("email", payload.email);
//       localStorage.setItem("first_name", payload.first_name);
//       localStorage.setItem("last_name", payload.last_name);

//       toast.success("Login Successful");
//       setTimeout(() => (window.location.href = "/dashboard"), 1200);
//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="Login_PAGE flex flex-row bg-[#2f2f2f] h-[100%]">
//       <div className="a3d-model w-[50%]">
//         <Canvas dpr={[1, 2]} camera={{ fav: 45 }} style={{ backgroundColor: "black", height: "100vh" }}>
//           <PresentationControls speed={1.5} global zoom={0.2} polar={[-0.1, Math.PI / 4]}>
//             <Stage environment={null}>
//               <Model scale={0.005} />
//             </Stage>
//           </PresentationControls>
//         </Canvas>
//       </div>

//       <div className="form-container w-[50%] flex flex-col justify-center">
//         <div className="form-body w-[80%] md:w-[60%] m-auto">
//           <h1 className="text-5xl p-5 font-bold text-white">Sign In</h1>
//           <form onSubmit={onSubmitHandler}>
//             <input
//               placeholder="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               style={{ width: "100%", height: 50, marginBottom: 10, borderRadius: 10, paddingLeft: 20 }}
//             />
//             <input
//               placeholder="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               style={{ width: "100%", height: 50, marginBottom: 10, borderRadius: 10, paddingLeft: 20 }}
//             />
//             <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)}
//               />
//               <label style={{ color: "white", marginLeft: 5 }}>Remember me</label>
//             </div>
//             <button type="submit" disabled={loading} style={{ width: "100%", height: 50, background: "#0CB1CA", color: "white", borderRadius: 10 }}>
//               {loading ? "Signing in..." : "Login"}
//             </button>
//           </form>

//           <div style={{ color: "white", textAlign: "center", margin: "20px 0" }}>— OR —</div>

//           <div id="googleSignInDiv" style={{ display: "flex", justifyContent: "center" }} />

//           <div style={{ textAlign: "center", color: "white", marginTop: 10 }}>
//             don't have an account <a href="/signup" style={{ color: "#0CB1CA" }}>Sign up here</a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import "./signup.css";


import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { toast } from "react-toastify";
import GoogleAuth from "./GoogleAuth";

function Model(props) {

  const { scene } = useGLTF("/ethereum/scene.gltf");

  // Add a rotation animation to the model using useFrame hook
  useFrame(({ clock }) => {
    scene.rotation.y = Math.sin(clock.getElapsedTime() * 1) * 0.3;
  });

  return <primitive object={scene} {...props} />;
}
const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");







  const onSubmitHandler = (e) => {
    e.preventDefault();

    // Using Fetch API
    // axios.post("http://localhost:5000/api/auth/signup", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     // Add parameters here
    //     firstname,
    //     lastname,
    //     email,
    //     password,
    //     phone,
    //     address,
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     // Handle data
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   });
    fetch("https://crytotrade-app.onrender.com/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        // Add parameters here

        email: email,
        password: password,

      }),
      headers: {
        "Content-Type": "application/json",
      },
    })

      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        data = data.data
        localStorage.setItem("token", data.token);
        window.localStorage.setItem("userId", JSON.stringify(data.userId));
        window.localStorage.setItem("email", data.email);
        window.localStorage.setItem("first_name", data.first_name);
        window.localStorage.setItem("last_name", data.last_name);
        toast.success("Login Successfull");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);

        // Handle data
      }
      )
      .catch((err) => {
        console.log(err.message);
        toast.error("Something Went Wrong");
      }
      );

  };







  return (
    // <div className="flex flex-row bg-[#2f2f2f] h-[100%]">
    <div className="Login_PAGE flex flex-row bg-[#2f2f2f] h-[100%]">
      <div className="a3d-model w-[50%]">
        {/* rotate the 3d model */}
        <Canvas
          dpr={[1, 2]}
          camera={{ fav: 45 }}
          style={{
            position: "relative",
            backgroundColor: "black",
            height: "100vh",
          }}
        >
          <PresentationControls
            speed={1.5}
            global
            zoom={0.2}
            polar={[-0.1, Math.PI / 4]}
          >
            <Stage environment={null}>
              <Model scale={0.005} />
            </Stage>
          
          </PresentationControls>
          
        </Canvas>
      </div>
      <div className="form-container w-[50%] flex flex-col justify-center">
        <div className="form-body w-[80%] md:w-[80%] lg:w-[60%] md:m-auto m-[5%]">
          <div className="form-header">
            <h1 className="text-5xl p-5 font-bold text-white">Sign In</h1>
          </div>
          <form action="https://crytotrade-app.onrender.com/api/auth/login" method="POST" onSubmit={onSubmitHandler}>

          <div className="form-input">
          <input
                placeholder="email"
                type="email"
                
                onChange={(e) => setemail(e.target.value)}
                value={email}
                name="email"

              className="email m-5 "
              required
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                paddingLeft: "20px",
                fontSize: "20px",
                color: "white",
                backgroundColor: "#454343",
              }}
            />
            <input
                placeholder="password"
                type="password"

                onChange={(e) => setpassword(e.target.value)}
                value={password}
                name="password"

              className="password m-5 "
              required
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                paddingLeft: "20px",
                fontSize: "20px",
                color: "white",
                backgroundColor: "#454343",
              }}
            />
            
          </div>
          <div className="form-button">
            <button
            type="submit"
              className="login-button m-5"
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                fontSize: "20px",
                color: "white",
                backgroundColor: "#0CB1CA",
              }}
            >
              Login
            </button>
          </div>
          </form>
          <GoogleAuth />   {/* ✅ Google Sign-In button here */}
          <div style={{ textAlign: "center" ,color:"white"}}>
            dont have an account{" "}
            <a href="/signup">
              <strong style={{color:"#0CB1CA"}}>Sign up here</strong>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;