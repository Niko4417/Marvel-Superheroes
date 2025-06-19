provider "aws" {
  region = var.region
}

module "website" {
  source = "git::https://github.com/Niko4417/Terraform.git//modules/deployment/s3?ref=main"

  bucket_name = var.bucket_name
  tags        = var.tags
  index_doc   = var.index_doc
  error_doc   = var.error_doc
}