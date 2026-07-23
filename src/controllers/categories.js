import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    getCategoriesByProjectId,
    createCategory,    
    updateCategory     
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator'; 

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    const title = category ? category.name : 'Category Not Found';
    res.render('category', { title, category, projects });
};

// --- Assignment: Create and Edit Categories ---

const showNewCategoryForm = (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect('/new-category');
    }

    try {
        await createCategory(req.body.name);
        req.flash('success', 'Category created successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error('Error creating category:', error);
        req.flash('error', 'Error creating category.');
        res.redirect('/new-category');
    }
};

const showEditCategoryForm = async (req, res) => {
    const category = await getCategoryById(req.params.id);
    res.render('edit-category', { title: 'Edit Category', category });
};

const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect(`/edit-category/${categoryId}`);
    }

    try {
        await updateCategory(categoryId, req.body.name);
        req.flash('success', 'Category updated successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'Error updating category.');
        res.redirect(`/edit-category/${categoryId}`);
    }
};

// --- Validation ---

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ max: 100 }).withMessage('Category name must be at most 100 characters')
        // Note: Min length 3 is only on server-side as requested
        .custom((value) => {
            if (value.length < 3) {
                throw new Error('Category name must be at least 3 characters');
            }
            return true;
        })
];

// --- Category Assignment ---

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);
    const title = 'Assign Categories to Project';
    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};