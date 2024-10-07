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

2. Create a new Pulumi program:

    ```bash
    cd ..
    mkdir pulumi-cf-outputs
    cd pulumi-cf-outputs
    pulumi new typescript -y # or pulumi new python -y
    npm i @pulumi/aws
    ```

3. In your Pulumi program, use the `aws.cloudformation.getStackOutput` resource to reference the `CdkStack` CloudFormation stack, read the value of the `vpcId` and `privateSubnetId0` outputs and store them in local variables. (Note that the `Output` part of `getStackOutput` refers to the fact that the values returned are Pulumi Outputs. The function returns a CloudFormation stack, not its individual CloudFormation stack outputs.)

4. Using the outputs from the previous step, provision an EC2 workload in one of the private subnets. Use the `vpcId` output to create a security group and the `private_subnets` output to place the EC2 instance. (Simple examples of workloads would be a t3.micro instance running NGINX, or a t3.micro running SSM Systems Manager.)

5. Clean up all the Pulumi resources with `pulumi destroy --yes --remove`
