pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
    DOCKERHUB_USERNAME    = 'dharshan14'
    IMAGE_BACKEND         = "${DOCKERHUB_USERNAME}/smartflow-backend"
    IMAGE_FRONTEND        = "${DOCKERHUB_USERNAME}/smartflow-frontend"
    IMAGE_TAG             = "${BUILD_NUMBER}"
  }

  options {
    timeout(time: 30, unit: 'MINUTES')
    disableConcurrentBuilds()
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        echo "Code checked out – Branch: ${GIT_BRANCH}"
      }
    }

    stage('Install Dependencies') {
      parallel {
        stage('Backend Deps') {
          steps {
            dir('server') {
              sh 'npm ci'
              echo 'Backend dependencies installed'
            }
          }
        }
        stage('Frontend Deps') {
          steps {
            dir('client') {
              sh 'npm ci'
              echo 'Frontend dependencies installed'
            }
          }
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('client') {
          sh 'npm run build'
          echo 'React frontend built'
        }
      }
    }

    stage('Docker Login') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
        echo 'Logged in to Docker Hub'
      }
    }

    stage('Build Docker Images') {
      parallel {
        stage('Build Backend Image') {
          steps {
            sh "docker build -t ${IMAGE_BACKEND}:${IMAGE_TAG} -t ${IMAGE_BACKEND}:latest ./server"
            echo 'Backend image built'
          }
        }
        stage('Build Frontend Image') {
          steps {
            sh "docker build -t ${IMAGE_FRONTEND}:${IMAGE_TAG} -t ${IMAGE_FRONTEND}:latest ./client"
            echo 'Frontend image built'
          }
        }
      }
    }

    stage('Push to Docker Hub') {
      parallel {
        stage('Push Backend') {
          steps {
            sh "docker push ${IMAGE_BACKEND}:${IMAGE_TAG}"
            sh "docker push ${IMAGE_BACKEND}:latest"
            echo 'Backend image pushed'
          }
        }
        stage('Push Frontend') {
          steps {
            sh "docker push ${IMAGE_FRONTEND}:${IMAGE_TAG}"
            sh "docker push ${IMAGE_FRONTEND}:latest"
            echo 'Frontend image pushed'
          }
        }
      }
    }

    stage('Deploy') {
      when { branch 'main' }
      steps {
        sh 'docker-compose down --remove-orphans || true'
        sh "IMAGE_TAG=${IMAGE_TAG} docker-compose up -d --build"
        echo 'Deployment complete'
      }
    }
  }

  post {
    always  { sh 'docker logout || true' }
    success { echo "SmartFlow ${IMAGE_TAG} deployed successfully" }
    failure { echo 'Pipeline FAILED – check logs' }
    cleanup { sh 'docker system prune -f || true' }
  }
}
