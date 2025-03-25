import pulumi
from pulumi_aws import s3

# Create an S3 bucket for storing Lambda code
# Note the use of the same resource name as in the monolith program
bucket = s3.Bucket("lambda-code-bucket",
    acl="private",
    tags={
        "Environment": "dev",
        "Project": "shared"
    },
    # Use a resource alias to adopt the bucket from the monolith stack
    opts=pulumi.ResourceOptions(
        aliases=[
            # This tells Pulumi that this resource was previously defined in the monolith stack
            pulumi.Alias(name="lambda-code-bucket", stack="organization/project/monolith-dev")
        ]
    ))

# Export the bucket name
pulumi.export("bucket_name", bucket.id)