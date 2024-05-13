# Module 10 - Intro to Pulumi ESC - 🌐 Overview

Learn the fundamentals Pulumi ESC.

- What is it?
- Features
- AWS OIDC
- CRUD

---

## Module 10 - Intro to Pulumi ESC

- ESC -> Environments, Secrets, and Configuration
- Centralized management solution for cloud apps + infra secrets, and configurations
- A managed service within Pulumi Cloud (self-hosted offering at some point...)
- Fully packed with enterprise features
  - RBAC
  - Auditing
- Define _Environments_ as YAML files, which are collection of secrets and configurations.

---

## Module 10 - Intro to Pulumi ESC - Advanced Features

- Ability to import other Pulumi ESC Environments
- Store Dynamic Credentials, e.g., OIDC
- Import secrets from other [Secret Managers](https://www.pulumi.com/docs/esc/providers/)
  - AWS, GCP, Azure, Vault, 1Password, and [more](https://www.pulumi.com/docs/esc/other-integrations/).
- Import secrets from Pulumi Stacks

---

## Module 10 - Intro to Pulumi ESC - AWS OIDC

- Popular configuration for AWS + Dynamic Credentials

```yaml
aws:
  login:
    fn::open::aws-login:
      oidc:
        roleArn: arn:aws:iam::123456789:role/esc-oidc
        sessionName: pulumi-environments-session
```

Other configuration [options](https://www.pulumi.com/docs/esc/providers/aws-login/#configuring-oidc) available.

---

## Module 10 - Intro to Pulumi ESC - CRUD

You can CRUD Pulumi ESC environments from

- Pulumi ESC CLI
- Pulumi CLI, via the `pulumi esc` command
- Pulumi Cloud REST API
- Pulumi Service Provider (in the works)

---

## Module 10 - Intro to Pulumi ESC - Consumers

ESC can be consumed:

- As Enviornment Variables
  - Loaded via the ESC CLI or the Pulumi CLI
- Within Pulumi programs
  - Referenced in the Stack file
- Via other ESC Environments
  - Defined in the `imports` section of the Environment file.

The above allow for straightforward integration with CI/CD pipelines.

---

## Module 10 - Intro to Pulumi ESC - Other

- Currently, in preview /expected to GA in September 2024
- Pricing TBD, free during Preview
- Other features
  - Version control
  - Table UI editing capabilities
