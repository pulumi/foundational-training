# Module 04: Pulumi Import

## Prerequisities

- Pulumi CLI
- Python3 and pip3
- npm
- jq
- AWS CLI and CDK
- Terraform CLI

## Exercise 1: Consuming CloudFormation stack outputs

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
<!-- ✅  CdkStack

✨  Deployment time: 157.57s

Outputs:
CdkStack.privateSubnetId0 = subnet-0a87f6ea77d3c3321
CdkStack.privateSubnetId1 = subnet-0717b436cd86bdc60
CdkStack.vpcId = vpc-0592b542a3d08a14b
Stack ARN:
arn:aws:cloudformation:us-east-1:886783038127:stack/CdkStack/b4bc4a10-c9bb-11ee-8ebb-0e673960798b

✨  Total time: 160.33s -->

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

## Exercise 3: Coexist with Terraform by consuming Terraform state file outputs

In this exercise, you'll learn how organizations with existing Terraform codebases can consume Terraform outputs to create new infrastructure using Pulumi.

1. Deploy the Terraform config:

    ```bash
    cd terraform
    terraform init && terraform apply -auto-approve
    # Wait for the resource creation
    cd ..
    ```
<!-- Example output:
Apply complete! Resources: 28 added, 0 changed, 0 destroyed.

Outputs:

private_subnet_ids = [
  "subnet-0c5801154fa09880d",
  "subnet-07f9b21b1f15d6afc",
  "subnet-00245619dfb224d8d",
]
public_subnet_ids = [
  "subnet-0ba871343ef60cddb",
  "subnet-00741db0b2e464784",
  "subnet-0ad3499f08e73f591",
]
vpc_id = "vpc-0bedecf2957cd7bc4" -->
1. Create a new Pulumi program:

    ```bash
    pulumi new typescript -y --dir pulumi-tf-outputs # or pulumi new python -y
    ```

1. Install the Pulumi Terraform Provider and the Pulumi AWS Provider:

    ```bash
    cd pulumi-tf-outputs
    npm i @pulumi/terraform @pulumi/aws
    ```

1. In your Pulumi program, use the `terraform.state.RemoteStateReference` resource to reference the TF state file on disk, read the value of the `vpc_id` (a string) and `private_subnet_ids` (an array of strings) outputs, and store them in local variables.

1. Using the outputs from the previous step, provision an EC2 workload in one of the private subnets. Use the `vpc_id` output to create a security group and the `private_subnet_ids` output to place the EC2 instance. (Simple examples of workloads would be a t3.micro instance running NGINX, or a t3.micro running SSM Systems Manager.)

Hint: Ensure the AWS region used in the Pulumi Stack matches that of the VPC.

1. Finally, delete the stack with the imported resources:

    ```bash
    pulumi stack rm dev --force
    ```

## Exercise 4: Replace Terraform by converting from Terraform to Pulumi

In this exercise, you will take a Terraform program containing a VPC and convert it to Pulumi code in the language of your choice:

1. Ensure you have the latest version of the Pulumi Terraform converter:

    ```bash
    pulumi plugin install converter terraform
    ```

1. Ensure you have the latest version of Terraform:

    ```bash
    brew tap hashicorp/tap
    brew install hashicorp/tap/terraform
    ```

1. Deploy the Terraform config:

    ```bash
    cd terraform && terraform init && terraform apply -auto-approve
    # Wait for the resource creation
    ```

1. Convert the Terraform code to Pulumi

    ```bash
    pulumi convert --from terraform --out ../pulumi-convert-tf-ts --language typescript
    ```

    or

    ```bash
    pulumi convert --from terraform --out ../pulumi-convert-tf-py --language python
    ```

    This command will generate code, but the resources will not yet be under Pulumi management because they have not been imported to your Pulumi state.

1. Import the resources from your TF state file into your Pulumi state file:

    ```bash
    cd ../pulumi-convert-tf-ts # or cd ../pulumi-convert-tf-py
    pulumi stack init dev
    pulumi import --from terraform ../terraform/terraform.tfstate --protect=false --generate-code=false
    ```

1. Check to see whether there any additional massaging is necessary. For example, you may need to change the tags from `name` to `Name`. (Loss of case-sensitivity for tag names in conversion from Terraform [is a known issue](https://github.com/pulumi/pulumi-converter-terraform/issues/100).)

    Run the following command to see whether there is any drift between your Pulumi state file and your resources as declared in your Pulumi program:

    ```bash
    pulumi preview --diff
    ```

    If you see output similar to the following, you will need to massage your Pulumi code to resolve the drift:

    ```text
      ~ tags   : {
          - Name: "convert-tf"
          + name: "convert-tf"
      }
      ~ tagsAll: {
          - Name: "convert-tf"
          + name: [secret]
        }
    Resources:
    ~ 16 to update
    ```

    Once all drift is resolved, you'll see output like the following:

    ```text
    Resources:
        29 unchanged
    ```

1. Reformat and refactor the generated Pulumi code for improved readability:

    - Fix whitespacing to make the code more readable.
    - Refactor to use 2 loops: one for the public subnets (based of the list of public subnet CIDRs), and a similar loop for the private subnets.

    Throughout the process, you should continuously run `pulumi preview` to make sure you have not accidentally created drift.

At this point, your resources are under Pulumi control and in a production scenario the Terraform state file should be archived to avoid any confusion as to the source of truth for your the state of your resources.
