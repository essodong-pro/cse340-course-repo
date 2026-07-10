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