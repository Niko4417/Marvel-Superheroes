variable "region" {
  description = "AWS region"
  type        = string
}

variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "tags" {
  description = "Tags for AWS resources"
  type        = map(string)
  default     = {}
}

variable "index_doc" {
  description = "Name of the index document"
  type        = string
  default     = "index.html"
}

variable "error_doc" {
  description = "Name of the error document"
  type        = string
  default     = "error.html"
}