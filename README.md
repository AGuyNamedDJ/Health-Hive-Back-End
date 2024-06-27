# Health-Hive

## Description <a name="description"></a>

Welcome to the GitHub repository for HealthHive, a robust backend system designed to manage hospital data efficiently. HealthHive leverages the power of Node.js, Express, and PostgreSQL to provide a scalable and secure solution for healthcare data management.

### Key Features:

    • Data Management: Efficiently handles and organizes hospital data, ensuring quick access and reliability.
    • Secure Authentication: Implements JSON Web Tokens (JWT) for secure and scalable user authentication.
    • Environment Variable Management: Uses dotenv to securely manage configuration and environment variables.
    • Scalable Architecture: Built with scalability in mind to handle growing data and user base.

### Technologies Used:

    • Backend Framework: Node.js and Express for server-side logic.
    • Database: PostgreSQL for reliable and efficient data storage.
    • Authentication: JSON Web Tokens (JWT) for secure user authentication.
    • Configuration Management: dotenv for environment variable management.

This repository includes comprehensive documentation on the codebase, including installation guides, file and directory structures, usage instructions, testing procedures, and more.

Explore this repository to understand the structure, conventions, and coding style used in HealthHive. Your interest and contributions are highly appreciated as we strive to improve healthcare data management with cutting-edge technology.

---

## Table of Contents <a name="table-of-contents"></a>

1. [Description](#description)
2. [Installation](#installation)
3. [Usage](#usage)
4. [File & Directory Structure](#file-directory-structure)
   - [public/](#public)
   - [src/](#src)
5. [APIs & Libraries Used](#api)
6. [Testing](#testing)
7. [Credits](#credits)
8. [Contact Information](#contact-information)

---

## Installation <a name="installation"></a>

To get this project running on your local machine, follow the steps mentioned below.

### Prerequisites

Ensure that you have Node.js and npm (Node Package Manager) installed on your machine. You can verify if you have these installed by running the following commands in your terminal/command prompt:

    npm -v

If these commands return versions, then you have the necessary installations to proceed. If not, please install Node.js and npm first.

### Steps

1. Clone the repository

Open a terminal/command prompt and navigate to the folder where you want to clone the repository. Run the following command:

    git clone https://github.com/AGuyNamedDJ/Health-Hive-Back-End.git

2. Navigate to the project directory

   cd health_hive_back_end

3. Install dependencies

   Once you're in the root directory of the project, install the required dependencies by running:

   npm install

This command will install all the project's dependencies mentioned in the package.json file, including React, React-DOM, bcrypt, cors, dotenv, and others.

4. Start the server

Once all the dependencies are installed, you can start the server:

    npm start

This will start the server and the website should be available at localhost:3000 (or a port that your terminal indicates).

Note: If changes are made to the package.json file, you will need to stop the server (Ctrl + C in the terminal), reinstall the dependencies (npm install), and then start the server again (npm start).

Please ensure you have the necessary access rights and permissions when performing the above operations. If you encounter any issues, please refer to the 'issues' section of the repository.

---

## Usage

After successfully running the server, navigate to localhost:3000 (or the port indicated in your terminal) in your browser. You should see the landing page of the HealthHive backend system.

The backend system includes several key functionalities accessible via the API endpoints:

    1. Appointments: Manage appointments with endpoints to create, read, update, and delete appointment records.
    2. Patients: Handle patient information, including adding new patients, updating existing records, and retrieving patient details.
    3. Medical Records: Store and manage patient medical records securely.
    4. Medications: Track medication information and manage prescriptions.
    5. Procedures:** Maintain records of medical procedures performed.
    6. Staff: Manage hospital staff information and their roles.
    7. Treatment Plans: Develop and manage patient treatment plans.

### Example API Endpoints:

    • Create Appointment: POST /api/appointment
    • Get Patient Information: GET /api/patient/:id
    • Update Medical Record: PUT /api/medicalRecord/:id
    • Delete Medication: DELETE /api/medication/:id

For detailed usage and examples of each API endpoint, refer to the API documentation included in this repository.

---

## File & Directory Structure

The HealthHive backend project is organized as follows:

api/

Contains the API endpoint definitions and the logic for handling requests and responses.

    • appointment.js: Manages appointment-related endpoints.
    • index.js: Entry point for the API routes.
    • medicalRecord.js: Manages medical record-related endpoints.
    • medication.js: Manages medication-related endpoints.
    • patient.js: Manages patient-related endpoints.
    • procedure.js: Manages procedure-related endpoints.
    • procedureStaff.js: Manages procedure staff-related endpoints.
    • staff.js: Manages staff-related endpoints.
    • treatmentPlan.js: Manages treatment plan-related endpoints.
    • users.js: Manages user-related endpoints (authentication, authorization).
    • utilities.js: Contains utility functions used across the API.

db/

Contains the database models and schemas.

    • Appointment.js: Defines the schema for appointment data.
    • Index.js: Entry point for database connection and model aggregation.
    • MedicalRecord.js: Defines the schema for medical record data.
    • Medication.js: Defines the schema for medication data.
    • Patient.js: Defines the schema for patient data.
    • Procedure.js: Defines the schema for procedure data.
    • ProcedureStaff.js: Defines the schema for procedure staff data.
    • Seed.js: Script for seeding the database with initial data.
    • Staff.js: Defines the schema for staff data.
    • TreatmentPlan.js: Defines the schema for treatment plan data.
    • Users.js: Defines the schema for user data.

Root Directory

    • .env: Contains environment variables for configuration.
    • .gitignore: Specifies files and directories to be ignored by Git.
    • package-lock.json: Contains the exact versions of dependencies installed.
    • package.json: Lists project dependencies and scripts.
    • README.md: The main documentation file for the project.
    • SDLC.md: Details the Software Development Life Cycle for the project.
    • server.js: Entry point for starting the server.
