
# Creating MongoDB Atlas database

You can use a free database account on MongoDB Atlas cloud, setting users and whitelist ip address. Atlas provide you a cluster database as service, we reccomend you select Google Cloud Iowa (us-central1).
       
Then configurate database access on env files into ~/dashboard-api/env folder. You can see env example files in the same folder.

https://www.mongodb.com

# Running localhost

Before run this module we reccomend you to run monitoring-api module first.

After have a mongo database and a rabbitmq service you can finally run this module on localhost. Make sure you have configure all settings on localhost.env file into ~/dashboard-api/env folder. You can see env example files in the same folder.

       npm install

       npm run dev

# Running on Google Cloud kubernetes (generate image)

1. Make sure you have configure all settings on google.env file into ~/dashboard-api/env folder. You can see env example files in the same folder.

2. You need send an image of dashboard-api module to cloud repository and set this image hash on your Kubernetes deployment, see the terraform file "dashboard-deployment.tf" into ~/resources/google-cloud path.

3. Setup your image repository on Google Cloud project once:

Reference: https://cloud.google.com/artifact-registry/docs/docker/pushing-and-pulling

    gcloud auth configure-docker us-docker.pkg.dev

2. Generating an image to send to Google Cloud. See the Dockerfile.

       npm run dist

       docker build -t auto-hive-oc/dashboard-api:1.0 .

       docker run -p 3001:3001 auto-hive-oc/dashboard-api:1.0

       docker tag auto-hive-oc/dashboard-api:1.0 us-docker.pkg.dev/[GOOGLE PROJECT ID]/dashboard-api/dashboard-api:1.0

       docker push us-docker.pkg.dev/[GOOGLE PROJECT ID]/dashboard-api/dashboard-api:1.0
