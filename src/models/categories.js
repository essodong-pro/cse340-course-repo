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

// --- Category Assignment ---

const assignCategoryToProject = async (categoryId, projectId) => {
    const sql = `
        INSERT INTO service_project_categories (category_id, project_id)
        VALUES ($1, $2);
    `;
    await db.query(sql, [categoryId, projectId]);
};

export const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteSql = `
        DELETE FROM service_project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteSql, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

// --- New functions for Creating and Updating Categories ---

/**
 * Creates a new category in the database.
 */
export const createCategory = async (name) => {
    const sql = 'INSERT INTO category (name) VALUES ($1) RETURNING category_id';
    try {
        const { rows } = await db.query(sql, [name]);
        return rows[0].category_id;
    } catch (error) {
        console.error("Error in createCategory:", error);
        throw error;
    }
};

/**
 * Updates an existing category in the database.
 */
export const updateCategory = async (categoryId, name) => {
    const sql = 'UPDATE category SET name = $1 WHERE category_id = $2 RETURNING category_id';
    try {
        const { rows } = await db.query(sql, [name, categoryId]);
        if (rows.length === 0) {
            throw new Error(`Category with ID ${categoryId} not found.`);
        }
        return rows[0].category_id;
    } catch (error) {
        console.error("Error in updateCategory:", error);
        throw error;
    }
};