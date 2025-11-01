# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Configure MongoDB
Edit `src/main/resources/application.properties` and set your MongoDB connection string:
```properties
spring.data.mongodb.uri=your-mongodb-connection-string
```

### Step 2: Start Both Services
```bash
chmod +x start.sh
./start.sh
```

### Step 3: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080

## 📝 First Time Setup

### Backend Only
```bash
mvn clean install
./mvnw spring-boot:run
```

### Frontend Only
```bash
cd frontend
npm install
npm start
```

## 🔧 Troubleshooting

**Backend won't start?**
- Check MongoDB connection string
- Ensure port 8080 is available
- Check Java version: `java -version` (should be 21+)

**Frontend won't start?**
- Check Node version: `node -v` (should be 16+)
- Clear cache: `npm cache clean --force`
- Reinstall: `rm -rf node_modules && npm install`

**Both services failing?**
- Kill existing processes: `lsof -ti:8080 | xargs kill -9` and `lsof -ti:3000 | xargs kill -9`
- Restart using `./start.sh`

## 📚 More Information

- Full documentation: See [README.md](README.md)
- Deployment guide: See [DEPLOYMENT.md](DEPLOYMENT.md)
- Frontend details: See [frontend/README.md](frontend/README.md)

