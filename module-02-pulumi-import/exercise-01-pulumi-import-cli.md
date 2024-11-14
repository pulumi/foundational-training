# Exercise 1: The `pulumi import` command

In this exercise you will use the Pulumi CLI to import resources into a stack. There are two ways to use the `pulumi import` command:

1. Importing a single resource by supplying all arguments at the command line.
1. Importing multiple resources by passing a JSON file to the `pulumi import` command.

## Setup Steps

1. Deploy some AWS resources (a VPC and two subnets) by running the following command. We will bring these resources under Pulumi management:

    ```bash
    aws cloudformation deploy --template-file exercise-01-cfn.yaml --stack-name pulumi-import-ex-01 --capabilities CAPABILITY_NAMED_IAM --region us-east-1
    ```

    Note the IDs of the VPC and subnets that are exported as values:

    ```bash
    aws cloudformation list-exports --region us-east-1
    ```

1. Create a Pulumi program and change to the directory containing the program:

    ```bash
    mkdir pulumi-import-ex-01
    cd pulumi-import-ex-01
    pulumi new aws-typescript -y
    ```

    or, for Python:

    ```bash
    mkdir pulumi-import-ex-01
    cd pulumi-import-ex-01
    pulumi new aws-python -y
    ```

    Remove any resources contained in the generated program and any config in the stack file that sets the AWS region.

## Importing a Single Resource from the Command Line

1. Navigate to the [Pulumi Registry](https://www.pulumi.com/registry/) and look up the command to import a VPC resource. The syntax will be at the bottom of the VPC resource's page in the AWS provider.

    > [!IMPORTANT]
    > Be sure to substitue the VPC ID from the CloudFormation stack you deployed earlier.

    Run the command.

1. After running the command, you will see the code for the resource in the command line output in the same language of your Pulumi program. Copy and paste the generated code into your program and run the following command:

    ```bash
    pulumi preview
    ```

    You should see no diff. If you do see a diff, massage the generated code and re-run `pulumi preview` until there is no diff.

## Importing Multiple Resources from the Command Line

1. Create a file called `pulumi-import.json` in the same directory as your Pulumi program. Create the file contents similar to the following (note that you will have to swap the `id` fields for the actual subnet ids):

    ```json
    {
        "resources": [
            {
                "type": "aws:ec2/subnet:Subnet",
                "name": "imported-subnet-1",
                "id": "subnet-abc123"
            },
            {
                "type": "aws:ec2/subnet:Subnet",
                "name": "imported-subnet-2",
                "id": "subnet-xyz987" // substitute with the actual subnet ID
            }
        ]
    }
    ```

1. Import the resources you exported:

    ```bash
    pulumi import -f pulumi-import.json
    ```

    Copy the resulting code into your Pulumi program.

1. Run the `pulumi preview` command. Edit the program until the `pulumi preview` command shows no errors and no diff. The resources in this program are now under Pulumi management (although `pulumi import` protects them from deletion by default.)

## Cleaning Up

1. Delete the stack with the imported resources:

    ```bash
    pulumi stack rm dev --force
    ```

1. Tear down the CloudFormation stack:

    ```bash
    aws cloudformation delete-stack --stack-name pulumi-import-ex-01 --region us-east-1
    ```
