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