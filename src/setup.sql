-- ========================================
-- Organization Table
-- ========================================
DROP TABLE IF EXISTS organization CASCADE;

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Service Projects Table
-- ========================================
DROP TABLE IF EXISTS service_project CASCADE;

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date DATE NOT NULL,
    CONSTRAINT fk_organization
      FOREIGN KEY(organization_id) 
      REFERENCES organization(organization_id)
      ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Service Projects
-- ========================================
INSERT INTO service_project (organization_id, title, description, location, date) VALUES
(1, 'Community Center Renovation', 'Repairing the roof and painting the local center.', 'Downtown', '2026-08-15'),
(1, 'Playground Safety Check', 'Ensuring equipment is secure for children.', 'City Park', '2026-09-01'),
(1, 'Tool Library Setup', 'Organizing donated construction tools.', 'BrightFuture HQ', '2026-09-15'),
(1, 'Pathway Paving', 'Laying bricks for a wheelchair-accessible path.', 'North District', '2026-10-05'),
(1, 'Community Garden Shed', 'Building a wooden shed for storage.', 'East Garden', '2026-10-20'),
(2, 'Fall Harvest Day', 'Picking vegetables for food pantries.', 'Harvest Field', '2026-09-10'),
(2, 'Compost Workshop', 'Teaching locals how to compost.', 'GreenHarvest Farm', '2026-09-25'),
(2, 'Seed Swap Event', 'Sharing heirloom seeds with the community.', 'Community Center', '2026-10-12'),
(2, 'Greenhouse Winterization', 'Preparing the greenhouse for colder weather.', 'Harvest Field', '2026-10-30'),
(2, 'Vegetable Basket Delivery', 'Distributing fresh produce to families.', 'Local Neighborhood', '2026-11-05'),
(3, 'Soup Kitchen Support', 'Serving hot meals to the homeless.', 'Unity Hall', '2026-08-22'),
(3, 'Back-to-School Drive', 'Distributing backpacks and supplies.', 'Central School', '2026-08-30'),
(3, 'Elderly Tech Support', 'Teaching senior citizens how to use computers.', 'Senior Living Center', '2026-09-14'),
(3, 'Blanket Donation Drive', 'Collecting and distributing warm bedding.', 'Unity Hall', '2026-10-18'),
(3, 'Park Litter Patrol', 'Cleaning up local recreational spaces.', 'Riverbank Park', '2026-11-02');

-- ========================================
-- Categories Table
-- ========================================
DROP TABLE IF EXISTS service_project_categories CASCADE;
DROP TABLE IF EXISTS category CASCADE;

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Junction Table: Service Project Categories
-- ========================================
CREATE TABLE service_project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project
      FOREIGN KEY(project_id) 
      REFERENCES service_project(project_id)
      ON DELETE CASCADE,
    CONSTRAINT fk_category
      FOREIGN KEY(category_id) 
      REFERENCES category(category_id)
      ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name) VALUES
('Education'),
('Infrastructure'),
('Community Service');

-- ========================================
-- Associate Projects with Categories
-- ========================================
INSERT INTO service_project_categories (project_id, category_id) VALUES
(1, 2), -- Community Center Renovation -> Infrastructure
(1, 3), -- Community Center Renovation -> Community Service
(13, 1); -- Elderly Tech Support -> Education