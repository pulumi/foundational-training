import pulumi
from pulumi_aws import lambda_, iam

# Reference the shared stack to get the S3 bucket name
# Note: You would replace "organization/project" with your actual organization and project names
shared_stack = pulumi.StackReference("organization/project/shared-dev")

# Get the bucket name from the shared stack
bucket_name = shared_stack.get_output("bucket_name")

# Create a Lambda role with the same name as in the monolith program
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
''',
    # Use a resource alias to adopt the role from the monolith stack
    opts=pulumi.ResourceOptions(
        aliases=[
            # This tells Pulumi that this resource was previously defined in the monolith stack
            pulumi.Alias(name="lambda-role", stack="organization/project/monolith-dev")
        ]
    )
)

# Attach the basic Lambda execution policy
lambda_role_policy = iam.RolePolicyAttachment("lambda-role-policy",
    role=lambda_role.name,
    policy_arn="arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    # Use a resource alias to adopt the policy attachment from the monolith stack
    opts=pulumi.ResourceOptions(
        aliases=[
            pulumi.Alias(name="lambda-role-policy", stack="organization/project/monolith-dev")
        ]
    ))

# Create a policy to allow the Lambda function to access the S3 bucket
bucket_policy = iam.RolePolicy("lambda-bucket-policy",
    role=lambda_role.id,
    policy=pulumi.Output.all(bucket_name).apply(lambda args: f'''
{{
  "Version": "2012-10-17",
  "Statement": [{{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": ["arn:aws:s3:::{args[0]}", "arn:aws:s3:::{args[0]}/*"]
  }}]
}}
'''),
    # Use a resource alias to adopt the bucket policy from the monolith stack
    opts=pulumi.ResourceOptions(
        aliases=[
            pulumi.Alias(name="lambda-bucket-policy", stack="organization/project/monolith-dev")
        ]
    )
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
            "BUCKET_NAME": bucket_name,
        },
    },
    tags={
        "Environment": "dev",
        "Project": "workload"
    },
    # Use a resource alias to adopt the function from the monolith stack
    opts=pulumi.ResourceOptions(
        aliases=[
            pulumi.Alias(name="my-function", stack="organization/project/monolith-dev")
        ]
    ))

# Export the Lambda function name and ARN
pulumi.export("lambda_name", function.name)
pulumi.export("lambda_arn", function.arn)