# Module 16 - Advanced CI/CD - 🌐 Overview

In this module, you will learn advanced topics that make up a robust infrastructure CI/CD pipeline through guided exercises. You will use Pulumi tooling to introduce production features to an infra CI/CD pipeline.

---

## Module 16 - Advanced CI/CD - 🎯 Learning Objectives

- Learn how to build an advanced CI pipeline to enforce compliance and correct drift.
- Add dynamic credentials to your stack by configuring Pulumi ESC.
- Add policy checks to test your infrastructure before each deployment.
- Add a cron job to the pipeline to check for changes periodically (drift)
- Configure a dedicated cloud environment with Review Stacks

---

## Module 16 - Advanced CI/CD - **Dynamic Credentials**

*Dynamic Credentials* Unlike static credentials, dynamic credentials are generated on the fly and have a short validity period, enhancing security by reducing the risk of unauthorized access from credential theft or misuse. It also eliminates the need for developers to manage the lifecycle of individual access keys for instances.

*OIDC* OpenID Connect (OIDC) is an authentication protocol built on the OAuth 2.0 framework. It enables clients to authenticate users confidently while supporting single sign-on (SSO) and other identity-related functionalities.

*Pulumi ESC* Pulumi ESC enables you to define environments that contain collections of secrets and configurations. Each environment can be composed of multiple environments. An environment may store dynamic credentials from an OIDC IdP, such as Pulumi Cloud, to connect to your AWS.

---

## Module 16 - Advanced CI/CD - **Compliance** (cont'd)

*Cloud compliance* refers to ensuring that cloud-based systems, services, and data storage adhere to relevant laws, regulations, standards, and best practices governing security, privacy, and data protection.

*Policy as Code* involves codifying policy definitions, allowing for automated enforcement and evaluation within various stages of IT operations and development pipelines. This method leverages version control systems, automation tools, and continuous integration/continuous deployment (CI/CD) pipelines to ensure that policies governing security, compliance, resource usage, and access controls are consistently applied across the entire ecosystem.

*Built-in packs* bundle compliance policies that are easily extendable to speed up development and ensure best practices from day one.

---

## Module 16 - Advanced CI/CD - **Drift detection**

*Drift* refers to the phenomenon where the actual state of your infrastructure diverges from the expected or declared state as defined in your code. This can occur for various reasons, such as manual changes made directly to the infrastructure (outside of the IaC processes), external processes modifying the environment, or discrepancies in executing IaC scripts.

*Drift detection* refers to identifying discrepancies between the actual state of your infrastructure and its expected state as defined by your IaC configurations. This process is crucial for maintaining consistency, reliability, and security in cloud environments, where infrastructure components are dynamically provisioned and managed through code.

---

## Module 16 - Advanced CI/CD - **Reconciling** (cont'd)

### 📚 Concepts (cont.)

*Reconciling the infrastructure* Once a drift is detected, the next step is reconciling the infrastructure, which means resolving the delta between the actual and the intended state. Reconciliation can be approached in different ways, but two common approaches are updating the infrastructure to match the code or updating the code to reflect the detected changes.

Both drift detection and infrastructure reconciliation are fundamental to the practice of infrastructure as code, allowing teams to maintain control over their environments and ensure that their infrastructure remains in a known, good state.

---

## Module 16 - Advanced CI/CD - **Ephemeral infrastructure**

*Test in isolation* refers to the practice of testing components or units of an application without interference from other parts of the system.

*Pulumi Deployments Review Stacks* An ephemeral isolated Pulumi Stack to test your configurations.

---

## Module 16 - Advanced CI/CD - ✨ Summary

You introduced advanced elements to your continuous infrastructure pipeline to make it more robust. In particular, you:

- Added a Pulumi ESC environment to retrieve dynamic credentials for AWS;
- Added policy checks to test your infrastructure for compliance;
- Added a drift detection cron job to the pipeline; and
- Configured dedicated cloud environments with Review Stacks.

Questions?
