# Module 16 - Advanced CI/CD - 🌐 Overview

In this module, you will learn advanced topics that make up a robust infrastructure CI/CD pipeline through guided exercises. You will use Pulumi tooling to take your cloud infrastructure pipeline one step closer to production.

This module introduces users to advanced DevOps best practices. You will add compliance checks via policies, drift detection, and isolated test environments to an existing GitHub Actions pipeline.

---

# Module 16 - Advanced CI/CD - 🎯 Learning Objectives

- Learn how to build an advanced CI pipeline to enforce compliance and correct drift.
- Add dynamic credentials to your stack by configuring Pulumi ESC.
- Add policy checks to test your infrastructure before each deployment.
- Add a cron job to the pipeline to check for changes periodically (drift)
- Configure a dedicated cloud environment with Review Stacks

---

## Module 08 - Advanced CI/CD - **Exercise 1** 

### 🎯 Goal

Set up your GitHub project with Pulumi ESC to authenticate using Dynamic Credentials with an AWS OIDC configuration.

---

## Module 08 - Advanced CI/CD - **Exercise 1** 

### 📚 Concepts

*Dynamic Credentials* Unlike static credentials, dynamic credentials are generated on the fly and have a short validity period, enhancing security by reducing the risk of unauthorized access from credential theft or misuse. It also eliminates the need for developers to manage the lifecycle of individual access keys for instances.

*OIDC* OpenID Connect (OIDC) is an authentication protocol built on the OAuth 2.0 framework. It enables clients to authenticate users confidently while supporting single sign-on (SSO) and other identity-related functionalities.

*Pulumi ESC* Pulumi ESC enables you to define environments that contain collections of secrets and configurations. Each environment can be composed of multiple environments. An environment may store dynamic credentials from an OIDC IdP, such as Pulumi Cloud, to connect to your AWS.

---

## Module 08 - Advanced CI/CD - **Exercise 1** 

### 🎬 Steps

1. Clone the Module 08 solution to your machine.
2. Add a GitHub Action secret to store your Pulumi access token as `PULUMI_ACCESS_TOKEN`
3. Use a Pulumi ESC Environment to configure AWS Dynamic Credentials.
4. Commit the changes by creating a feature branch and PR.

---

## Module 08 - Advanced CI/CD - **Exercise 2** 

### 🎯 Goal

Add compliance checks to the CI/CD pipeline using [Pulumi CrossGuard](https://www.pulumi.com/crossguard/).

---

## Module 08 - Advanced CI/CD - **Exercise 2** 

### 📚 Concepts

*Cloud compliance* refers to ensuring that cloud-based systems, services, and data storage adhere to relevant laws, regulations, standards, and best practices governing security, privacy, and data protection. 

*Policy as Code* involves codifying policy definitions, allowing for automated enforcement and evaluation within various stages of IT operations and development pipelines. This method leverages version control systems, automation tools, and continuous integration/continuous deployment (CI/CD) pipelines to ensure that policies governing security, compliance, resource usage, and access controls are consistently applied across the entire ecosystem.

*Built-in packs* bundle compliance policies that are easily extendable to speed up development and ensure best practices from day one.

---

## Module 08 - Advanced CI/CD - **Exercise 2** 

### 🎬 Steps

By adding a default policy pack, your workflow will automatically ensure your stack is not violating any cloud infrastructure best practices.

1. Add the CIS compliance framework, `aws-cis-compliance-policies-typescript`, under the `policypack/` subfolder.
2. Add dependencies
```bash
$ cd policypack
$ npm install @pulumi/policy @pulumi/compliance-policy-manager @pulumi/aws-compliance-policies
$ pulumi up
$ cd ../
```
3. Test locally, `pulumi up  --policy-pack policypack`
4. Add the CIS compliance framework to the pipeline.
5. Commit the changes by creating a feature branch and PR.

--- 

## Module 08 - Advanced CI/CD - **Exercise 3** 

### 🎯 Goal

Identify when a drift has occurred in their infrastructure via an Actions cronjob.

--- 

## Module 08 - Advanced CI/CD - **Exercise 3** 

### 📚 Concepts

*Drift* refers to the phenomenon where the actual state of your infrastructure diverges from the expected or declared state as defined in your code. This can occur for various reasons, such as manual changes made directly to the infrastructure (outside of the IaC processes), external processes modifying the environment, or discrepancies in executing IaC scripts.

*Drift detection* refers to identifying discrepancies between the actual state of your infrastructure and its expected state as defined by your IaC configurations. This process is crucial for maintaining consistency, reliability, and security in cloud environments, where infrastructure components are dynamically provisioned and managed through code.

--- 

## Module 08 - Advanced CI/CD - **Exercise 3** 

### 📚 Concepts (cont.)

*Reconciling the infrastructure* Once a drift is detected, the next step is reconciling the infrastructure, which means resolving the delta between the actual and the intended state. Reconciliation can be approached in different ways, but two common approaches are updating the infrastructure to match the code or updating the code to reflect the detected changes.

Both drift detection and infrastructure reconciliation are fundamental to the practice of infrastructure as code, allowing teams to maintain control over their environments and ensure that their infrastructure remains in a known, good state.

--- 

## Module 08 - Advanced CI/CD - **Exercise 3** 

### 🎬 Steps

1. Trigger the drift detection manually:
 a. In the console, add a tag to one of your Pulumi-defined AWS resources.
 b. Run `pulumi update --refresh -y`

2.  Add a cronjob to your workflow named `drift.yml` that runs every 5 minutes.

Hint: The cronjob does a preview with the `expect-no-changes: true` flag.

3. Commit the changes by creating a feature branch and PR.
4. Run the drift detection action from the browser.
5. Modify a resource's tag and re-run the action.

--- 

## Module 08 - Advanced CI/CD - **Exercise 4** 

### 🎯 Goal

Configure ephemeral dedicated cloud environments to deploy the infrastructure using Pulumi Deployments Review Stacks.

### 📚 Concepts

*Test in isolation* refers to the practice of testing components or units of an application without the interference from other parts of the system.

*Pulumi Deployments Review Stacks* An ephemeral isolated Pulumi Stack to test your IaC via a number of configurations.

--- 

## Module 08 - Advanced CI/CD - **Exercise 4** 

### 🎬 Steps

1. [Install the Pulumi GitHub App](https://www.pulumi.com/docs/using-pulumi/continuous-delivery/github-app/#installation-and-configuration)
2. Add Review Stack by using the given Pulumi template.

```bash 
# Ensure you're in the project, `cicd-workshop-advanced/infra`, directory

# Use a Pulumi template to configure your Review Stacks
$ pulumi new https://github.com/desteves/reviewstacks-typescript/infra --dir deployment-settings
# project name: cicd-workshop-advanced
# project description: (default)
# stack: deployment-settings
# repository: $owner/$repo ////// Your Advanced CI/CD Repo
# branch: /refs/heads/feature-rs
# repoDir: infra
# projectRef: cicd-workshop
# stackRef: test

# Create the Pulumi Deployments Review Stacks configuration
$ pulumi up --yes --cwd deployment-settings
# wait for the resource to get created; this can take a couple of seconds
```

3. Commit the changes by creating a feature branch and PR.

--- 

## Module 08 - Advanced CI/CD - ✨ Summary

You introduced advanced elements to your continuous infrastructure pipeline to make it more robust. In particular, you:
- Added a Pulumi ESC environment to retrieve dynamic credentials for AWS;
- Added policy checks to test your infrastructure for compliance;
- Added a drift detection cron job to the pipeline; and
- Configured dedicated cloud environments with Review Stacks.
