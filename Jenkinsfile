pipeline {
  agent any
    
  tools {nodejs "NodeJS"}

  environment {
      CI = 'true'
      NODE_ENV = 'test'
  }
    
  stages {
        
    stage('Build: Install Project Dependencies') {
      steps {
        sh 'npm install'
      }
    }
     
    stage('Run Test') {
      steps {
         sh 'npm test'
      }
    }      
  }

  post{
      always{
          echo "** Build Completed **"
      }
      success{
          echo "Result ==> Build was successful"
      }
      failure{
          echo "Result ==> Build Failed"
      }
  }
}
