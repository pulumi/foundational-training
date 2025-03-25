import pulumi
from pulumi_aws import s3, lambda_, iam

# Create an S3 bucket for storing Lambda code
bucket = s3.Bucket("lambda-code-bucket",
    acl="private",
    tags={
        "Environment": "dev",
        "Project": "monolith"
    })

# Create a simple Lambda function that uses the bucket
lambda_role = iam.Role("lambda-role",
    assume_role_policy='''
{
  "Version": "2012-10-17",
  "Statement": [{
    "Action": "sts:AssumeRole",
    "Principal": {
      "Service": "lambda.amazonaws.com"
    },
    "Effect": "Allow",
    "Sid": ""
  }]
}
'''
)

# Attach the basic Lambda execution policy
lambda_role_policy = iam.RolePolicyAttachment("lambda-role-policy",
    role=lambda_role.name,
    policy_arn="arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole")

# Create a policy to allow the Lambda function to access the S3 bucket
bucket_policy = iam.RolePolicy("lambda-bucket-policy",
    role=lambda_role.id,
    policy=pulumi.Output.all(bucket.arn).apply(lambda args: f'''
{{
  "Version": "2012-10-17",
  "Statement": [{{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": ["{args[0]}", "{args[0]}/*"]
  }}]
}}
''')
)

# Create a Lambda function that reads from the S3 bucket
function = lambda_.Function("my-function",
    code=pulumi.AssetArchive({
        ".":
        pulumi.FileArchive("./lambda_code.zip"),
    }),
    role=lambda_role.arn,
    handler="index.handler",
    runtime="python3.8",
    environment={
        "variables": {
            "BUCKET_NAME": bucket.id,
        },
    },
    tags={
        "Environment": "dev",
        "Project": "monolith"
    })

# Export the bucket name and Lambda function name/ARN
pulumi.export("bucket_name", bucket.id)
pulumi.export("lambda_name", function.name)
pulumi.export("lambda_arn", function.arn)