# What's this?
This is a basic and tiny application to be hosted in an EKS (Blueprints) Cluster paired with an AWS ACK S3 Bucket. The container image can be used to test read and write access from the k8s container to the S3 bucket. The response gives the necessary documentation in custom JSON fields.

# Default: env vars
- Default `PORT` is `4000`
- Default `BUCKET_REGION` is `us-east-1`
- Default `BUCKET_NAME` is `non-existent-bucket-gd52q`

# Docker
```
docker pull jonvdb/s3-ack-demo:latest
```

