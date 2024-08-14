pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = '3204add4-9cee-4768-a35f-7447d9b893bf'  // Replace with your actual credentials ID
        DOCKER_REGISTRY = 'https://index.docker.io/v1/'
        FRONTEND_IMAGE = 'anjali2454/frontend'
        BACKEND_IMAGE = 'anjali2454/backend'
        IMAGE_TAG = "${env.BUILD_NUMBER}"  // Tag images with the build number
        PORT_FRONTEND = '80'
        PORT_BACKEND = '3000'
    }

    stages {
        stage('Build Frontend Image') {
            steps {
                script {
                    docker.build("${FRONTEND_IMAGE}:${IMAGE_TAG}", "./frontend")
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    docker.build("${BACKEND_IMAGE}:${IMAGE_TAG}", "./backend")
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
                        def frontendImage = docker.image("${FRONTEND_IMAGE}:${IMAGE_TAG}")
                        def backendImage = docker.image("${BACKEND_IMAGE}:${IMAGE_TAG}")

                        // Push the new images with the build number tag
                        frontendImage.push("${IMAGE_TAG}")
                        backendImage.push("${IMAGE_TAG}")

                        // Also push the latest tag
                        frontendImage.tag('latest')
                        backendImage.tag('latest')
                        frontendImage.push("latest")
                        backendImage.push("latest")
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    try {
                        // Check for existing containers
                        def frontendOldContainer = sh(script: "docker ps -q --filter 'ancestor=${FRONTEND_IMAGE}:latest'", returnStdout: true).trim()
                        def backendOldContainer = sh(script: "docker ps -q --filter 'ancestor=${BACKEND_IMAGE}:latest'", returnStdout: true).trim()

                        // If old containers exist, stop and remove them, and tag the old image as version:1
                        if (frontendOldContainer) {
                            sh "docker stop ${frontendOldContainer}"
                            sh "docker rm ${frontendOldContainer}"
                            // Tag the old image as version:1 and push it
                            sh "docker tag ${FRONTEND_IMAGE}:latest ${FRONTEND_IMAGE}:version:1"
                            sh "docker push ${FRONTEND_IMAGE}:version:1"
                        }

                        if (backendOldContainer) {
                            sh "docker stop ${backendOldContainer}"
                            sh "docker rm ${backendOldContainer}"
                            // Tag the old image as version:1 and push it
                            sh "docker tag ${BACKEND_IMAGE}:latest ${BACKEND_IMAGE}:version:1"
                            sh "docker push ${BACKEND_IMAGE}:version:1"
                        }

                        // Run new containers with the new images
                        sh """
                        docker run -d -p ${PORT_FRONTEND}:${PORT_FRONTEND} ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker run -d -p ${PORT_BACKEND}:${PORT_BACKEND} ${BACKEND_IMAGE}:${IMAGE_TAG}
                        """
                    } catch (Exception e) {
                        error "Deployment failed: ${e.getMessage()}"
                    }
                }
            }
        }
    }
}
