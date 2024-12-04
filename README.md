# Multi-Component Docker Application with MySQL

This comprehensive guide details the development and deployment of a containerized web application using Node.js and MySQL. The application demonstrates Docker containerization, multi-container orchestration, and deployment practices.

## Table of Contents
- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Detailed Component Breakdown](#detailed-component-breakdown)
- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Docker Configuration](#docker-configuration)
- [Production Deployment](#production-deployment)
- [Security Best Practices](#security-best-practices)
- [Maintenance and Monitoring](#maintenance-and-monitoring)
- [Troubleshooting Guide](#troubleshooting-guide)
- [Additional Resources](#additional-resources)
- [Deployment Scenarios](#deployment-scenarios)
- [Getting Started](#getting-started)

## Project Overview

This project implements a web application that displays announcements stored in a MySQL database. Key features include:
- Containerized Node.js web application
- Containerized MySQL database
- Docker Compose orchestration
- Production-ready deployment configuration
- Data persistence using Docker volumes
- Container networking and security configurations

## Project Structure

```
multi-component-app/
├── public/                    # Static web assets
│   └── index.html            # Frontend interface
├── server.js                 # Node.js backend
├── init.sql                 # Database initialization
├── Dockerfile               # Web app container config
├── docker-compose.yml       # Development orchestration
├── package.json            # Node.js dependencies
├── package-lock.json       # Dependency lock file
└── README.md               # Documentation
```

## Detailed Component Breakdown

### 1. Frontend Application (`public/index.html`)
```html
<!DOCTYPE html>
<html>
<head>
    <title>Sample Web Application</title>
</head>
<body>
    <h1>Welcome to the Sample Web Application</h1>
    <div id="announcements"></div>
    <script>
        fetch('/api/announcements')
            .then(response => response.json())
            .then(data => {
                const announcementsDiv = document.getElementById('announcements');
                data.forEach(item => {
                    const p = document.createElement('p');
                    p.textContent = `${item.id}: ${item.message}`;
                    announcementsDiv.appendChild(p);
                });
            })
            .catch(err => console.error(err));
    </script>
</body>
</html>
```
Key Features:
- Simple, clean interface
- Dynamic content loading via Fetch API
- Error handling for failed requests
- No external dependencies

### 2. Backend Server (`server.js`)
```javascript
const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

// MySQL Connection Configuration
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: 'root',
    password: 'password',
    database: 'sampledb'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Serve static files
app.use(express.static('public'));

// API endpoint
app.get('/api/announcements', (req, res) => {
    db.query('SELECT * FROM announcements', (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```
Key Features:
- Express.js web framework
- MySQL database integration
- Environment variable support
- Error handling and logging
- Static file serving
- RESTful API endpoint

### 3. Database Initialization (`init.sql`)
```sql
CREATE DATABASE IF NOT EXISTS sampledb;
USE sampledb;

CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255) NOT NULL
);

INSERT INTO announcements (message) VALUES
    ('Welcome to the sample web application!'),
    ('This is your first announcement!'),
    ('Enjoy working on this project!');
```
Key Features:
- Idempotent database creation
- Table schema definition
- Sample data insertion
- SQL best practices

### 4. Docker Configuration

#### Web Application Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]
```
Key Features:
- Lightweight Alpine-based image
- Clear working directory setup
- Dependency installation
- Port exposure
- Command specification

#### Development docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mysql
    networks:
      - app-network
    environment:
      MYSQL_HOST: mysql

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: sampledb
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## Prerequisites

1. **Node.js Installation**
   - Download from: https://nodejs.org/
   - Minimum version: 18.x
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Docker Installation**
   - Download Docker Desktop: https://www.docker.com/products/docker-desktop
   - System requirements:
     - Windows 10/11 Pro, Enterprise, or Education
     - WSL 2 enabled
     - Virtualization enabled in BIOS
   - Verify installation:
     ```bash
     docker --version
     docker-compose --version
     ```

3. **Docker Hub Account**
   - Sign up at: https://hub.docker.com/
   - Remember to login:
     ```bash
     docker login
     ```

## Development Setup

1. **Create Project Files:**
   Follow the "Project Setup" section above to create all necessary files.

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   Dependencies installed:
   - express: ^4.18.2
   - mysql: ^2.18.1

3. **Environment Setup:**
   Default configuration uses:
   - Port 3000 for web application
   - Port 3306 for MySQL
   - Root password: "password"
   - Database: "sampledb"

4. **Start Development Environment:**
   ```bash
   docker-compose up --build
   ```
   This command:
   - Builds the web application image
   - Pulls MySQL 8.0 image
   - Creates required networks
   - Starts all services

## Getting Started

### Project Setup

1. **Create Project Structure**
   ```bash
   # Create project directory
   mkdir csp451-demo
   cd csp451-demo
   
   # Create subdirectories
   mkdir public
   ```

2. **Initialize Node.js Project**
   ```bash
   # Initialize npm project
   npm init -y
   
   # Install required dependencies
   npm install express mysql
   ```

3. **Create Required Files**
   Create the following files in your project directory:

   a. `public/index.html`:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>Sample Web Application</title>
   </head>
   <body>
       <h1>Welcome to the Sample Web Application</h1>
       <div id="announcements"></div>
       <script>
           fetch('/api/announcements')
               .then(response => response.json())
               .then(data => {
                   const announcementsDiv = document.getElementById('announcements');
                   data.forEach(item => {
                       const p = document.createElement('p');
                       p.textContent = `${item.id}: ${item.message}`;
                       announcementsDiv.appendChild(p);
                   });
               })
               .catch(err => console.error(err));
       </script>
   </body>
   </html>
   ```

   b. `server.js`:
   ```javascript
   const express = require('express');
   const mysql = require('mysql');
   const path = require('path');

   const app = express();
   const port = 3000;

   // MySQL Connection Configuration
   const db = mysql.createConnection({
       host: process.env.MYSQL_HOST || 'localhost',
       user: 'root',
       password: 'password',
       database: 'sampledb'
   });

   // Connect to MySQL
   db.connect((err) => {
       if (err) {
           console.error('Error connecting to MySQL:', err);
           return;
       }
       console.log('Connected to MySQL database');
   });

   // Serve static files
   app.use(express.static('public'));

   // API endpoint
   app.get('/api/announcements', (req, res) => {
       db.query('SELECT * FROM announcements', (err, results) => {
           if (err) {
               console.error('Error querying database:', err);
               res.status(500).json({ error: 'Database error' });
               return;
           }
           res.json(results);
       });
   });

   app.listen(port, () => {
       console.log(`Server running at http://localhost:${port}`);
   });
   ```

   c. `init.sql`:
   ```sql
   CREATE DATABASE IF NOT EXISTS sampledb;
   USE sampledb;

   CREATE TABLE IF NOT EXISTS announcements (
       id INT AUTO_INCREMENT PRIMARY KEY,
       message VARCHAR(255) NOT NULL
   );

   INSERT INTO announcements (message) VALUES
       ('Welcome to the sample web application!'),
       ('This is your first announcement!'),
       ('Enjoy working on this project!');
   ```

   d. `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY . .
   RUN npm install
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

   e. `docker-compose.yml`:
   ```yaml
   version: '3.8'

   services:
     web:
       build: .
       ports:
         - "3000:3000"
       depends_on:
         - mysql
       networks:
         - app-network
       environment:
         MYSQL_HOST: mysql

     mysql:
       image: mysql:8.0
       environment:
         MYSQL_ROOT_PASSWORD: password
         MYSQL_DATABASE: sampledb
       volumes:
         - ./init.sql:/docker-entrypoint-initdb.d/init.sql
       ports:
         - "3306:3306"
       networks:
         - app-network

   networks:
     app-network:
       driver: bridge
   ```

## Docker Configuration

### 1. Image Management

Build and tag image:
```bash
# Build image
docker build -t myapp .

# Tag for Docker Hub
docker tag myapp dcjoker/csp451-web:latest

# Push to Docker Hub
docker push dcjoker/csp451-web:latest
```

### 2. Container Management

Common commands:
```bash
# List running containers
docker ps

# View container logs
docker logs <container_id>

# Stop containers
docker-compose down

# Remove all containers and volumes
docker-compose down -v
```

## Production Deployment

### 1. Deployment Structure
```
deployment/
├── docker-compose.yml
└── init.sql
```

### 2. Production docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    image: dcjoker/csp451-web:latest
    ports:
      - "3000:3000"
    depends_on:
      - mysql
    networks:
      - app-network
    environment:
      MYSQL_HOST: mysql
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: sampledb
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge

volumes:
  mysql_data:
```

### 3. Deployment Steps

1. **Prepare Deployment Directory:**
   ```bash
   mkdir -p CSP451_CP11_deployment
   cp init.sql CSP451_CP11_deployment/
   ```

2. **Create Production Configuration:**
   - Copy production docker-compose.yml
   - Update environment variables
   - Configure volumes

3. **Deploy Application:**
   ```bash
   cd CSP451_CP11_deployment
   docker-compose up -d
   ```

4. **Verify Deployment:**
   ```bash
   # Check container status
   docker ps
   
   # View logs
   docker-compose logs
   
   # Test application
   curl http://localhost:3000
   ```

## Security Best Practices

### 1. Container Security
- Use specific image versions
- Implement least privilege principle
- Regular security updates
- Scan images for vulnerabilities

### 2. Network Security
- Use internal networks when possible
- Limit exposed ports
- Implement proper firewalls
- Use HTTPS in production

### 3. Database Security
- Change default passwords
- Use environment variables
- Regular backups
- Implement proper user privileges

## Maintenance and Monitoring

### 1. Regular Maintenance
```bash
# Update images
docker-compose pull

# Rebuild applications
docker-compose up --build -d

# Clean unused resources
docker system prune
```

### 2. Monitoring
```bash
# Container stats
docker stats

# View logs
docker-compose logs --tail=100 -f

# Check container health
docker inspect <container_id>
```

### 3. Backup Procedures
```bash
# Backup MySQL data
docker exec mysql mysqldump -u root -p sampledb > backup.sql

# Restore from backup
docker exec -i mysql mysql -u root -p sampledb < backup.sql
```

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Docker Container Issues

##### Container Won't Start
```bash
# Windows
docker-compose down
docker system prune -f
docker-compose up --build

# Linux/Mac
sudo docker-compose down
sudo docker system prune -f
sudo docker-compose up --build
```

##### Permission Issues (Linux/Mac)
```bash
# Fix permission issues with MySQL volume
sudo chown -R 999:999 ./mysql-data
# Fix permission issues with node_modules
sudo chown -R $USER:$USER .
```

##### Network Issues
```bash
# Check if containers are on the same network
docker network ls
docker network inspect app-network

# Verify container connectivity
docker exec web ping mysql  # Windows
docker exec web ping mysql  # Linux/Mac
```

#### 2. Database Issues

##### Connection Refused
```bash
# Check if MySQL is running
docker-compose ps
docker-compose logs mysql

# Verify MySQL credentials
docker exec -it mysql mysql -uroot -p
# Enter password when prompted
```

##### Database Reset
```bash
# Windows
docker-compose down
del /f /s /q mysql-data
docker-compose up --build

# Linux/Mac
sudo docker-compose down
rm -rf mysql-data
sudo docker-compose up --build
```

#### 3. Node.js Application Issues

##### Module Not Found
```bash
# Windows
rmdir /s /q node_modules
del package-lock.json
docker-compose build --no-cache web

# Linux/Mac
rm -rf node_modules
rm package-lock.json
docker-compose build --no-cache web
```

##### Port Already In Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Platform-Specific Considerations

#### Windows
- Use Windows PowerShell or Command Prompt with Administrator privileges
- Docker Desktop must be installed and running
- WSL2 backend is recommended for better performance
- Line endings should be set to LF in git config:
  ```bash
  git config --global core.autocrlf input
  ```

#### Linux
- Docker and Docker Compose must be installed separately
- User must be in docker group or use sudo:
  ```bash
  sudo usermod -aG docker $USER
  newgrp docker
  ```
- SELinux considerations (if enabled):
  ```bash
  sudo setenforce 0  # Temporarily disable
  # Or label volumes
  sudo chcon -Rt svirt_sandbox_file_t ./
  ```

#### macOS
- Install Docker Desktop for Mac
- Ensure sufficient resources allocated in Docker preferences
- For M1/M2 Macs, use ARM64 images when available:
  ```yaml
  # In docker-compose.yml
  services:
    web:
      platform: linux/arm64/v8  # For M1/M2 Macs
  ```

### Verification Steps

After resolving issues, verify the setup:

1. Check container status:
```bash
docker-compose ps
```

2. Verify logs:
```bash
docker-compose logs web
docker-compose logs mysql
```

3. Test database connection:
```bash
docker exec web node -e "const mysql = require('mysql'); const connection = mysql.createConnection({host: 'mysql', user: 'root', password: 'password'}); connection.connect((err) => { console.log(err || 'Connected!'); process.exit(); });"
```

4. Check application access:
- Open browser: http://localhost:3000
- Check API: http://localhost:3000/api/announcements

### Getting Help

If issues persist:
1. Check Docker and container logs
2. Verify network configurations
3. Ensure all ports are available
4. Review environment variables
5. Check system resources (CPU, Memory, Disk)

For additional assistance:
- Review Docker documentation: https://docs.docker.com
- Check Node.js documentation: https://nodejs.org/docs
- MySQL documentation: https://dev.mysql.com/doc

## Additional Resources

### Docker Documentation
- [Docker Compose](https://docs.docker.com/compose/)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Docker Network](https://docs.docker.com/network/)

### Node.js Resources
- [Express.js Guide](https://expressjs.com/guide/routing.html)
- [MySQL Node.js](https://github.com/mysqljs/mysql)

### Best Practices
- [Docker Security](https://docs.docker.com/engine/security/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MySQL Performance](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

## Version History

- v1.0.0 (2024-12-03)
  - Initial release
  - Basic announcement functionality
  - Docker containerization
  - MySQL integration

## Deployment Scenarios

### Scenario 1: Local Development Environment

#### Prerequisites
- Node.js v18 or later
- MySQL 8.0
- npm (comes with Node.js)

#### Steps

1. **Create Project Files**
   Follow the "Project Setup" section above to create all necessary files
   Ensure all files are created with the exact content provided

2. **Install MySQL**
   ```bash
   # Windows: Download and install from https://dev.mysql.com/downloads/installer/
   # Mac with Homebrew
   brew install mysql
   brew services start mysql
   # Linux (Ubuntu/Debian)
   sudo apt update
   sudo apt install mysql-server
   sudo systemctl start mysql
   ```

3. **Configure MySQL**
   ```bash
   # Set root password and create database
   mysql -u root
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
   exit;
   
   # Import database schema
   mysql -u root -p < init.sql
   ```

4. **Setup Node.js Application**
   ```bash
   # Install dependencies
   npm install
   
   # Create .env file
   echo "MYSQL_HOST=localhost" > .env
   echo "MYSQL_USER=root" >> .env
   echo "MYSQL_PASSWORD=password" >> .env
   echo "MYSQL_DATABASE=sampledb" >> .env
   ```

5. **Run and Test**
   ```bash
   # Start the application
   node server.js
   
   # Test in browser
   open http://localhost:3000
   
   # Test API endpoint
   curl http://localhost:3000/api/announcements
   ```

### Scenario 2: Local Docker Desktop Environment

#### Prerequisites
- Docker Desktop installed and running
- Docker Compose installed

#### Steps

1. **Build Docker Images**
   ```bash
   # Build all services
   docker-compose build
   ```

2. **Run Containers**
   ```bash
   # Start all services
   docker-compose up -d
   
   # Check status
   docker-compose ps
   ```

3. **Test Deployment**
   ```bash
   # Check logs
   docker-compose logs web
   docker-compose logs mysql
   
   # Test connectivity
   docker exec web curl http://localhost:3000/api/announcements
   
   # Access in browser
   open http://localhost:3000
   ```

4. **Cleanup (Optional)**
   ```bash
   # Stop and remove containers
   docker-compose down
   
   # Remove volumes (if needed)
   docker-compose down -v
   ```

### Scenario 3: Docker Hub Deployment

#### Prerequisites
- Docker Hub account
- Docker logged in locally (`docker login`)

#### Steps

1. **Prepare Image for Docker Hub**
   ```bash
   # Set your Docker Hub username
   export DOCKER_USERNAME=your-username
   
   # Tag the image
   docker tag csp451-cp11-web $DOCKER_USERNAME/csp451-demo:latest
   ```

2. **Push to Docker Hub**
   ```bash
   # Push the image
   docker push $DOCKER_USERNAME/csp451-demo:latest
   ```

3. **Deploy from Docker Hub**
   ```bash
   # Stop existing containers (if any)
   docker-compose down
   
   # Edit docker-compose.yml to use Docker Hub image
   # Replace 'build: .' with 'image: your-username/csp451-demo:latest'
   
   # Pull and run
   docker-compose pull
   docker-compose up -d
   ```

4. **Verify Deployment**
   ```bash
   # Check container status
   docker-compose ps
   
   # View logs
   docker-compose logs -f
   
   # Test application
   curl http://localhost:3000/api/announcements
   ```

### Testing Each Deployment

For each scenario, perform these verification steps:

1. **Database Connection**
   ```bash
   # Local Environment
   mysql -u root -p -e "SELECT * FROM sampledb.announcements;"
   
   # Docker Environment
   docker exec mysql mysql -u root -p sampledb -e "SELECT * FROM announcements;"
   ```

2. **API Endpoint**
   ```bash
   # Using curl
   curl http://localhost:3000/api/announcements
   
   # Using browser
   open http://localhost:3000/api/announcements
   ```

3. **Web Interface**
   - Open browser to http://localhost:3000
   - Verify announcements are displayed
   - Check browser console for errors

4. **Error Logging**
   ```bash
   # Local Environment
   tail -f app.log
   
   # Docker Environment
   docker-compose logs -f web
   ```

### Troubleshooting Each Scenario

#### Local Environment Issues
- Check MySQL service status
- Verify Node.js version compatibility
- Check port availability
- Review environment variables

#### Docker Desktop Issues
- Ensure Docker Desktop is running
- Check container logs
- Verify network connectivity
- Review volume mounts

#### Docker Hub Deployment Issues
- Verify Docker Hub credentials
- Check image pull policy
- Review container registry settings
- Validate image tags
