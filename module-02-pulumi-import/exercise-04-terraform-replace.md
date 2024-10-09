# Exercise 4: Replace Terraform by converting from Terraform to Pulumi

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

1. Deploy the Terraform config (unless reusing from Exercise 3):

    ```bash
    cd terraform && terraform init && terraform apply -auto-approve
    # Wait for the resource creation
    ```

1. Create a new Pulumi program:

    ```bash
    mkdir ../pulumi-convert-tf 
    cd ../pulumi-convert-tf
    pulumi new typescript # or pulumi new python
    ```

1. Convert the Terraform code to Pulumi

    ```bash
    cd ../terraform
    pulumi convert --from terraform --out ../pulumi-convert-tf --language typescript # or python
    ```

    This command will generate code, but the resources will not yet be under Pulumi management because they have not been imported to your Pulumi state.

1. Import the resources from your TF state file into your Pulumi state file:

    ```bash
    cd ../pulumi-convert-tf-ts # or cd ../pulumi-convert-tf-py
    pulumi stack init dev
    pulumi import --from terraform ../terraform/terraform.tfstate --protect=false --generate-code=false
    ```

1. Check to see whether any additional massaging is necessary. For example, you may need to change the tags from `name` to `Name`. (Loss of case-sensitivity for tag names in conversion from Terraform [is a known issue](https://github.com/pulumi/pulumi-converter-terraform/issues/100).)

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

1. Once `pulumi preview` shows no diff, your resources are under Pulumi control and in a production scenario the Terraform state file should be archived to avoid any confusion as to the source of truth for your the state of your resources.

1. Remove the TF state file:

    ```bash
    rm ../terraform/terraform.tfstate
    ```

1. Tear down your Pulumi stack:

    ```bash
    pulumi destroy
    ```
