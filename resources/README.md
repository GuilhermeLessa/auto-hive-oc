
# Installing Google Cloud CLI

1. install gcloud cli

2. login on google account through cli

3. init project through cli and garante access

Reference: https://cloud.google.com/sdk/docs/install

# Installing Terraform CLI

4. install terraform cli 

5. set project id and review all .tf files into ~/resources/google-cloud path

6. init and apply project

Reference: 

https://developer.hashicorp.com/terraform/install

https://developer.hashicorp.com/terraform/cli

https://developer.hashicorp.com/terraform/tutorials/gcp-get-started

# Managing cluster

7. You can customize or fix anything consulting docs

https://registry.terraform.io/providers/hashicorp/google/5.15.0/docs

https://registry.terraform.io/providers/hashicorp/google/5.15.0/docs/guides/getting_started

# Kubernetes credentials setup on Gcloud

    gcloud container clusters get-credentials auto-hive-oc-cluster --zone=us-west4

# Kubernetes commands

    kubectl top pods

    kubectl top nodes

    kubectl describe pod [ID]

    kubectl logs [ID]

    kubectl rollout restart deployment

    kubectl rollout restart deployment monitoring-deployment

    kubectl rollout restart deployment dashboard-deployment

    kubectl get pods

    kubectl get nodes

    kubectl get svc
