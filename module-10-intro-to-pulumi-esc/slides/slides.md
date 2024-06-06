# Module 10 - Intro to Pulumi ESC - 🌐 Overview

Pulumi ESC aims to consolidate secrets and configuration management under a single umbrella via Environments. It offers a uniform consumption interface regardless of where secrets reside. ESC manages the lifecycle of secrets and configurations, sharing them with developers, CI/CD systems, Pulumi programs, and more. It allows for secrets to be created, read, updated, and deleted (CRUD) with minimal to no disruption to consumers, facilitating seamless migrations between secret management solutions.

---

## Module 10 - Intro to Pulumi ESC - Definitions

- **ESC**: Environments, Secrets, and Configuration.
- **Environments**: YAML files that can import other Environments, defining secrets and configurations.
- **Secrets**: Sensitive data such as API keys and passwords.
  - **Static**: Values that do not change frequently but may be rotated.
  - **Dynamic**: Generated on the fly with a short validity period.
- **Configuration**: Non-secret values such as AWS regions.

---

## Module 10 - Intro to Pulumi ESC - Features

Pulumi ESC is a centralized management solution for cloud applications and infrastructure secrets and configurations. It is available as a managed service within Pulumi Cloud, with a potential self-hosted offering in the future. Key enterprise features include:

- RBAC with Teams and Permissions
- Auditing
- Versioning
- SDKs

---

## Module 10 - Intro to Pulumi ESC - Advanced Features

Pulumi ESC offers advanced features such as:

- Importing other Pulumi ESC Environments
- Storing dynamic credentials, e.g., OIDC for authentication
- Dynamically importing secrets from:
  - AWS, GCP, Azure, Vault, 1Password, and [more](https://www.pulumi.com/docs/esc/providers/)
  - Pulumi Stacks

---

## Module 10 - Intro to Pulumi ESC - Providers & Integrations

Pulumi ESC providers allow you to dynamically import secrets and configurations from various sources into your environment. Supported providers include:

- AWS (via OpenID Connect **next slide** and AWS Secrets Manager)
- GCP, Azure, Vault, 1Password, and [more](https://www.pulumi.com/docs/esc/other-integrations/)

Pulumi ESC integrations include popular use cases where ESC is used alongside development tools such as Docker, Direnv, Kubernetes, Terraform, and [more](https://www.pulumi.com/docs/esc/other-integrations/)

---

## Module 10 - Intro to Pulumi ESC - AWS OIDC Provider

A popular configuration for AWS and dynamic credentials:

```yaml
aws:
  login:
    fn::open::aws-login:
      oidc:
        roleArn: arn:aws:iam::123456789:role/esc-oidc
        sessionName: pulumi-environments-session
```

For more configuration options, see the [documentation](https://www.pulumi.com/docs/esc/providers/aws-login/#configuring-oidc).

---

## Module 10 - Intro to Pulumi ESC - CRUD Operations

You can manage Pulumi ESC Environments in several ways. Below are common use cases for each method:

- **Pulumi ESC CLI**:
  - Use ESC independently of Pulumi IaC, e.g., for application development
  - Combine with other shell commands
  - Scripting

- **Pulumi CLI (via the `pulumi esc` command)**:
  - If you already have Pulumi installed and/or use other Pulumi Cloud services
  - Scripting

- **Pulumi Cloud REST API**:
  - Mostly for read-only operations such as integrating with monitoring/compliance tools like PagerDuty, Splunk, Slack, and webhooks.

- **SDKs**:
  - Align with GitOps practices
  - Pulumi Service Provider for managing all Pulumi Cloud resources
  - ESC Provider for managing ESC-related resources

---

## Module 10 - Intro to Pulumi ESC - Consumers

ESC can be consumed in various ways:

- **As Environment Variables**:
  - Loaded via the ESC CLI or the Pulumi CLI
  - Great for app development/scripting

- **Within Pulumi Programs**:
  - Referenced in the Stack file
  - Via SDKs
  - Great when in a CI/CD pipeline and the Pulumi GitHub Actions

- **Via other ESC Environments**:
  - Defined in the `imports` section of the Environment file

---

## Module 10 - Intro to Pulumi ESC - Other

- Currently in preview, expected to reach General Availability (GA) in September 2024
- Pricing TBD, free during the preview phase
- Additional features:
  - Versioning
  - Table UI editing capabilities
  