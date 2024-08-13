pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'e23de3a3-5d77-48ef-a7ba-2edd6cb1f5a6'  // Replace with your actual credentials ID
        DOCKER_REGISTRY = 'https://index.docker.io/v1/'
        FRONTEND_IMAGE = 'anjali2454/frontend:latest'
        BACKEND_IMAGE = 'anjali2454/backend:latest'
        FRONTEND_PORT = '80'
        BACKEND_PORT = '3000'
    }

    stages {
        stage('Build Frontend Image') {
            steps {
                script {
                    docker.build(FRONTEND_IMAGE, './frontend')
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    docker.build(BACKEND_IMAGE, './backend')
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    docker.withRegistry(DOCKER_REGISTRY, DOCKER_CREDENTIALS_ID) {
                        // Jenkins will use the credentials with this ID for authentication
                    }
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                script {
                    docker.withRegistry(DOCKER_REGISTRY, DOCKER_CREDENTIALS_ID) {
                        def frontendImage = docker.image(FRONTEND_IMAGE)
                        def backendImage = docker.image(BACKEND_IMAGE)
                        
                        frontendImage.push('latest')
                        backendImage.push('latest')
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Pull the images from Docker Hub
                    sh "docker pull ${FRONTEND_IMAGE}"
                    sh "docker pull ${BACKEND_IMAGE}"
                    
                    // Stop and remove old containers if needed
                    sh """
                    if [ \$(docker ps -q -f "name=frontend-container") ]; then
                        docker stop frontend-container
                        docker rm frontend-container
                    fi
                    if [ \$(docker ps -q -f "name=backend-container") ]; then
                        docker stop backend-container
                        docker rm backend-container
                    fi
                    """
                    
                    // Run new containers
                    sh "docker run -d --name frontend-container -p ${FRONTEND_PORT}:${FRONTEND_PORT} ${FRONTEND_IMAGE}"
                    sh "docker run -d --name backend-container -p ${BACKEND_PORT}:${BACKEND_PORT} ${BACKEND_IMAGE}"
                }
            }
        }
    }
}

