def dockerBuild(){
  bat "docker build -t digitalbank:pipeline -f ./Dockerfile ./"
}

def dockerRun(String script){
  bat """docker run --net devops --rm -v ${pwd()}:/app digitalbank:pipeline /bin/bash -c "$script" """
}

def deployLambda(){
  dockerRun("yarn global add serverless && \
            serverless config credentials --provider aws --key AKIAXX42ADRROSCS2KAE --secret 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 && \
            yarn deploy --stage dev")
}

return this