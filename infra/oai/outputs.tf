output "cloudfront_oai_id" {
  value = aws_cloudfront_origin_access_identity.default.id
}