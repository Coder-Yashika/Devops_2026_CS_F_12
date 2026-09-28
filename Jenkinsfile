pipeline {

    agent any

    stages {

        /*
         * Jenkins automatically performs the SCM checkout
         * because this is "Pipeline script from SCM".
         * Therefore, no separate checkout stage is needed.
         */

        stage('Check Trigger Commit') {
            steps {
                script {

                    def commitMessage = bat(
                        script: 'git log -1 --pretty=%%B',
                        returnStdout: true
                    ).trim()

                    echo "Latest dynamic jenkins commit message:"
                    echo commitMessage

                    if (commitMessage.contains('[skip ci]')) {

                        echo '========================================'
                        echo 'JENKINS FEEDBACK COMMIT DETECTED'
                        echo 'Skipping CI build to prevent build loop.'
                        echo '========================================'

                        env.SKIP_CI = 'true'

                    } else {

                        env.SKIP_CI = 'false'
                    }
                }
            }
        }


        stage('Environment Check') {
            when {
                expression {
                    env.SKIP_CI != 'true'
                }
            }

            steps {
                bat 'node --version'
                bat 'npm --version'
            }
        }


        stage('Backend Install') {
            when {
                expression {
                    env.SKIP_CI != 'true'
                }
            }

            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }


        stage('Frontend Install') {
            when {
                expression {
                    env.SKIP_CI != 'true'
                }
            }

            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }


        stage('Frontend Build') {
            when {
                expression {
                    env.SKIP_CI != 'true'
                }
            }

            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }


        stage('Generate Feedback') {
            when {
                expression {
                    env.SKIP_CI != 'true'
                }
            }

            steps {

                script {

                    // Get repository URL automatically
                    def repoUrl = bat(
                        script: 'git config --get remote.origin.url',
                        returnStdout: true
                    ).trim()

                    // Remove .git from repository name
                    def repository = repoUrl
                        .replace('.git', '')

                    // Get Node.js version
                    def nodeVersion = bat(
                        script: 'node --version',
                        returnStdout: true
                    ).trim()

                    // Get npm version
                    def npmVersion = bat(
                        script: 'npm --version',
                        returnStdout: true
                    ).trim()

                    // Get short commit ID
                    def commitId = bat(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()

                    // Get commit message
                    def commitMessage = bat(
                        script: 'git log -1 --pretty=%%B',
                        returnStdout: true
                    ).trim()

                    // Build date and time
                    def buildDate = new Date().format(
                        'dd-MM-yyyy HH:mm:ss'
                    )

                    def feedback = """
========================================
       FSD PROJECT CI/CD FEEDBACK
========================================

Project:
College ODS Full Stack Project

Repository:
${repository}

Jenkins Build Number:
${env.BUILD_NUMBER}

Git Branch:
${env.BRANCH_NAME ?: 'main'}

Git Commit:
${commitId}

Commit Message:
${commitMessage}

Build Date:
${buildDate}

Build URL:
${env.BUILD_URL}

----------------------------------------
ENVIRONMENT
----------------------------------------

Node.js:
${nodeVersion}

npm:
${npmVersion}

----------------------------------------
PIPELINE STAGES
----------------------------------------

✓ GitHub Repository Checkout
✓ Node.js Environment Check
✓ Backend npm install
✓ Frontend npm install
✓ Frontend Production Build
✓ Dynamic Feedback Generation

----------------------------------------
OVERALL STATUS
----------------------------------------

BUILD COMPLETED SUCCESSFULLY

----------------------------------------
CI/CD INFORMATION
----------------------------------------

Feedback generated automatically
by Jenkins CI/CD pipeline.

========================================
          Generated by Jenkins
========================================
"""

                    writeFile(
                        file: 'feedback.txt',
                        text: feedback
                    )

                    echo 'feedback.txt generated successfully.'
                }
            }
        }


        stage('Check Feedback') {
            when {
                expression {
                    env.SKIP_CI != 'true'
                }
            }

            steps {
                bat 'type feedback.txt'
            }
        }


        stage('Push Feedback to GitHub') {
            when {
                expression {
                    env.SKIP_CI != 'true'
                }
            }

            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-push',
                        usernameVariable: 'GIT_USERNAME',
                        passwordVariable: 'GIT_TOKEN'
                    )
                ]) {

                    bat '''
                        git config user.name "Jenkins"
                        git config user.email "jenkins@localhost"

                        echo Adding feedback.txt...

                        git add feedback.txt

                        git diff --cached --quiet || git commit -m "Add Jenkins feedback [skip ci]"

                        echo Pushing feedback.txt to GitHub...

                        git push https://%GIT_USERNAME%:%GIT_TOKEN%@github.com/Coder-Yashika/Devops_2026_CS_F_12.git HEAD:main
                    '''
                }
            }
        }
    }


    post {

        always {

            archiveArtifacts(
                artifacts: 'feedback.txt',
                allowEmptyArchive: true
            )

            echo 'Feedback file processing completed.'
        }


        success {

            echo '===================================='
            echo 'FSD PIPELINE SUCCESSFUL'
            echo '===================================='
        }


        failure {

            echo '===================================='
            echo 'FSD PIPELINE FAILED'
            echo '===================================='
        }
    }
}