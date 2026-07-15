import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);

    // Fetch categories for this specific project
    const categories = await getCategoriesByProjectId(projectId);

    const title = project ? project.title : 'Project Not Found';

    // Pass 'categories' to the view so they can be displayed as tags
    res.render('project', { title, project, categories });
};

export { showProjectsPage, showProjectDetailsPage };