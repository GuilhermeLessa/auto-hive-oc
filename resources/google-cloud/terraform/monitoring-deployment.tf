/*
resource "kubernetes_namespace" "auto-hive-oc-monitoring-namespace" {
  metadata {
    name = "auto-hive-oc-monitoring-namespace"
  }
  depends_on = [
    google_project_service.auto-hive-oc-kubernetes
  ]
}*/

resource "google_artifact_registry_repository" "monitoring-api-repository" {
  project                = google_project.auto-hive-oc-project.project_id
  location               = "us"
  repository_id          = "monitoring-api"
  format                 = "DOCKER"
  mode                   = "STANDARD_REPOSITORY"
  cleanup_policy_dry_run = true
  depends_on             = [google_project.auto-hive-oc-project]
}

resource "kubernetes_deployment" "monitoring-deployment" {
  metadata {
    name = "monitoring-deployment"
    labels = {
      deployment = "monitoring-deployment"
    }
  }
  spec {
    replicas = 2
    selector {
      match_labels = {
        deployment = "monitoring-deployment"
      }
    }
    template {
      metadata {
        labels = {
          deployment = "monitoring-deployment"
        }
      }
      spec {
        container {
          name  = "monitoring-api"
          image = "us-docker.pkg.dev/[GOOGLE PROJECT ID]/monitoring-api/monitoring-api@sha256:51a589d94c5ac65398d428fddb6066e19388ae356371acce1d7fce0a9c51a0ad"
          port {
            container_port = 3001
          }
          resources {
            requests = {
              cpu    = "150m"
              memory = "150Mi"
            }
            limits = {
              cpu    = "700m"
              memory = "712Mi"
            }
          }
        }
      }
    }
  }
  depends_on = [
    google_artifact_registry_repository.monitoring-api-repository,
    google_container_cluster.auto-hive-oc-cluster,
    google_container_node_pool.auto-hive-oc-node-pool,
    google_pubsub_topic.oc-start-topic,
    google_pubsub_subscription.oc-start-subscription,
    google_pubsub_topic.oc-check-topic,
    google_pubsub_subscription.oc-check-subscription,
  ]
}

resource "kubernetes_service" "monitoring-deployment-cluster-ip" {
  metadata {
    name = "monitoring-deployment-cluster-ip"
  }
  spec {
    type = "ClusterIP"
    selector = {
      deployment = "monitoring-deployment"
    }
    port {
      port        = 3001
      target_port = 3001
    }
  }
  depends_on = [
    kubernetes_deployment.monitoring-deployment
  ]
}

resource "kubernetes_service" "monitoring-deployment-load-balancer" {
  metadata {
    name = "monitoring-deployment-load-balancer"
  }
  spec {
    type = "LoadBalancer"
    selector = {
      deployment = "monitoring-deployment"
    }
    port {
      port        = 3001
      target_port = 3001
      node_port   = 30001
    }
  }
  depends_on = [
    kubernetes_deployment.monitoring-deployment
  ]
}
