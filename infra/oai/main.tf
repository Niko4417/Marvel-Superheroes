resource "aws_cloudfront_origin_access_identity" "default" {
  comment = "Shared OAI for CloudFront and S3 access"
}