# Privasimu Deployment Guide (On-Premise Docker)

This guide provides step-by-step instructions to deploy the Privasimu MVP Application on an on-premise server or cloud instance using Docker Compose.

## Prerequisites

1. **Docker Engine** (v24 or higher)
2. **Docker Compose plugin**
3. **Git**
4. Server Specs: Minimum 4GB RAM, 2 CPUs (8GB RAM recommended for Large Scanning Jobs)
5. Operating System: Linux (Ubuntu 22.04 LTS recommended)

## 1. Clone & Setup Repository

```bash
git clone https://github.com/pendtiumpraz/priva-back.git privasimu
cd privasimu

# Make sure you have the frontend repository inside or pull it structure appropriately.
```

*(If you are deploying from standard release package, simply exact the `.tar.gz` archive to `/opt/privasimu` and `cd` into it).*

## 2. Configuration Environment

1. Copy the example environment file:
   ```bash
   cp .env.docker.example .env
   ```

2. Open `.env` and change your database credentials:
   ```bash
   nano .env
   
   # Set strong passwords
   DB_PASSWORD=your_super_strong_password
   DB_ROOT_PASSWORD=your_super_strong_root_password
   ```

## 3. Build & Run the Containers

1. Run the Docker Compose in detached mode. This process can take around 5-10 minutes on its first run depending on your network as it installs PHP and Node.js dependencies natively for the Alpine containers.
   ```bash
   docker compose up -d --build
   ```

2. Verify that all 4 containers (`privasimu-backend`, `privasimu-frontend`, `privasimu-db`, `privasimu-redis`, `privasimu-nginx`) are running:
   ```bash
   docker compose ps
   ```

## 4. Initialize Database & Application Keys

Once the containers are successfully running, you must run application initialization commands inside the backend container.

1. **Generate Laravel App Key:**
   ```bash
   docker compose exec backend php artisan key:generate --force
   ```

2. **Run Migrations & Seeding (Critical):**
   ```bash
   docker compose exec backend php artisan migrate --force
   docker compose exec backend php artisan db:seed --force
   ```
   *Note: This will install initial master data (Departments, Standard Sektor Industri) and create the default Super Admin accounts.*

3. **Generate JWT Secret:**
   ```bash
   docker compose exec backend php artisan jwt:secret --force
   ```

4. **Clear Caches:**
   ```bash
   docker compose exec backend php artisan optimize:clear
   docker compose exec backend php artisan optimize
   ```

## 5. Verify the Installation

Open your browser and navigate to the IP address or domain name configured.

- **URL**: `http://your-server-ip/`
- **Default Superadmin Email**: `admin@privasimu.id`
- **Default Superadmin Password**: `password123` *(Change this immediately upon login!)*

---

## Maintenance & Operations

### Viewing Logs
To see logs if something goes wrong (e.g., scanning fails):
```bash
docker compose logs -f backend
docker compose logs -f frontend
```

### Applying Updates
When a new version is released:
```bash
# 1. Pull the latest code
git pull origin main

# 2. Rebuild the modified containers
docker compose build

# 3. Restart the containers
docker compose up -d

# 4. VERY IMPORTANT: Always run migrations after updating
docker compose exec backend php artisan migrate --force
```

### Restarting Services
To cleanly restart all services without losing data:
```bash
docker compose restart
```

To take down all services:
```bash
docker compose down
```
