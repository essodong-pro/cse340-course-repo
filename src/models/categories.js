import db from './db.js';

export const getAllCategories = async () => {
    const sql = 'SELECT * FROM category ORDER BY name ASC';
    try {
        const { rows } = await db.query(sql);
        return rows;
    } catch (error) {
        console.error("Error in getAllCategories:", error);
        throw error;
    }
};

// 1. Retrieve a single category by its ID
export const getCategoryById = async (categoryId) => {
    const sql = 'SELECT * FROM category WHERE category_id = $1';
    try {
        const { rows } = await db.query(sql, [categoryId]);
        return rows[0];
    } catch (error) {
        console.error("Error in getCategoryById:", error);
        throw error;
    }
};

// 2. Retrieve all categories for a given service project
export const getCategoriesByProjectId = async (projectId) => {
    const sql = `
        SELECT c.category_id, c.name 
        FROM category c
        JOIN service_project_categories spc ON c.category_id = spc.category_id
        WHERE spc.project_id = $1;
    `;
    try {
        const { rows } = await db.query(sql, [projectId]);
        return rows;
    } catch (error) {
        console.error("Error in getCategoriesByProjectId:", error);
        throw error;
    }
};

// 3. Retrieve all service projects for a given category
export const getProjectsByCategoryId = async (categoryId) => {
    const sql = `
        SELECT p.project_id, p.title 
        FROM service_project p
        JOIN service_project_categories spc ON p.project_id = spc.project_id
        WHERE spc.category_id = $1;
    `;
    try {
        const { rows } = await db.query(sql, [categoryId]);
        return rows;
    } catch (error) {
        console.error("Error in getProjectsByCategoryId:", error);
        throw error;
    }
};