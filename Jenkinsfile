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
                sh "docker build -t ${DOCKERHUB_CREDENTIALS_USR}/nodejs-app:1.0 ."
            }
        }

        stage('Docker Push to DockerHub') {
            steps {
                sh """
                    echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                    docker push ${DOCKERHUB_CREDENTIALS_USR}/nodejs-app:1.0
                """
            }
        }

        stage('Run Docker Container') {
            steps {
                sh "docker run -d  --name nodejs-container ${DOCKERHUB_CREDENTIALS_USR}/nodejs-app:1.0"
            }
        }
        
        stage('Cleanup') {
            steps {
                sh """
                    docker stop nodejs-container
                    docker rm nodejs-container
                    docker rmi ${DOCKERHUB_CREDENTIALS_USR}/nodejs-app:1.0
                """
            }
        }

        stage('Docker Compose Up') {
            steps {
                sh """
                    docker compose down -v || exit 0
                    docker compose up -d --build
                    sleep 10
                    docker compose ps
                """
            }
        }

        stage('Test HTML Response') {
           steps {
                sh '''
                     curl -s http://localhost:8081
                '''
            }
        }

        stage('Docker Compose Down') {
            steps {
                sh """
                    docker compose down -v
                    docker volume prune -f
                """
            }
        }

        stage('Install k3s') {
            steps {
                sh '''
                    echo "Installing k3s..."
                    curl -sfL https://get.k3s.io | sh -
                '''
            }
        }

        stage('Check k3s Version') {
            steps {
               sh '''
                   echo "Checking k3s version..."
                   k3s --version
               '''
            }
         }

         stage('Apply COMPLEX-HPA Configuration') {
            steps {
                sh '''
                    echo "Applying complex-hpa.yaml..."
                    kubectl apply -f complex-hpa.yaml
                '''
            }
        }

        stage('Verify Pods') {
            steps {
                sh '''
                    echo "Waiting for pods to be created..."
                    sleep 10
                    kubectl get pods
                '''
            }
        }

        stage('Test index.html in Pod') {
           steps {
              sh '''
                  echo "Finding the pod name in project-dev namespace..."
                  kubectl get pods -n project-dev -o wide

                POD_NAME=$(kubectl get pods -n project-dev -l app=project-node-app -o jsonpath="{.items[0].metadata.name}")

               if [ -z "$POD_NAME" ]; then
                   echo "Error: No pods found with label app=project-node-app in project-dev namespace"
                   exit 1
               fi

                   echo "Pod found: $POD_NAME"
                   echo "Executing curl inside the pod..."
                   kubectl exec -n project-dev $POD_NAME -- curl -s http://localhost:8080/index.html
               '''
            }
        }


        stage('Clean Up K3s Resources') {
            steps {
                sh '''
                    echo "Cleaning up Kubernetes resources..."
                    kubectl delete -f complex-hpa.yaml || true
                    kubectl delete deployment --all || true
                    kubectl delete service --all || true
                '''
            }
        }
    }
}
