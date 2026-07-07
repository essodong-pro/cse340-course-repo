import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { testConnection } from "./src/models/db.js";
import { getAllOrganizations } from "./src/models/organizations.js";
import { getAllProjects } from "./src/models/projects.js"; // New import

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * Configure Express middleware
 */
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the templating engine
app.set("view engine", "ejs");
// Tell Express where to find my templates
app.set("views", path.join(__dirname, "src/views"));

/**
 * Routes
 */
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

app.get("/categories", (req, res) => {
  res.render("categories", { title: "Service Project Categories" });
});

app.get("/organizations", async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    const title = "Our Partner Organizations";
    res.render("organizations", { title, organizations });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).send("Error loading organizations");
  }
});

// Updated projects route
app.get("/projects", async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.render("projects", {
      title: "Upcoming Service Projects",
      projects: projects
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).send("Error loading projects");
  }
});

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});