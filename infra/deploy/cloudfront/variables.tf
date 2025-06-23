variable "s3_bucket_name" {
  type = string
}

variable "s3_bucket_domain_name" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "cloudfront_oai_id" {
  type        = string
}