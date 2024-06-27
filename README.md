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
   - [api/](#api-structure)
   - [db/](#db)
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

## Usage <a name="usage"></a>

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

## File & Directory Structure <a name="file-directory-structure"></a>

The HealthHive backend project is organized as follows:

### api/ <a name="api-structure"></a>

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

### db/ <a name="db"></a>

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

### Root Directory

    • .env: Contains environment variables for configuration.
    • .gitignore: Specifies files and directories to be ignored by Git.
    • package-lock.json: Contains the exact versions of dependencies installed.
    • package.json: Lists project dependencies and scripts.
    • README.md: The main documentation file for the project.
    • SDLC.md: Details the Software Development Life Cycle for the project.
    • server.js: Entry point for starting the server.

---

## APIs & Libraries Used <a name="api"></a>

This website is built using a variety of powerful libraries and APIs to ensure a smooth, interactive user experience. Here is a list of them:

### Libraries:

    1. bcrypt: A library to help you hash passwords. It’s widely used for securely storing passwords in a database.
    2. cors: A middleware for enabling Cross-Origin Resource Sharing (CORS) in Express applications, allowing your API to handle requests from different origins.
    3. dotenv: A module that loads environment variables from a .env file into process.env. It helps manage configuration and secrets securely.
    4. express: A fast, unopinionated, minimalist web framework for Node.js, used for building APIs and web applications.
    5. jsonwebtoken: A library for generating and verifying JSON Web Tokens (JWT), used for secure user authentication.
    6. morgan: An HTTP request logger middleware for Node.js, useful for logging requests in your application.
    7. pg: A PostgreSQL client for Node.js, used for interacting with PostgreSQL databases.

### APIs:

HealthHive provides a comprehensive set of RESTful APIs to manage hospital data efficiently. Here’s an overview of the key functionalities provided by the APIs:

#### Authentication and User Management

HealthHive includes secure user authentication and authorization using JSON Web Tokens (JWT). It ensures that only authorized personnel can access sensitive hospital data.

    • Register User: POST /api/users/register - Registers a new user with the system.
    • Login User: POST /api/users/login - Authenticates a user and issues a JWT.

#### Patient Management

Efficiently manage patient information, ensuring all records are up-to-date and easily accessible.

    • Create Patient: POST /api/patient - Adds a new patient to the system.
    • Retrieve Patient: GET /api/patient/:id - Retrieves details of a specific patient.
    • Update Patient: PUT /api/patient/:id - Updates patient information.
    • Delete Patient: DELETE /api/patient/:id - Deletes a patient record.

#### Appointment Scheduling

Streamline the scheduling and management of patient appointments.

    • Create Appointment: POST /api/appointment - Schedules a new appointment.
    • Retrieve Appointment: GET /api/appointment/:id - Retrieves details of a specific appointment.
    • Update Appointment: PUT /api/appointment/:id - Updates appointment details.
    • Delete Appointment: DELETE /api/appointment/:id - Cancels an appointment.

#### Medical Records

Securely manage patient medical records, ensuring privacy and accuracy.

    • Create Medical Record: POST /api/medicalRecord - Adds a new medical record.
    • Retrieve Medical Record: GET /api/medicalRecord/:id - Retrieves a specific medical record.
    • Update Medical Record: PUT /api/medicalRecord/:id - Updates a medical record.
    • Delete Medical Record: DELETE /api/medicalRecord/:id - Deletes a medical record.

#### Medications

Keep track of prescribed medications and manage medication data efficiently.

    • Create Medication: POST /api/medication - Adds a new medication entry.
    • Retrieve Medication: GET /api/medication/:id - Retrieves details of a specific medication.
    • Update Medication: PUT /api/medication/:id - Updates medication information.
    • Delete Medication: DELETE /api/medication/:id - Deletes a medication entry.

#### Procedures

Manage records of medical procedures, ensuring all relevant data is captured and accessible.

    • Create Procedure: POST /api/procedure - Adds a new procedure record.
    • Retrieve Procedure: GET /api/procedure/:id - Retrieves details of a specific procedure.
    • Update Procedure: PUT /api/procedure/:id - Updates procedure information.
    • Delete Procedure: DELETE /api/procedure/:id - Deletes a procedure record.

#### Staff Management

Maintain information about hospital staff, their roles, and assignments.

    • Add Staff Member: POST /api/staff - Adds a new staff member.
    • Retrieve Staff Member: GET /api/staff/:id - Retrieves details of a specific staff member.
    • Update Staff Member: PUT /api/staff/:id - Updates staff information.
    • Delete Staff Member: DELETE /api/staff/:id - Removes a staff member from the system.

#### Treatment Plans

Develop and manage comprehensive treatment plans for patients.

    • Create Treatment Plan: POST /api/treatmentPlan - Adds a new treatment plan.
    • Retrieve Treatment Plan: GET /api/treatmentPlan/:id - Retrieves details of a specific treatment plan.
    • Update Treatment Plan: PUT /api/treatmentPlan/:id - Updates a treatment plan.
    • Delete Treatment Plan: DELETE /api/treatmentPlan/:id - Deletes a treatment plan.

#### Example Usage

To get a feel for how to interact with the HealthHive APIs, here’s an example of how to create a new patient record:

```
curl -X POST http://localhost:3000/api/patient -H "Content-Type: application/json" -d '{
  "name": "John Doe",
  "dob": "1980-01-01",
  "address": "123 Main St, Anytown, USA",
  "phone": "555-1234",
  "email": "john.doe@example.com"
}'
```

This request will create a new patient record in the system. Similar requests can be made for other endpoints to manage appointments, medical records, medications, procedures, staff, and treatment plans.

By providing an overview and examples, you offer clear guidance on the APIs’ capabilities without duplicating the detailed file structure information. This makes the section both informative and concise.

---

## Testing <a name="testing"></a>

Testing is a crucial part of the development process to ensure the reliability and functionality of the HealthHive backend. In this project, manual testing was conducted through extensive logging and step-by-step verification of each functionality.

### Testing Approach

    1. Logging: Throughout the codebase, console.log statements were used to trace the execution flow and validate the data at various stages of processing.
    2. Endpoint Verification: Each API endpoint was manually tested using tools like Postman to ensure they work as expected. This included verifying the responses for different request types (GET, POST, PUT, DELETE).
    3. Error Handling: Specific scenarios were tested to check how the system handles errors, such as invalid input data or unauthorized access attempts.
    4. Database Operations: Database operations (CRUD) were verified by directly querying the PostgreSQL database before and after API calls to ensure data consistency.

### Example Testing Process

For example, to test the Create Patient endpoint:

    1. Logging in Code: Add console.log statements in patient.js to log the incoming request data and the response being sent back.

    ```
    router.post('/', async (req, res) => {
        try {
            console.log('Creating new patient with data:', req.body);
            const newPatient = await Patient.create(req.body);
            console.log('New patient created:', newPatient);
            res.status(201).json(newPatient);
        } catch (error) {
            console.error('Error creating patient:', error);
            res.status(500).json({ error: 'Failed to create patient' });
        }
        });
    ```

    2. Manual Request with Postman:
        • Open Postman and create a POST request to http://localhost:3000/api/patient.
        • In the body of the request, include the patient data in JSON format:
    ```
    {
        "name": "John Doe",
        "dob": "1980-01-01",
        "address": "123 Main St, Anytown, USA",
        "phone": "555-1234",
        "email": "john.doe@example.com"
    }
    ```
    3. Verify Logs:
        • Check the server logs to ensure the data was received and processed correctly.
        • Verify the logs show the expected data at each stage of the process.
    4. Database Verification:
        • Use a PostgreSQL client to query the patients table and verify that the new patient record has been added correctly.

    By following this detailed manual testing process, you can ensure each part of the system works as intended and catch any issues early.

---

## Credits <a name="credits"></a>

HealthHive was designed and developed by Dalron J. Robertson, showcasing his expertise in backend development and his commitment to creating efficient, secure, and scalable solutions for healthcare data management.

    • Project Lead and Developer: Dalron J. Robertson

---

## Contact Information <a name="contact-information"></a>

For any questions or concerns, you can reach out to me through the following methods:

- Email: dalronj.robertson@gmail.com
- Github: [AGuyNamedDJ](https://github.com/AGuyNamedDJ)
- LinkedIn: [Dalron J. Robertson](https://www.linkedin.com/in/dalronjrobertson/)
- Website: [dalronjrobertson.com](https://dalronjrobertson.com)
- YouTube: [AGNDJ](https://youtube.com/@AGNDJ)

I'm always open to feedback, collaboration, or simply a chat. Feel free to get in touch!
