
# Running localhost

Before run this module we reccomend you to run dashboard-api module first.

Make sure you have configured all settings on .env.localhost file into ~/dashboard-web/env folder. You can see env example files in the same folder.

       npm install

       npm run dev

# Hosting on Google Cloud Storge bucket

1. Make sure you have configure all settings on .env.google file into ~/dashboard-web/env folder. You can see env example files in the same folder.

       npm run dist --mode google

2. Upload all files of ~/dashboard-web/dist folder to your dashboar-web-bucket created on Google Cloud. See the terraform file "dashboard-web-bucket.tf" into ~/resources/google-cloud path.
