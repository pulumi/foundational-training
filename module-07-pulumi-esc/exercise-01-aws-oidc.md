# Exercise 01: AWS OIDC Credentials

This exercise shows you how to consume OIDC credentials in AWS using Pulumi ESC.

## OIDC and CLI Commands

1. If you do not yet have OIDC configured between your Pulumi Cloud organization and your AWS account, deploy the OIDC solution in a blank directory. This only needs to be done once per combination of Pulumi Cloud organization and AWS account:

   ```bash
   mkdir aws-ts-oidc-provider-pulumi-cloud
   cd aws-ts-oidc-provider-pulumi-cloud
   pulumi new https://github.com/pulumi/examples/tree/master/aws-ts-oidc-provider-pulumi-cloud
   # Accept the default answers to the prompts.
   pulumi up -y
   ```

1. Ensure you have no valid AWS credentials in your current shell:

   ```bash
   unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_PROFILE
   ```

   The following CLI command should fail:

   ```bash
   $ aws sts get-caller-identity

   Unable to locate credentials. You can configure credentials by running "aws configure".
   ```

1. Run a command line command with the OIDC environment you ran:

   ```bash
   pulumi env run aws/aws-oidc-admin -- aws sts get-caller-identity
   ```

   Note that the name of your ESC project/environment may be different in the preceding command.

   Also note that all commands that begin with `pulumi env` are also available via the standalone `esc` CLI.

## OIDC and Pulumi IaC

1. Create a Pulumi program:

   ```bash
   mkdir esc-aws-exercise-01
   cd esc-aws-exercise-01
   pulumi new aws-typescript -y
   ```

1. Ensure you have no valid AWS credentials in your current shell:

   ```bash
   unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN AWS_PROFILE
   ```

   The following CLI command should fail:

   ```bash
   $ aws sts get-caller-identity

   Unable to locate credentials. You can configure credentials by running "aws configure".
   ```

1. Deploying your Pulumi program should fail with Pulumi saying it's unable to find any credentials, e.g.:

   ```bash
   $ pulumi preview

   # ...

   Diagnostics:
       pulumi:providers:aws (default_6_54_2):
           error: pulumi:providers:aws resource 'default_6_54_2' has a problem: No valid credential sources found.
   ```

1. Configure your Pulumi IaC program to use your ESC environment:

   ```bash
   pulumi config env add aws/aws-oidc-admin
   ```

1. Check out the contents of `Pulumi.dev.yaml`. It should look something like the following:

   ```yaml
   $ cat Pulumi.dev.yaml
   environment:
   - aws/aws-oidc-admin
   ```

   Your Pulumi IaC program will now use your OIDC credentials to manage AWS resources.

1. Try running a Pulumi command again:

   ```bash
   pulumi preview
   ```

   The command should succeed.
