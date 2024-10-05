# Exercise 2: Bulk importing resources

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
