# What's this?
This is a basic and tiny application to be hosted in an EKS (Blueprints) Cluster. It can test read and write access to a specific S3 bucket in your AWS account. This was originally made to test a k8s pod's access to an AWS S3 Bucket made using the ACK S3 Controller. The response gives the necessary documentation in custom JSON fields.

Particularly useful to test AWS IRSA or AWS Pod Identities.

# Default: env vars
- Default `PORT` is `4000`
- Default `BUCKET_REGION` is `us-east-1`
- Default `BUCKET_NAME` is `non-existent-bucket-gd52q`

# Docker
```
docker pull jonvdb/s3-ack-demo:latest
```