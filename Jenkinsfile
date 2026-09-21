pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out FSD project...'
                checkout scm
            }
        }

        stage('Check Node') {
            steps {
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Backend Install') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }
    }

    post {

        success {
            echo 'FSD PROJECT BUILD SUCCESSFUL'
        }

        failure {
            echo 'FSD PROJECT BUILD FAILED'
        }
    }
}