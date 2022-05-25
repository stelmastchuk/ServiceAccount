def utils

pipeline {
    agent any
    stages{
        stage('Load Scripts'){
          steps{
              script{
                utils = load "./scripts/utils.groovy"
              }
          }
        }
        stage('Setting pipeline'){
          steps{
              script {
                utils.dockerBuild()
              }
          }
        }
        stage('Validade Project'){
          steps{
              script {
                utils.dockerRun("yarn install");
              }
          }
        }
        stage('Deploy Lambda'){
            steps{
              script{
                utils.deployLambda()
              }
            }
        }
    }
}