import 'dotenv/config';
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { testConnection } from "./src/models/db.js";
import { getAllOrganizations } from "./src/models/organizations.js";
import { getAllProjects } from "./src/models/projects.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Configure Express middleware
 */
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
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
    res.render("organizations", { title: "Our Partner Organizations", organizations });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).send("Error loading organizations");
  }
});

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

/**
 * Server Startup
 */
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://localhost:${PORT}`);

    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});