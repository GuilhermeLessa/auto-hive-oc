
resource "google_container_cluster" "auto-hive-oc-cluster" {
  project                  = google_project.auto-hive-oc-project.project_id
  name                     = "auto-hive-oc-cluster"
  location                 = "us-west4"
  node_locations           = ["us-west4-b", "us-west4-c"]
  remove_default_node_pool = true
  initial_node_count       = 1
  deletion_protection      = false
  network                  = data.google_compute_network.auto-hive-oc-default-network.name
  release_channel {
    channel = "STABLE"
  }
  cluster_autoscaling {
    autoscaling_profile = "OPTIMIZE_UTILIZATION"
  }
  private_cluster_config {
    enable_private_nodes   = true
    master_ipv4_cidr_block = "172.16.0.0/28"
  }
  logging_config {
    enable_components = []
  }
  monitoring_config {
    enable_components = ["SYSTEM_COMPONENTS"]
    managed_prometheus {
      enabled = false
    }
  }
  addons_config {
    gce_persistent_disk_csi_driver_config {
      enabled = false
    }
  }
  depends_on = [
    google_project.auto-hive-oc-project,
    google_project_service.auto-hive-oc-kubernetes,
    data.google_compute_network.auto-hive-oc-default-network
  ]
}

resource "google_container_node_pool" "auto-hive-oc-node-pool" {
  project            = google_project.auto-hive-oc-project.project_id
  cluster            = google_container_cluster.auto-hive-oc-cluster.name
  name               = "auto-hive-oc-node-pool"
  location           = "us-west4"
  node_locations     = ["us-west4-b", "us-west4-c"]
  initial_node_count = 1
  max_pods_per_node  = 256
  autoscaling {
    total_min_node_count = 2
    total_max_node_count = 6
  }
  node_config {
    preemptible  = false
    spot         = true
    machine_type = "e2-medium"
    disk_type    = "pd-standard"
    disk_size_gb = 20
    oauth_scopes = [
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/trace.append",
      "https://www.googleapis.com/auth/pubsub"
    ]
  }
  depends_on = [
    google_container_cluster.auto-hive-oc-cluster,
    google_service_account.auto-hive-oc-account-service
  ]
}

data "google_container_cluster" "auto-hive-oc-cluster" {
  project  = google_project.auto-hive-oc-project.project_id
  name     = "auto-hive-oc-cluster"
  location = "us-west4"
  depends_on = [
    google_container_cluster.auto-hive-oc-cluster
  ]
}

provider "kubernetes" {
  host  = "https://${data.google_container_cluster.auto-hive-oc-cluster.endpoint}"
  token = data.google_client_config.google-client-config.access_token
  cluster_ca_certificate = base64decode(
    data.google_container_cluster.auto-hive-oc-cluster.master_auth[0].cluster_ca_certificate,
  )
}
