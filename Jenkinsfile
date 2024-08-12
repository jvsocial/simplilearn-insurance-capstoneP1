pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'd546beee-7ee5-48a8-9cee-cf7333769ffa'  // Replace with your actual credentials ID
        DOCKER_REGISTRY = 'https://index.docker.io/v1/'
        FRONTEND_IMAGE = 'anjali2454/frontend:latest'
        BACKEND_IMAGE = 'anjali2454/backend:latest'
    }

    stages {
        stage('Build Frontend Image') {
            steps {
                script {
                    docker.build(FRONTEND_IMAGE, "./frontend")
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    docker.build(BACKEND_IMAGE, "./backend")
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
                    sh 'docker pull ${FRONTEND_IMAGE}'
                    sh 'docker pull ${BACKEND_IMAGE}'
                    
                    // Stop and remove old containers if needed
                    sh 'docker ps -q --filter "ancestor=${FRONTEND_IMAGE}" | xargs --no-run-if-empty docker stop'
                    sh 'docker ps -q --filter "ancestor=${BACKEND_IMAGE}" | xargs --no-run-if-empty docker stop'
                    sh 'docker ps -aq --filter "ancestor=${FRONTEND_IMAGE}" | xargs --no-run-if-empty docker rm'
                    sh 'docker ps -aq --filter "ancestor=${BACKEND_IMAGE}" | xargs --no-run-if-empty docker rm'

                    // Run new containers
                    sh 'docker run -d -p 80:80 ${FRONTEND_IMAGE}'
                    sh 'docker run -d -p 3000:3000 ${BACKEND_IMAGE}'
                }
            }
        }
    }
}
