# Software Development Life Cycle (SDLC) Plan

This document outlines the high-level strategy and plan for developing the backend of the HealthHive hospital data management system.

## Table of Contents <a name="table-of-contents"></a>

1. [Inception](#inception)
2. [Design](#design)
3. [Implementation](#implementation)
4. [Testing](#testing)
5. [Deployment & Maintenance](#d-m)
   - [Deployment](#deployment)
   - [Maintenance](#maintenance)

---

## Inception Overview <a name="inception"></a>

1. **Identified the key stakeholders**:
   - The main stakeholders of this project are hospital administrators, medical staff, and IT personnel. Each of these stakeholders has distinct needs, which were thoroughly analyzed.
2. **Gathered requirements**:
   - Through discussions with stakeholders and analysis of existing systems, we determined the essential features for our backend system. These included managing user accounts, handling patient records, managing appointments, and ensuring secure data access.
3. **Defined the system's scope**:
   - Based on the requirements, we defined the scope of our backend application to ensure it would fully support hospital data management functionalities.
4. **Outlined initial resources and timelines**:
   - We determined the resources needed, such as development tools and technologies, and created a preliminary timeline for the development process.
5. **Designed the system architecture**:
   - A crucial step was designing a comprehensive database schema to ensure efficient data management. The schema was built with a focus on scalability and optimization to handle various data such as patient information, appointments, medical records, and more.

---

## Design <a name="design"></a>

1. **Database Design**:
   - Using the requirements we gathered, we designed a relational database schema in PostgreSQL. The schema includes several tables to efficiently manage patients, appointments, medical records, medications, procedures, staff, and treatment plans. With careful planning and normalization, we ensured data integrity and efficient storage.
2. **API Design**:
   - Next, we designed our RESTful APIs to expose the necessary endpoints for the frontend application to interact with the data. We followed best practices for API design, including the use of HTTP methods, status codes, and sensible endpoint paths.
3. **Application Architecture Design**:
   - We adopted the MVC (Model-View-Controller) architecture for our application. With Express.js as our main framework, we structured our backend into Models for database interactions, Controllers for handling business logic, and Routes for endpoint configurations.
4. **Security Design**:
   - We placed high importance on the security of our application. We planned for the use of bcrypt for password hashing and jsonwebtoken for user authentication. Furthermore, we designed our application to follow the principle of least privilege, ensuring each user role has only the necessary access rights.
5. **Error Handling and Logging Design**:
   - To enhance maintainability and debuggability, we planned for comprehensive error handling and logging using tools like Morgan.
6. **Performance Considerations**:
   - While designing the backend, we also considered the system's performance under different load conditions. We made considerations for optimizing our database queries and handling potential bottlenecks in our application.

---

## Implementation <a name="implementation"></a>

During the implementation phase of our project, we translated our application design and plan into actual code. We adopted a modular approach, focusing on implementing one feature at a time, which not only improved the clarity of our code but also made debugging and testing easier. The implementation phase was divided into various stages, as detailed below:

1. **Environment Setup**:
   - We started by setting up our development environment. This involved installing the necessary software and libraries such as Node.js, Express, PostgreSQL, among others. We also initialized our project using npm, which created a package.json file. This file kept track of our project's dependencies and certain metadata.
2. **Database Creation**:
   - Using PostgreSQL, we designed and implemented our database schema based on the models identified during the design phase. We wrote a seed script to set up and populate the database with some initial data for testing purposes.
3. **Backend Implementation**:
   - We built our server using Express.js, a popular Node.js framework. We followed the principles of REST in our architecture, creating API routes that correspond to the standard HTTP methods (GET, POST, PUT, DELETE). Our controllers, defined in Express.js, interacted with the models to retrieve data and send it to the client side.
4. **Authentication and Authorization**:
   - We implemented user authentication using JWT (JSON Web Tokens) and Bcrypt for password hashing. This ensured secure user login and signup. We also set up middleware functions to protect certain routes and maintain user sessions.
5. **Integration**:
   - After completing the individual components, we focused on integrating all parts of the application. We made sure that our API endpoints correctly interacted with the database and returned the expected results. We also ensured that our application correctly handled errors and edge cases.
6. **Performance Optimization**:
   - We optimized our application for better performance. This included tasks like improving database queries, minimizing HTTP requests, and implementing caching where appropriate.

---

## Testing <a name="testing"></a>

Testing is a critical phase in the software development lifecycle. It helps ensure the functionality, reliability, performance, and security of our application. For this project, manual testing was conducted through extensive logging and step-by-step verification of each functionality.

### Testing Approach

1. **Logging**: Throughout the codebase, `console.log` statements were used to trace the execution flow and validate the data at various stages of processing.
2. **Endpoint Verification**: Each API endpoint was manually tested using tools like Postman to ensure they work as expected. This included verifying the responses for different request types (GET, POST, PUT, DELETE).
3. **Error Handling**: Specific scenarios were tested to check how the system handles errors, such as invalid input data or unauthorized access attempts.
4. **Database Operations**: Database operations (CRUD) were verified by directly querying the PostgreSQL database before and after API calls to ensure data consistency.

### Example Testing Process

For example, to test the **Create Patient** endpoint:

1. **Logging in Code**: Add `console.log` statements in `patient.js` to log the incoming request data and the response being sent back.

   ```javascript
   router.post("/", async (req, res) => {
     try {
       console.log("Creating new patient with data:", req.body);
       const newPatient = await Patient.create(req.body);
       console.log("New patient created:", newPatient);
       res.status(201).json(newPatient);
     } catch (error) {
       console.error("Error creating patient:", error);
       res.status(500).json({ error: "Failed to create patient" });
     }
   });
   ```

2. **Manual Request with Postman**:

   - Open Postman and create a POST request to `http://localhost:3000/api/patient`.
   - In the body of the request, include the patient data in JSON format:

     ```json
     {
       "name": "John Doe",
       "dob": "1980-01-01",
       "address": "123 Main St, Anytown, USA",
       "phone": "555-1234",
       "email": "john.doe@example.com"
     }
     ```

   - Send the request and observe the response.

3. **Verify Logs**:

   - Check the server logs to ensure the data was received and processed correctly.
   - Verify the logs show the expected data at each stage of the process.

4. **Database Verification**:
   - Use a PostgreSQL client to query the `patients` table and verify that the new patient record has been added correctly.

By following this detailed manual testing process, you can ensure each part of the system works as intended and catch any issues early.

---

## Deployment & Maintenance <a name="d-m"></a>

### Deployment <a name="deployment"></a>

Deployment is the phase where the application is made available to end users. For the HealthHive project, we've chosen [Render](https://render.com) as our deployment platform, given its simplicity, reliability, and excellent support for Node.js applications.

Render enables automatic deployments from your GitHub or GitLab repositories, along with integrated support for HTTPS, custom domains, and continuous integration/continuous deployment (CI/CD).

Here's a snapshot of our deployment process:

1. **Push to Repository**: We commit and push our finalized application code to our repository.
2. **Connect to Render**: We link the GitHub repository to our Render account. This sets up Render to watch for changes in our repository.
3. **Automatic Deployments**: Render automatically deploys our application whenever we push to the selected branch of our repository. This ensures our application is always up-to-date with our latest pushes.
4. **Database Connection**: We configure the environment variables on Render to securely connect to our PostgreSQL database.
5. **Verify Deployment**: Once Render deploys the application, we thoroughly test it to ensure it functions correctly in the live environment.

### Maintenance <a name="maintenance"></a>

Maintenance is an ongoing process of monitoring, updating, and improving the application post-deployment. We use Render's integrated metrics and analytics to continually monitor our application's performance and health.

1. **Monitor Performance**: We continuously keep tabs on the application's performance, reliability, and usage patterns using Render's analytics tools.
2. **Updates and Improvements**: As we collect user feedback and data, we iterate on our application, making updates and improvements as necessary. These changes are tested in the development environment before being deployed to the live site.
3. **Security Updates**: We stay alert to any potential security vulnerabilities and promptly update our application with necessary security patches.

Through these Deployment and Maintenance procedures, we ensure that our application is not only always accessible to our users but that it continues to meet and exceed their needs over time. This also helps us maintain a robust, secure, and high-performing application that aligns with industry best practices.
