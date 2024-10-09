# Exercise 02: AWS Secrets Manager

In this exercise, you'll see how ESC integrates with popular secrets managers like AWS Secrets Manager. You can use ESC to pull dynamic secrets from a range of secret sources. For a complete list of services ESC integrates with, see [Pulumi ESC Integrations](https://www.pulumi.com/docs/esc/integrations/).

You will build a Lambda function that queries the GitHub API.

## Setup Steps

NOTE: This stack is written in TypeScript. You will need to install node/npm in order to complete these steps.

1. Create a [GitHub personal token](https://github.com/settings/tokens?type=beta). The token can be read-only.
1. Add the GitHub token as a secret config value to the setup infra for this exercise, e.g.:

    ```bash
    cd exercise-02-aws-secrets-manager
    cd setup
    pulumi config set githubToken github_pat_11AADEH5Q0MJ9dUZbsyruI_n49twNSe6zTIKmCNwZ5458492eugfiohdjksRL7ZyDGNLVQQR1ZfQcSxj --secret 
    ```

1. (Optional) If you want to use ESC OIDC credentials, add them to this stack:

    ```bash
    pulumi config env add aws/aws-oidc-admin
    ```

1. Deploy the infrastructure:

    ```bash
    npm i
    pulumi up
    ```

    Note that if you are working from a shared Pulumi organization, you may need to first create a new stack:

    ```bash
    pulumi stack init <your-name>
    ```

## Exercise Steps

Note that this is a somewhat contrived example for simplicity - you could accomplish the same goal by simply grabbing the secret value in the Lambda function itself, or by  but in more realistic production scenarios, you might use ESC to pull configuration and secrets from a variety of different sources (some not necessarily in AWS).

## Cleanup Steps
