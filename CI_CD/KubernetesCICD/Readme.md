To use this pipeline on you jenkins machine configure the following credentials:
1. github_username_token -> Add your github token with your username here
2. docker_secret -> Add your docker login details as a username with password type credentials
3. ssh_chatapp_kube_master -> And your machine ssh credentials, this is the machine the Jenkins will deploy the app into

Since this is a kubernetes based on deployment you should have kubernetes configured on your deploy machine, the ip you provide the jenkins file is the ip of the control machine.
You can use terraform script to create the kubernetes master machine and 2 worker nodes. Then provide the master machine ip in the jenkins file

