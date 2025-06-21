pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('raz_docker')
        K3S_NAMESPACE = 'project-devops'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: "main", url: 'https://github.com/raz-project/projectDev1.git'
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
                sh "docker run -d --name nodejs-container ${DOCKERHUB_CREDENTIALS_USR}/nodejs-app:1.0"
            }
        }

        stage('Cleanup') {
            steps {
                sh """
                    docker stop nodejs-container || true
                    docker rm nodejs-container || true
                    docker rmi ${DOCKERHUB_CREDENTIALS_USR}/nodejs-app:1.0 || true
                """
            }
        }

        stage('Docker Compose Up') {
            steps {
                sh """
                    docker compose down -v || true
                    docker compose up -d --build
                    sleep 10
                    docker compose ps
                """
            }
        }

        stage('Test HTML Response') {
            steps {
                sh 'curl -s http://localhost:8081'
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
                    kubectl get pods -n ${K3S_NAMESPACE} -o wide
                '''
            }
        }

        stage('Test index.html in Pod') {
    steps {
        sh '''
            POD_NAME=$(kubectl get pods -n ${K3S_NAMESPACE} -l app=project-node-app -o jsonpath="{.items[0].metadata.name}")
            if [ -z "$POD_NAME" ]; then
              echo "No pod found with app=project-node-app in ${K3S_NAMESPACE}"
              exit 1
            fi
            echo "Pod found: $POD_NAME"
            
            # Start port-forward in background (fix: forward to correct pod port)
            kubectl port-forward -n ${K3S_NAMESPACE} pod/$POD_NAME 8081:80 &
            PORT_FORWARD_PID=$!
            echo "Port-forward PID: $PORT_FORWARD_PID"

            sleep 5

            # Test the app
            curl -s http://localhost:8081/index.html || {
              echo "Failed to fetch index.html"
              kill $PORT_FORWARD_PID
              exit 1
            }

            # Kill port-forward process
            kill $PORT_FORWARD_PID || echo "No process found to kill"
        '''
    }
}

        

        stage('Clean Up K3s Resources') {
            steps {
                sh '''
                    echo "Cleaning up Kubernetes resources in ${K3S_NAMESPACE} namespace..."
                    kubectl delete -f complex-hpa.yaml -n ${K3S_NAMESPACE} || true
                    kubectl delete deployment --all -n ${K3S_NAMESPACE} || true
                    kubectl delete service --all -n ${K3S_NAMESPACE} || true
                '''
            }
        }
    }
}
