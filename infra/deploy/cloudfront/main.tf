module "cloudfront" {
  source = "git::https://github.com/Niko4417/Terraform.git//modules/deployment/cloudfront?ref=main"

  s3_bucket_name         = var.s3_bucket_name
  s3_bucket_domain_name  = var.s3_bucket_domain_name
  cloudfront_oai_id      = var.cloudfront_oai_id
  tags                   = var.tags
}