# Exercise 1: Consuming CloudFormation stack outputs

In this exercise, you'll learn how organizations using CDK or CloudFormation can consume stack outputs using Pulumi.

1. Deploy the CDK stack:

    ```bash
    cd cdk
    npm i
    cdk bootstrap # Only if never run in this environment
    cdk deploy
    # Confirm with 'y'
    # Wait a few seconds for the resource creation
    ```

1. Create a new Pulumi program:

    ```bash
    cd ..
    mkdir pulumi-cf-outputs
    cd pulumi-cf-outputs
    pulumi new typescript -y # or pulumi new python -y
    npm i @pulumi/aws
    ```

1. In your Pulumi program, use the `aws.cloudformaton.getStackOutput` resource to reference the `CdkStack` CloudFormation stack, read the value of the `vpcId` and `privateSubnetId0` outputs and store them in local variables. (Note that the `Output` part of `getStackOutput` refers to the fact that the values returned are Pulumi Outputs. The function returns a CloudFormation stack, not its individual CloudFormation stack outputs.)
1. Using the outputs from the previous step, provision an EC2 workload in one of the private subnets. Use the `vpcId` output to create a security group and the `private_subnets` output to place the EC2 instance. (Simple examples of workloads would be a t3.micro instance running NGINX, or a t3.micro running SSM Systems Manager.)
1. Clean up all the Pulumi resources with `pulumi destroy --yes --remove`

## Exercise 2: Bulk importing resources

In this exercise you will bulk import resources (typically created manually in the console or via CloudFormation). This exercise uses a custom script using `boto3` to generate a bulk import JSON file for use with the `pulumi import` command, but learners are welcome to take their own approach to gather resources for import, including handwriting the file.

1. Deploy the CDK stack if your account/region has no VPCs or similar resources:

    ```bash
    # Skip this step if already deployed the CDK in the previous step
    cd cdk && cdk deploy && cd -
    ```

1. Install the dependencies for the account scraper script:

    ```bash
    # Modify the following command as necessary for your environment (venv, poetry, etc):
    cd boto3
    pip install -r requirements.txt # or pip3
    ```

1. Run the account scraper:

    ```bash
    # from the boto3 directory,
    python3 account_scraper.py > pulumi-import.json && cd -
    #
    # If your AWS region is not set then run as:
    # AWS_DEFAULT_REGION=us-east-1 python3 account_scraper.py > pulumi-import.json && cd -
    ```

    Note that this script will scan all VPCs and associated resources (subnets, route tables, etc.) in the account/region in which you run it.

1. Create a Pulumi program:

    ```bash
    pulumi new aws-typescript -y --dir pulumi-import-exercise
    ```

1. Import the resources you exported:

    ```bash
    cd pulumi-import-exercise
    pulumi import -f ../boto3/pulumi-import.json > index.ts -y
    ```

1. Run the `pulumi preview` command. Edit the program until the `pulumi preview` command shows no errors and no diff. The resources in this program are now under Pulumi management (although `pulumi import` protects them from deletion by default.)

1. Finally, delete the stack with the imported resources in order to avoid accidentally modifying resources in your AWS environment:

    ```bash
    pulumi stack rm dev --force
    ```