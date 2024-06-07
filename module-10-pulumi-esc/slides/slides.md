# Module 10 - Pulumi ESC - 🌐 Overview

Pulumi ESC aims to:

- consolidate secrets and configuration management under a single umbrella
- offer a uniform consumption interface regardless of where secrets reside
- allows for secrets to be CRUD'ed with minimal to no disruption to consumers (byproduct: facilitate secret management solution migrations)
- provide secrets to developers, CI/CD systems, Pulumi programs, and more

---

## Module 10 - Pulumi ESC - Definitions

- **ESC**: Environments, Secrets, and Configuration
- **Environments**:
  - YAML files that can import other Environments
  - Defines secrets and configurations
- **Secrets**: Sensitive data such as API keys and passwords
  - **Static**: Values that do not change frequently but may be rotated
  - **Dynamic**: Fetched (or generated) on the fly and may have a short validity period
- **Configuration**: Non-secret values such as AWS regions

---

## Module 10 - Pulumi ESC - Enterprise Features

Pulumi ESC is available as a managed service within Pulumi Cloud, with a potential self-hosted offering in the future. Key enterprise features include:

- RBAC with Teams and Permissions
- Auditing
- Versioning
- SDKs
- Support (bundled with applicable Pulumi Cloud plans)

---

## Module 10 - Pulumi ESC - Advanced Features

Pulumi ESC offers advanced features such as:

- Importing other Pulumi ESC Environments
- Storing dynamic credentials, e.g., OIDC for authentication
- Dynamically importing secrets from:
  - AWS, GCP, Azure, Vault, 1Password, and [more](https://www.pulumi.com/docs/esc/providers/)
  - Pulumi Stacks

---

## Module 10 - Pulumi ESC - Providers & Integrations

- **Pulumi ESC providers**: allow you to dynamically import secrets and configurations from various sources into your environment. Supported providers include:

- AWS (via OpenID Connect and AWS Secrets Manager)
- GCP, Azure, Vault, 1Password, and [more](https://www.pulumi.com/docs/esc/other-integrations/)

- **Pulumi ESC integrations**: include popular use cases where ESC is used alongside development tools such as Docker, Direnv, Kubernetes, Terraform, and [more](https://www.pulumi.com/docs/esc/other-integrations/)

We'll look at examples of each next.

---

## Module 10 - Pulumi ESC - Provider Example (pt. 1)

Per AWS, "we **strongly** recommend that you do **not** store AWS credentials long-term in applications outside AWS". The Pulumi ESC AWS OIDC Provider allows you to configure your applications to request temporary AWS security credentials _dynamically_ via OIDC federation.

AWS Resources needed:

- AWS IAM OIDC IdP
- AWS IAM Role (with a trust relationship to the OIDC IdP)

---

## Module 10 - Pulumi ESC - Provider Example (pt. 2)

ESC Environment named `aws-oidc`:

```yaml
aws:
  login:
    fn::open::aws-login:
      oidc:
        roleArn: arn:aws:iam::123456789:role/esc-oidc
        sessionName: pulumi-environments-session
```

Use:

```bash
esc env open aws-oidc -- aws s3 ls
```

For more configuration options, see the [documentation](https://www.pulumi.com/docs/esc/providers/aws-login/#configuring-oidc).

---

## Module 10 - Pulumi ESC - Integration Example (pt. 1)

ESC can be used to create temporary, local files. This is particularly useful for running shell commands that take files as arguments or to obfuscate sensitive data from being logged in the terminal history.

Example ESC Environment, `docker-env-test`:

```yaml
values:
    environmentVariables:
        ESC_ORG: You are in the ${context.pulumi.organization.login} organization!
        ESC_HELLO_USER: Hello, ${context.pulumi.user.login}!
    files:
        DOCKER_ENVFILE: |
            ESC_ORG=${environmentVariables.ESC_ORG}
            ESC_HELLO_USER=${environmentVariables.ESC_HELLO_USER}
```

---

## Module 10 - Pulumi ESC - Integration Example (pt. 2)

Example with Docker commands:

```bash
$ esc open docker-env-test --format shell

export ESC_HELLO_USER="Hello, example-user!"
export ESC_ORG="You are in the example organization!"
export DOCKER_ENVFILE="/var/folders/ny/f_y5fsqd235fpx5bs6ghyk4w0000gn/T/esc-1312668514"

```

Reference the env-file to set environment variables dynamically in a `docker run` command:

```bash
esc run -i docker-env-test -- sh -c 'docker run --rm -t --env-file=$DOCKER_ENVFILE alpine env'
```

---

## Module 10 - Pulumi ESC - CRUD Operations (pt. 1)

You can manage Pulumi ESC Environments in several ways. Below are common use cases for each method:

- **Pulumi ESC CLI**:
  - Use ESC independently of Pulumi IaC, e.g., for application development
  - Combine with other shell commands
  - Scripting

- **Pulumi CLI (via the `pulumi esc` command)**:
  - If you already have Pulumi installed and/or use other Pulumi Cloud services
  - Scripting

---

## Module 10 - Pulumi ESC - CRUD Operations (pt. 2)

- **Pulumi Cloud REST API**:
  - Mostly for read-only operations such as integrating with monitoring/compliance tools like PagerDuty, Splunk, Slack, and webhooks.

- **SDKs**:
  - Align with GitOps practices
  - Pulumi Service Provider for managing all Pulumi Cloud resources
  - ESC Provider for managing ESC-related resources

---

## Module 10 - Pulumi ESC - Consumers

- **As Environment Variables**:
  - Loaded via the ESC CLI or the Pulumi CLI
  - Great for app development, scripting, and shell commands

- **Within Pulumi Programs**:
  - Referenced in the Stack file
  - Via SDKs
  - Great when in a CI/CD pipeline and the Pulumi GitHub Actions

- **Via other ESC Environments**:
  - Defined in the `imports` section of the Environment file

---

## Module 10 - Pulumi ESC - Other

- Currently in preview, expected to reach General Availability (GA) in September 2024
- Pricing TBD, free during the preview phase
- Additional features:
  - Versioning
  - Table UI editing capabilities
