
resource "google_compute_router" "auto-hive-oc-nat-gateway-router" {
  project    = google_project.auto-hive-oc-project.project_id
  network    = data.google_compute_network.auto-hive-oc-default-network.name
  name       = "auto-hive-oc-nat-gateway-router"
  region     = "us-west4"
  depends_on = [data.google_compute_network.auto-hive-oc-default-network]
}

resource "google_compute_address" "auto-hive-oc-nat-gateway-ip" {
  project      = google_project.auto-hive-oc-project.project_id
  name         = "auto-hive-oc-nat-gateway-ip"
  address_type = "EXTERNAL"
  region       = "us-west4"
  network_tier = "STANDARD"
  ip_version   = "IPV4"
  depends_on   = [google_project.auto-hive-oc-project]
}

resource "google_compute_router_nat" "auto-hive-oc-nat-gateway" {
  project                            = google_project.auto-hive-oc-project.project_id
  name                               = "auto-hive-oc-nat-gateway"
  router                             = google_compute_router.auto-hive-oc-nat-gateway-router.name
  region                             = "us-west4"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
  nat_ip_allocate_option             = "MANUAL_ONLY"
  nat_ips                            = [google_compute_address.auto-hive-oc-nat-gateway-ip.self_link]
  depends_on = [
    google_compute_router.auto-hive-oc-nat-gateway-router,
    google_compute_address.auto-hive-oc-nat-gateway-ip
  ]
}
