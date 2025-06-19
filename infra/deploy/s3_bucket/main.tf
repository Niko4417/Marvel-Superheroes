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

output "website_url" {
  value = module.website.bucket_website_url
}

output "s3_domain" {
  value = module.website.bucket_domain_name
}

output "s3_bucket_name" {
  value = module.website.bucket_name
}