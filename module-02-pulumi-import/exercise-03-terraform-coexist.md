# Exercise 3: Coexist with Terraform by consuming Terraform state file outputs

In this exercise, you'll learn how organizations with existing Terraform codebases can consume Terraform outputs to create new infrastructure using Pulumi.

1. Ensure you have the latest version of Terraform:

    ```bash
    brew tap hashicorp/tap
    brew install hashicorp/tap/terraform
    ```

2. Deploy the Terraform config:

    ```bash
    cd terraform && terraform init && terraform apply -auto-approve
    # Wait for the resource creation
    ```

3. Deploy the Terraform config:

    ```bash
    cd terraform
    terraform init && terraform apply -auto-approve
    # Wait for the resource creation
    cd ..
    ```

4. Create a new Pulumi program:

    ```bash
    pulumi new typescript -y --dir pulumi-tf-outputs # or pulumi new python -y
    ```

5. Install the Pulumi Terraform Provider and the Pulumi AWS Provider:

    ```bash
    cd pulumi-tf-outputs
    npm i @pulumi/terraform @pulumi/aws
    ```

6. In your Pulumi program, use the `terraform.state.RemoteStateReference` resource to reference the TF state file on disk, read the value of the `vpc_id` (a string) and `private_subnet_ids` (an array of strings) outputs, and store them in local variables.

7. Using the outputs from the Terraform config, provision an EC2 workload in one of the private subnets:

    - Use the `vpc_id` output to create a security group.
    - Use the the `private_subnet_ids` output to place the EC2 instance.

    Hint: Ensure the AWS region used in the Pulumi Stack matches that of the VPC.

8. Ensure the Pulumi infrastructure provisions:

    ```bash
    pulumi up
    ```

9. Once the infrastructure successfully spins up, you can delete the Pulumi infra:

    ```bash
    pulumi destroy
    ```

10. If you are not performing exercise 4 (check with your instructor), be sure to tear down the Terraform resources:

    ```bash
    cd ../terraform
    terraform destroy
    ```
