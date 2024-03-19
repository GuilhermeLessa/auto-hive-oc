terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.15.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.25.2"
    }
  }
}

data "google_client_config" "google-client-config" {}

data "google_billing_account" "my-billing-account" {
  display_name = "My Billing Account"
  open         = true
}

resource "google_project" "auto-hive-oc-project" {
  name            = "auto-hive-oc"
  project_id      = "[GOOGLE PROJECT ID]"
  billing_account = data.google_billing_account.my-billing-account.id
  depends_on      = [data.google_billing_account.my-billing-account]
}

data "google_compute_network" "auto-hive-oc-default-network" {
  project    = google_project.auto-hive-oc-project.project_id
  name       = "default"
  depends_on = [google_project.auto-hive-oc-project]
}

resource "google_project_service" "auto-hive-oc-kubernetes" {
  project    = google_project.auto-hive-oc-project.project_id
  service    = "container.googleapis.com"
  depends_on = [google_project.auto-hive-oc-project]
}

resource "google_project_service" "auto-hive-oc-container-security" {
  project    = google_project.auto-hive-oc-project.project_id
  service    = "containersecurity.googleapis.com"
  depends_on = [google_project.auto-hive-oc-project]
}

resource "google_project_service" "auto-hive-oc-pubsub" {
  project    = google_project.auto-hive-oc-project.project_id
  service    = "pubsub.googleapis.com"
  depends_on = [google_project.auto-hive-oc-project]
}

resource "google_project_service" "auto-hive-oc-artifact-registry" {
  project    = google_project.auto-hive-oc-project.project_id
  service    = "artifactregistry.googleapis.com"
  depends_on = [google_project.auto-hive-oc-project]
}

resource "google_project_service" "auto-hive-oc-compute-engine" {
  project    = google_project.auto-hive-oc-project.project_id
  service    = "compute.googleapis.com"
  depends_on = [google_project.auto-hive-oc-project]
}

resource "google_project_service" "auto-hive-oc-cloud-monitoring" {
  project    = google_project.auto-hive-oc-project.project_id
  service    = "monitoring.googleapis.com"
  depends_on = [google_project.auto-hive-oc-project]
}

resource "google_project_service" "auto-hive-oc-cloud-autoscaling" {
  project    = google_project.auto-hive-oc-project.project_id
  service    = "autoscaling.googleapis.com"
  depends_on = [google_project.auto-hive-oc-project]
}

/*
resource "google_service_account" "auto-hive-oc-account-service" {
  project    = google_project.auto-hive-oc-project.project_id
  account_id = "auto-hive-oc-account-service"
  depends_on = [google_project.auto-hive-oc-project]
}*/

/*
data "google_compute_subnetwork" "auto-hive-oc-default-subnetwork" {
  project    = google_project.auto-hive-oc-project.project_id
  name       = "default"
  region     = "us-west4"
  depends_on = [data.google_compute_network.auto-hive-oc-default-network]
}*/
