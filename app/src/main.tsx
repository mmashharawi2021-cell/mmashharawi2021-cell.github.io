import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SiteProvider } from "./content/SiteContent";
import "./styles.css";
import "./work-avatar-circles.css";
import "./studio.css";
import "./projects.css";
import "./content/content.css";
import "./brand-intro.css";
import "./reference-intro.css";
import "./header-signature.css";
import "./design-polish.css";
import "./typing-animation.css";
import "./dia-text-reveal.css";
import "./stats.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SiteProvider>
      <App />
    </SiteProvider>
  </React.StrictMode>,
);
