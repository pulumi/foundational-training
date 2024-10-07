# Exercise 1: Consuming CloudFormation stack outputs

In this exercise, you'll learn how organizations using CDK or CloudFormation can consume stack outputs using Pulumi.

1. Deploy a VPC managed outside of Pulumi via either CDK or CloudFormation.

    If you have CDK installed:

    ```bash
    cd cdk
    npm i
    cdk bootstrap # Only if never run in this environment
    cdk deploy -y
    ```

    If not, you can use CloudFormation directly with the AWS CLI:

    ```bash
    aws cloudformation deploy --template-file cfn_template.yaml --stack-name pulumi-import-vpc --capabilities CAPABILITY_NAMED_IAM
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
1. Using the outputs from the previous step, provision an EC2 instance in one of the private subnets. Use the `vpcId` output to create a security group and the `private_subnets` output to place the EC2 instance.
1. Clean up all the Pulumi resources with `pulumi destroy --yes --remove`
1. Tear down the CDK/CloudFormation stack:

    ```bash
    cdk destroy
    ```

    or

    ```bash
    aws cloudformation delete-stack help
    ```
