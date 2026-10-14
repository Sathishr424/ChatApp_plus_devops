To use this pipeline on you jenkins machine configure the following credentials:
1. github_username_token -> Add your github token with your username here
2. docker_secret -> Add your docker login details as a username with password type credentials
3. ssh_chatapp_deploy_machine -> And your machine ssh credentials, this is the machine the Jenkins will deploy the app into


Also note that your deploy machine should have docker installed and the user you have configured in the ssh should be in the docker group
