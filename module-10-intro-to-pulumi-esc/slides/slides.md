# Module 10 - Intro to Pulumi ESC - 🌐 Overview

Pulumi ESC aims to consolidate secrets and config management sprawl under a single umbrella via Environments. It offers a uniform consumption interface regardless of where secrets may reside. ESC is equipped to handle the lifecycle of secrets and configs that need to be shared with developers, CI/CD systems, Pulumi programs, and more. It allows for secrets to be _CRUD'ed_ with minimal to no disruption to the consumer(s), which also paves the way for secret management migrations.

---

## Module 10 - Intro to Pulumi ESC - Definitions

- ESC -> Environments, Secrets, and Configuration
- Environments: A YAML file that can import other Environments. Defines secrets/configs.
- Secrets: Sensitive data such as API keys and passwords.
  - Static: Values that do not change on the fly, may still be rotated.
  - Dynamic: Generated on the fly and has a short validity period.
- Configuration: Non-secret values such as AWS Regions

---

## Module 10 - Intro to Pulumi ESC

- Centralized management solution for cloud apps + infra secrets, and configurations
- A managed service within Pulumi Cloud (self-hosted offering at some point...)
- Fully packed with enterprise features
  - RBAC
  - Auditing
  - Versioning
  - SDKs

---

## Module 10 - Intro to Pulumi ESC - Advanced Features Overview

- Ability to import other Pulumi ESC Environments
- Store Dynamic Credentials, e.g., OIDC
- Import secrets from other [Secret Managers](https://www.pulumi.com/docs/esc/providers/)
  - AWS, GCP, Azure, Vault, 1Password, and [more](https://www.pulumi.com/docs/esc/other-integrations/).
- Import secrets from Pulumi Stacks

---

## Module 10 - Intro to Pulumi ESC - Integrations

Integrations allow for existing Secrets Management solutions
<!-- TODO -->

---

## Module 10 - Intro to Pulumi ESC - AWS OIDC Integration

- Popular configuration for AWS + Dynamic Credentials

```yaml
aws:
  login:
    fn::open::aws-login:
      oidc:
        roleArn: arn:aws:iam::123456789:role/esc-oidc
        sessionName: pulumi-environments-session
```

See more configuration [options](https://www.pulumi.com/docs/esc/providers/aws-login/#configuring-oidc).

---

## Module 10 - Intro to Pulumi ESC - CRUD

You can CRUD Pulumi ESC Environments from

- Pulumi ESC CLI
- Pulumi CLI, via the `pulumi esc` command
- Pulumi Cloud REST API
- Pulumi Service Provider
- ESC Provider

---

## Module 10 - Intro to Pulumi ESC - Consumers

ESC can be consumed:

- As Enviornment variables
  - Loaded via the ESC CLI or the Pulumi CLI
- Within Pulumi programs
  - Referenced in the Stack file
- Via other ESC Environments (hierarchy model)
  - Defined in the `imports` section of the Environment file.

The above allows for straightforward integration with CI/CD pipelines.

---

## Module 10 - Intro to Pulumi ESC - Other

- Currently in preview and expected to GA in September 2024
- Pricing TBD, free during the preview phase
- Other features
  - Versioning
  - Table UI editing capabilities
