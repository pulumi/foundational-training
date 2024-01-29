# Module 05: Pulumi Import

## Consuming Terraform State File Outputs

TODO

Provision an EC2 instance in one of the private subnets and grant SSH access via SSM Systems Manager.

## Converting from Terraform to Pulumi and Importing from TF state

TODO

In this exercise, you will take a Terraform program containing a VPC and convert it to Pulumi code in the language of your choice.

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
    cd terraform && terraform init && terraform apply
    ```

1. Convert the Terraform code to Pulumi

    ```bash
    pulumi convert --from terraform --out ../pulumi-convert-tf-ts --language typescript
    ```

    or

    ```bash
    pulumi convert --from terraform --out ../pulumi-convert-tf-py --language python
    ```

1. Massage the generated Pulumi code: While the `pulumi convert` command does convert most Terraform code and gives you a very good starting point, it does not support all constructs in HCL, and it is normal to have to massage the code resulting from the `pulumi convert` command.

    - Correct any instances of `notImpelented`/`not_implemented`.
    - Fix whitespacing to make the code more readable.
    - Refactor the code to be more idiomatic and readable with a single `for` or `.forEach()` loop over the AZs.

## Importing Terraform State

TODO

```bash
cd ../pulumi-convert-tf-ts
pulumi import --from terraform ../terraform/terraform.tfstate --generate-code false
```
