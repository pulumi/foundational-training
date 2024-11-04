# Exercise 02: AWS Secrets Manager and Importing Environments

In this exercise, you'll see how ESC integrates with popular secrets managers like AWS Secrets Manager. You can use ESC to pull dynamic secrets from a range of secret sources. For a complete list of services ESC integrates with, see [Pulumi ESC Integrations](https://www.pulumi.com/docs/esc/integrations/).

You will build a Lambda function that queries the GitHub API.

## Setup Steps

The `setup` stack will take a GitHub token, place it in AWS Secrets Manager, and generate an ESC environment that reads the secret.

1. Create a [GitHub personal token](https://github.com/settings/tokens?type=beta). The token can be read-only.
1. Add the GitHub token as a secret config value to the setup infra for this exercise, e.g.:

    ```bash
    cd exercise-02-aws-secrets-manager
    cd setup
    pulumi config set githubToken github_pat_abc123 --secret # Replace value with your token
    ```

1. (Optional) If you want to use the AWS ESC OIDC credentials (see first step of Exercise 1), add them to this stack:

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

1. When the stack has deployed, note the command to add an environment to the stack containing the Lambda function.

    ```bash
    pulumi stack output command
    ```

## Exercise Steps

> [!IMPORTANT]
> You will need to install NodeJS in order to complete this exercise as the Lambda function is written in NodeJS for ease of packaging.

1. Check out the generated ESC environment in the Pulumi Cloud console. Note that it reuses the OIDC credentials we set up earlier. These OIDC credentials are the role that Pulumi Cloud will use to access the secrets in AWS Secrets Manager.

1. Install the Lambda function's dependencies:

    ```bash
    cd ../exercise/lambda
    npm i
    ```

1. Add the generated ESC environment to the exercise stack. Note that because the environment imports the OIDC credentials we used earlier, we do not need to add the OIDC environment separately, e.g..

    ```bash
    cd ..
    pulumi config env add foundational-training/aws-secrets-h4hUa6 # substitute your environment's name
    ```

1. Check out the code and note how the code has a required secret config value. ESC will pull this value automatically from AWS Secrets Manager from the environment you set up earlier:

    ```typescript
    const config = new pulumi.Config();
    const githubToken = config.requireSecret("githubToken");
    ```

1. Deploy the Lambda function.

    ```bash
    cd ..
    npm i
    pulumi up -y
    ```

1. Execute the function URL:

    ```bash
    curl $(pulumi stack output functionUrlEndpoint)
    ```

    You should see output similar to the following:

    ```text
    {"message":"Successfully fetched user information","user":{"login":"jkodroff","name":"Josh Kodroff","publicRepos":48,"followers":62,"following":35}}%
    ```

## Cleanup Steps

1. Tear down the Lambda stack:

    ```bash
    pulumi destroy -y
    ```

1. Tear down the setup stack:

    ```bash
    cd ../setup
    pulumi destroy -y
    ```
