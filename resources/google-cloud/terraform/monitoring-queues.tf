
resource "google_pubsub_topic" "oc-start-topic" {
  project = google_project.auto-hive-oc-project.project_id
  name    = "oc-start-topic"
  depends_on = [
    google_project.auto-hive-oc-project,
    google_project_service.auto-hive-oc-pubsub
  ]
}

resource "google_pubsub_subscription" "oc-start-subscription" {
  project = google_project.auto-hive-oc-project.project_id
  name    = "oc-start-subscription"
  topic   = google_pubsub_topic.oc-start-topic.id
  expiration_policy {
    ttl = "" //never
  }
  message_retention_duration   = "604800s" //7 days
  enable_exactly_once_delivery = true
  ack_deadline_seconds         = 60
  depends_on = [google_pubsub_topic.oc-start-topic]
}

resource "google_pubsub_topic" "oc-check-topic" {
  project = google_project.auto-hive-oc-project.project_id
  name    = "oc-check-topic"
  depends_on = [
    google_project.auto-hive-oc-project,
    google_project_service.auto-hive-oc-pubsub
  ]
}

resource "google_pubsub_subscription" "oc-check-subscription" {
  project = google_project.auto-hive-oc-project.project_id
  name    = "oc-check-subscription"
  topic   = google_pubsub_topic.oc-check-topic.id
  expiration_policy {
    ttl = "" //never
  }
  message_retention_duration   = "604800s" //7 days
  enable_exactly_once_delivery = true
  ack_deadline_seconds         = 60
  depends_on = [google_pubsub_topic.oc-check-topic]
}
