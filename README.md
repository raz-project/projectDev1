# projectDev1

🚀 Node.js CI/CD Pipeline to Kubernetes (K3s)
This project automates a full CI/CD pipeline using Jenkins, from GitHub to Kubernetes deployment. It builds a Node.js web app into a Docker image, scans it, pushes to Docker Hub, and then deploys to K3s with auto-scaling enabled.

📦 What It Does
✅ Builds Docker image of a Node.js web app
✅ Tags and pushes image to Docker Hub
✅ Scans image for vulnerabilities using Trivy
✅ Deploys the app to K3s using kubectl
✅ Mounts and serves a custom index.html
✅ Applies a Complex Horizontal Pod Autoscaler
✅ Verifies app is live with curl
✅ Performs full CI/CD using Jenkins + GitHub

⚙️ Tools Used
Node.js – Web application

Docker – Image creation & deployment

Docker Hub – Image registry

Trivy – Security scanning

Jenkins – CI/CD automation

GitHub – Source control

K3s – Lightweight Kubernetes

kubectl – Kubernetes CLI

📁 Project Structure
graphql
Copy
Edit
projectDev1/
│
├── Dockerfile                # Node.js app container config  
├── app.js                    # Simple Node HTTP server  
├── web/index.html            # Static HTML served by app  
├── docker-compose.yml        # Local container testing  
├── Jenkinsfile               # Full CI/CD pipeline (Linux)  
├── Jenkinsfile-win-os        # Windows-compatible pipeline  
├── .github/workflows/        # GitHub Actions pipeline  
│   └── pipeline.yaml         
├── complex-hpa.yaml          # HPA + Deployment + Service  
├── package.json              # Node app dependencies  
└── README.md                 # This file  
🛠️ Pipeline Overview
Each push to GitHub triggers the following:

🐳 Build & Push
Docker image is built from Dockerfile

Tagged as nodejs-app:1.0

Pushed to Docker Hub

🔍 Scan with Trivy
The image is scanned for critical & high vulnerabilities

🚀 Run & Test Locally
Docker container is started

curl is used to verify the HTML page is served

Then the container is stopped and removed

🧪 Docker Compose (Optional)
Runs services locally using docker-compose.yml

Verifies custom mounted index.html via curl

☸️ Kubernetes (K3s)
K3s is installed and checked

complex-hpa.yaml is applied:

Deployment

Service (NodePort)

HorizontalPodAutoscaler

App is port-forwarded & tested via curl http://localhost:8081/index.html

🧼 Cleanup
All Kubernetes resources in project-devops namespace are deleted

🌐 Final Result
After the full pipeline runs, your Node.js app is:

Containerized and scanned

Pushed to Docker Hub

Deployed and auto-scaled in K3s

Exposing index.html on port 8081
