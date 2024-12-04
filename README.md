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

1. **Clone Repository:**
   ```bash
   git clone <repository-url>
   cd multi-component-app
   ```

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

### 1. Common Issues

#### Container Won't Start
```bash
# Check logs
docker-compose logs web

# Verify network
docker network ls
docker network inspect app-network
```

#### Database Connection Issues
```bash
# Check MySQL status
docker-compose logs mysql

# Verify connectivity 
docker exec web ping mysql
```

#### Application Errors
```bash
# Check application logs
docker-compose logs web

# Access container shell
docker exec -it web sh
```

### 2. Debug Commands
```bash
# List all containers (including stopped)
docker ps -a

# Check container configuration
docker inspect <container_id>

# View network settings
docker network inspect app-network
```

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
