pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Code checked out by Jenkins'
            }
        }

        stage('Backend Check') {
            steps {
                dir('backend') {
                    bat 'npm ci'
                    bat 'node --check server.js'
                }
            }
        }

        stage('Frontend Build & Check') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t ods-backend-test ./backend'
                bat 'docker build -t ods-frontend-test ./frontend'
            }
        }
    }

    post {
        success {
            echo '✅ All checks passed successfully!'
        }

        failure {
            echo '❌ Build or test failed!'
        }
    }
}