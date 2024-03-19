
resource "google_storage_bucket" "dashboard-web-bucket" {
  project  = google_project.auto-hive-oc-project.project_id
  name     = "dashboard-web-bucket"
  location = "US"
  rpo      = "ASYNC_TURBO"
  custom_placement_config {
    data_locations = ["US-EAST4", "US-WEST4"]
  }
  force_destroy               = true
  storage_class               = "STANDARD"
  uniform_bucket_level_access = false
  public_access_prevention    = "inherited"
  website {
    main_page_suffix = "index.html"
    //not_found_page = "404.html"
  }
  cors {
    origin          = ["http://autohiveoc.com", "http://www.autohiveoc.com"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
  depends_on = [
    kubernetes_deployment.dashboard-deployment
  ]
}

resource "google_storage_bucket_access_control" "dashboard-web-bucket-access" {
  bucket = google_storage_bucket.dashboard-web-bucket.name
  entity = "allUsers"
  role   = "READER"
  depends_on = [
    google_storage_bucket.dashboard-web-bucket,
  ]
}

resource "google_storage_default_object_access_control" "dashboard-web-bucket-file-access" {
  bucket = google_storage_bucket.dashboard-web-bucket.name
  entity = "allUsers"
  role   = "READER"
  depends_on = [
    google_storage_bucket.dashboard-web-bucket,
  ]
}

resource "google_compute_backend_bucket" "dashboard-web-bucket-backend" {
  project     = google_project.auto-hive-oc-project.project_id
  name        = "dashboard-web-bucket-backend"
  bucket_name = google_storage_bucket.dashboard-web-bucket.name
  enable_cdn  = false
  depends_on = [
    google_storage_bucket.dashboard-web-bucket,
    google_storage_bucket_access_control.dashboard-web-bucket-access,
    google_storage_default_object_access_control.dashboard-web-bucket-file-access
  ]
}
