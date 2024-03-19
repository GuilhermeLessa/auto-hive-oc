/*
resource "kubernetes_namespace" "auto-hive-oc-dashboard-namespace" {
  metadata {
    name = "auto-hive-oc-dashboard-namespace"
  }
  depends_on = [
    google_project_service.auto-hive-oc-kubernetes
  ]
}*/

resource "google_artifact_registry_repository" "dashboard-api-repository" {
  project                = google_project.auto-hive-oc-project.project_id
  location               = "us"
  repository_id          = "dashboard-api"
  format                 = "DOCKER"
  mode                   = "STANDARD_REPOSITORY"
  cleanup_policy_dry_run = true
  depends_on             = [google_project.auto-hive-oc-project]
}

resource "kubernetes_deployment" "dashboard-deployment" {
  metadata {
    name = "dashboard-deployment"
    labels = {
      deployment = "dashboard-deployment"
    }
  }
  spec {
    replicas = 2
    selector {
      match_labels = {
        deployment = "dashboard-deployment"
      }
    }
    template {
      metadata {
        labels = {
          deployment = "dashboard-deployment"
        }
      }
      spec {
        container {
          name  = "dashboard-api"
          image = "us-docker.pkg.dev/[GOOGLE PROJECT ID]/dashboard-api/dashboard-api@sha256:e459cc34599b694f455afadb1297b7670d097f05a44af105d79e9f65c92faaeb"
          port {
            container_port = 3000
          }
          resources {
            requests = {
              cpu    = "100m"
              memory = "100Mi"
            }
            limits = {
              cpu    = "500m"
              memory = "512Mi"
            }
          }
        }
      }
    }
  }
  depends_on = [
    google_artifact_registry_repository.dashboard-api-repository,
    google_container_cluster.auto-hive-oc-cluster,
    google_container_node_pool.auto-hive-oc-node-pool,
    kubernetes_deployment.monitoring-deployment,
  ]
}

resource "kubernetes_service" "dashboard-deployment-load-balancer" {
  metadata {
    name = "dashboard-deployment-load-balancer"
  }
  spec {
    type = "LoadBalancer"
    selector = {
      deployment = "dashboard-deployment"
    }
    port {
      port        = 3000
      target_port = 3000
      node_port   = 30000
    }
  }
  depends_on = [
    kubernetes_deployment.dashboard-deployment
  ]
}