
<h1 align="center">Automatic Hive OS Overclock</h1>

<p align="center">

<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />

<img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript"  />

<img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"  />

<img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express js" />

<img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest"  />

<img src="https://img.shields.io/badge/Vue%20js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="Vue.js" />

<img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite"  />

<img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap" >

<br>

<img src="https://img.shields.io/badge/kubernetes-326ce5.svg?&style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes" />

<img src="https://img.shields.io/badge/rabbitmq-%23FF6600.svg?&style=for-the-badge&logo=rabbitmq&logoColor=white" alt="RabbitMQ"  />

<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />

<img src="https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Google Cloud"  />

<img src="https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white" alt="Terraform"  />

<img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"  />

<!--img src="" alt="ALT"  /-->

</p>

<p align="center">
    :white_check_mark: Clean Architecture
    :white_check_mark: SOLID
    :white_check_mark: Domain Driven Design
    :white_check_mark: Hexagonal Architecture (Ports and Adapters)
    :white_check_mark: Test Patterns
    <br>
    :white_check_mark: Cloud
    :white_check_mark: Availability and Scalability
    :white_check_mark: Microservice
    :white_check_mark: Messaging
    :white_check_mark: Containerization
    :white_check_mark: NoSQL
</p>

<p align="center">
    Control overclocks and temperatures due to improve financial gains on mining using Hive OS.
</p>

<p align="center">
    <a href="http://autohiveoc.com/" target="_blank">autohiveoc.com</a>
</p>

## Beta limitations

:triangular_flag_on_post: Only NVIDIA gpus.

:triangular_flag_on_post: Only absolute overclocks greater than 500.

:triangular_flag_on_post: Memory monitoring only when temperature is provided by Hive OS.

:triangular_flag_on_post: Hive OS had blocked API acess to free farm accounts.

## Environment

Of course we encourage you to run this project on localhost first, anyway it was completely deployed and tested on Google Cloud platform using a Kubernetes cluster and a PubSub queue service. You can configure your own cluster on Google Cloud using Terraform, the config files can be found on ~/resources/google-cloud path. MongoDB Atlas cloud database can be configured manually.

On ~/resources path you can also find an Insomnia import file with some endpoints to turn your tests easier. 

You can find more instructions to how setup all the project on each README file into each project module path.

You can also use our own distribution available on <a href="http://autohiveoc.com/" target="_blank">autohiveoc.com</a>.

## Dashboard web

This module is the web front-end (see the printscreen below). Through this web interface panel you are able to connect with Hive OS gpus and set theirs overclock and temperature params, then click on start button and the application will monitoring and tuning the mining by your settings. See the README file into ~/dashboard-web path.

## Dashboard api

This module is the backend rest api connected with web front-end that provide access to Hive OS api and other resources to configurate the monitoring system. See the README file into ~/dashboard-web path.

## Monitoring api

This module is the controller of queue algoritms that manage your gpus on Hive OS fine tunning overclocks and temperatures due to your settings previously provided. See the README file into ~/dashboard-api path.

## Contact

support@autohiveoc.com

gl-lessa@hotmail.com

https://www.linkedin.com/in/lessaguilherme/

<p align="center">

![Dashboard](dashboard.png)

</p>