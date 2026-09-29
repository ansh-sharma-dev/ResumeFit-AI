import React from "react";
import "./App.css";

function Home() {
  return (
    <div className="home-page">
      <div className="home-container">

        <div className="home-content">
          <h1>ResumeFit AI</h1>

          <h2>Build a Resume That Gets Noticed.</h2>

          <p>
            Analyze your resume with AI, check your ATS score,
            and match your resume with the right jobs.
          </p>

          <div className="home-buttons">
            <button onClick={() => window.location.href = "/login"}>
              Login
            </button>

            <button onClick={() => window.location.href = "/register"}>
              Get Started
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;