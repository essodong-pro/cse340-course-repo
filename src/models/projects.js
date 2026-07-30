import pool from "./db.js";

export async function getAllProjects() {
    const sql = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.location, 
            p.date, 
            o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.date ASC;
    `;

    try {
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllProjects:", error);
        throw error;
    }
}

export async function getProjectsByOrganizationId(organizationId) {
    const sql = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY date;
    `;

    const queryParams = [organizationId];

    try {
        const result = await pool.query(sql, queryParams);
        return result.rows;
    } catch (error) {
        console.error("Error in getProjectsByOrganizationId:", error);
        throw error;
    }
}

export async function getUpcomingProjects(numberOfProjects) {
    const sql = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.date, 
            p.location, 
            p.organization_id, 
            o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;

    try {
        const result = await pool.query(sql, [numberOfProjects]);
        return result.rows;
    } catch (error) {
        console.error("Error in getUpcomingProjects:", error);
        throw error;
    }
}

export async function getProjectDetails(id) {
    const sql = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.date, 
            p.location, 
            p.organization_id, 
            o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    try {
        const result = await pool.query(sql, [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error in getProjectDetails:", error);
        throw error;
    }
}

export async function createProject(title, description, location, date, organizationId) {
    const sql = `
      INSERT INTO service_project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];

    try {
        const result = await pool.query(sql, queryParams);

        if (result.rows.length === 0) {
            throw new Error('Failed to create project');
        }

        if (process.env.ENABLE_SQL_LOGGING === 'true') {
            console.log('Created new project with ID:', result.rows[0].project_id);
        }

        return result.rows[0].project_id;
    } catch (error) {
        console.error("Error in createProject:", error);
        throw error;
    }
}

/**
 * Updates an existing service project in the database.
 */
export async function updateProject(projectId, title, description, location, date, organizationId) {
    const sql = `
        UPDATE service_project 
        SET title = $1, 
            description = $2, 
            location = $3, 
            date = $4, 
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId, projectId];

    try {
        const result = await pool.query(sql, queryParams);

        if (result.rows.length === 0) {
            throw new Error(`Project with ID ${projectId} not found.`);
        }

        return result.rows[0].project_id;
    } catch (error) {
        console.error("Error in updateProject:", error);
        throw error;
    }
}

// ========================================
// Volunteer Model Functions
// ========================================

export async function addVolunteer(userId, projectId) {
    const sql = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING;
    `;
    try {
        await pool.query(sql, [userId, projectId]);
    } catch (error) {
        console.error("Error in addVolunteer:", error);
        throw error;
    }
}

export async function removeVolunteer(userId, projectId) {
    const sql = `
        DELETE FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2;
    `;
    try {
        await pool.query(sql, [userId, projectId]);
    } catch (error) {
        console.error("Error in removeVolunteer:", error);
        throw error;
    }
}

export async function getUserVolunteeredProjects(userId) {
    const sql = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.location, 
            p.date, 
            o.name AS organization_name
        FROM project_volunteers pv
        JOIN service_project p ON pv.project_id = p.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY p.date ASC;
    `;
    try {
        const result = await pool.query(sql, [userId]);
        return result.rows;
    } catch (error) {
        console.error("Error in getUserVolunteeredProjects:", error);
        throw error;
    }
}

export async function isUserVolunteering(userId, projectId) {
    const sql = `
        SELECT 1 FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2;
    `;
    try {
        const result = await pool.query(sql, [userId, projectId]);
        return result.rows.length > 0;
    } catch (error) {
        console.error("Error in isUserVolunteering:", error);
        throw error;
    }
}