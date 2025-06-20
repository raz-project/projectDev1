pipeline {
    agent any  // Runs on any available agent (Windows, Linux, or Mac)
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('raz_docker')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: "main", url: 'https://github.com/raz-project/projectDev1.git'  // Replace with your repository URL
            }
        }

        stage('Docker Build and Tag') {
            steps {
                bat "docker build -t %DOCKERHUB_CREDENTIALS_USR%/nodejs-app:1.0 ."
            }
        }

        stage('Docker Push to DockerHub') {
            steps {
                bat """
                    echo %DOCKERHUB_CREDENTIALS_PSW% | docker login -u %DOCKERHUB_CREDENTIALS_USR% --password-stdin
                    docker push %DOCKERHUB_CREDENTIALS_USR%/nodejs-app:1.0
                """
            }
        }

        stage('Run Docker Container') {
            steps {
                bat "docker run -d  --name nodejs-container %DOCKERHUB_CREDENTIALS_USR%/nodejs-app:1.0"
            }
        }
        
        stage('Cleanup') {
            steps {
                bat """
                    docker stop nodejs-container
                    docker rm nodejs-container
                    docker rmi %DOCKERHUB_CREDENTIALS_USR%/nodejs-app:1.0
                """
            }
        }

        stage('Docker Compose Up') {
            steps {
                bat """
                    docker compose down -v || exit 0
                    docker compose up -d --build
                    ping -n 10 127.0.0.1 > nul
                    docker compose ps
                """
            }
        }

        stage('Test HTML Response') {
           steps {
               bat """
                   powershell -Command \\
                   \$response = Invoke-WebRequest -Uri http://localhost:8081 -UseBasicParsing; \\
                   if (\$response.Content -notmatch '<html') { \\
                      Write-Error 'HTML content not found in response!'; \\
                      exit 1; \\
                    } else { \\
                      Write-Host 'HTML content detected.'; \\
                    }
                   """
             }
        }

        stage('Docker Compose Down') {
            steps {
                bat """
                    docker compose down -v
                    docker volume prune -f
                """
            }
        }
        

    }
}