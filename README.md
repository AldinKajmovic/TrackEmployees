## Features

- **Role-based Authorization**: 
  - Roles include Admin, Worker, Manager, with specific access controls on various routes.
  - Admin has full access to all features and data.

- **Time Tracking**: 
  - Workers can log in and out, with all actions timestamped for tracking purposes.

- **Project Management**: 
  - Managers can create projects and assign workers to them, ensuring effective task management.

- **Task Creation**: 
  - Tasks can be created for workers, facilitating organized workflow and accountability.

- **Reporting**: 
  - Generate various reports that can be exported in PDF format for easy sharing and record-keeping.

- **Notifications**: 
  - Automated email notifications to keep team members informed.
  - In-app messaging for direct communication between members.

## Installation

Create and edit .env file using .env.example

 Start application
   ```bash
   docker compose up
   ```

  Open your browser and go to http://localhost:3000/login

Technologies

    Node.js: JavaScript runtime for building server-side applications.
    Express.js: Web framework for Node.js, used for building the API.
    PostgreSQL: Relational database management system for data storage.
    Bootstrap: Front-end framework for responsive web design.
