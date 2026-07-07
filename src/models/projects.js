const db = require('../util/database');

const getAllProjects = async () => {
    const query = `
        SELECT p.*, o.name AS organization_name 
        FROM service_project p 
        JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.date ASC;
    `;
    const [rows] = await db.execute(query);
    return rows;
};

module.exports = { getAllProjects };