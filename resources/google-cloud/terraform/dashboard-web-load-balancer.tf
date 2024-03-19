
resource "google_compute_url_map" "dashboard-web-load-balancer" {
  project         = google_project.auto-hive-oc-project.project_id
  name            = "dashboard-web-load-balancer"
  default_service = google_compute_backend_bucket.dashboard-web-bucket-backend.id
  depends_on = [
    google_compute_backend_bucket.dashboard-web-bucket-backend,
  ]
}

resource "google_compute_global_address" "dashboard-web-load-balancer-ip" {
  project      = google_project.auto-hive-oc-project.project_id
  name         = "dashboard-web-load-balancer-ip"
  address_type = "EXTERNAL"
  ip_version   = "IPV4"
  depends_on = [
    google_project.auto-hive-oc-project,
    kubernetes_deployment.dashboard-deployment
  ]
}

resource "google_compute_target_http_proxy" "dashboard-web-load-balancer-target" {
  project = google_project.auto-hive-oc-project.project_id
  name    = "dashboard-web-load-balancer-target"
  url_map = google_compute_url_map.dashboard-web-load-balancer.id
  depends_on = [
    google_compute_url_map.dashboard-web-load-balancer,
  ]
}

resource "google_compute_global_forwarding_rule" "dashboard-web-load-balancer-frontend" {
  project               = google_project.auto-hive-oc-project.project_id
  name                  = "dashboard-web-load-balancer-frontend"
  ip_address            = google_compute_global_address.dashboard-web-load-balancer-ip.id
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  port_range            = 80
  target                = google_compute_target_http_proxy.dashboard-web-load-balancer-target.id
  depends_on = [
    google_compute_global_address.dashboard-web-load-balancer-ip,
    google_compute_target_http_proxy.dashboard-web-load-balancer-target,
  ]
}

resource "google_dns_managed_zone" "dashboard-web-dns" {
  project    = google_project.auto-hive-oc-project.project_id
  name       = "dashboard-web-zone"
  dns_name   = "autohiveoc.com."
  visibility = "public"
  dnssec_config {
    state = "off"
  }
  depends_on = [
    google_compute_global_address.dashboard-web-load-balancer-ip,
  ]
}

resource "google_dns_record_set" "dashboard-web-dns-record-A" {
  project      = google_project.auto-hive-oc-project.project_id
  managed_zone = google_dns_managed_zone.dashboard-web-dns.name
  name         = "autohiveoc.com."
  type         = "A"
  ttl          = 300
  rrdatas      = [google_compute_global_address.dashboard-web-load-balancer-ip.address]
  depends_on = [
    google_dns_managed_zone.dashboard-web-dns,
  ]
}

resource "google_dns_record_set" "dashboard-web-dns-record-CNAME" {
  project      = google_project.auto-hive-oc-project.project_id
  managed_zone = google_dns_managed_zone.dashboard-web-dns.name
  name         = "www.autohiveoc.com."
  type         = "CNAME"
  ttl          = 300
  rrdatas      = ["autohiveoc.com."]
  depends_on = [
    google_dns_record_set.dashboard-web-dns-record-A,
  ]
}
