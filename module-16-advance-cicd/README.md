# Advanced CI/CD for AWS using Pulumi and GitHub Actions

Last revision: February 2024.

> [!IMPORTANT]  
> This is an advanced workshop that builds upon the [Getting Started workshop](../aws-getting-started-cicd/). Please make sure it's finished before proceeding.

In this workshop, you will learn advanced topics that make up a robust infrastructure CI/CD pipeline through guided exercises. You will use Pulumi tooling to take your cloud infrastructure pipeline one step closer to production.

This workshop introduces users to advanced DevOps best practices. You will add compliance checks via policies, drift detection, and isolated test environments to an existing GitHub Actions pipeline. This will help accelerate your AWS projects with the code examples provided.

## Learning Objectives

- Learn how to build an advanced CI pipeline to enforce compliance and correct drift.
- Add dynamic credentials to your stack by configuring Pulumi ESC.
- Add policy checks to test your infrastructure before each deployment.
- Add a cron job to the pipeline to check for changes periodically (drift)
- Configure a dedicated cloud environment with Review Stacks

## Table of Contents 

<!-- https://derlin.github.io/bitdowntoc/ -->
* [🧰 Prerequisites](#-prerequisites)
* [**Part 1** Set up your GitHub project with Pulumi ESC](#part-1-set-up-your-github-project-with-pulumi-esc)
  + [🎯 Goal](#-goal)
  + [📚 Concepts](#-concepts)
  + [🎬 Steps](#-steps)
* [**Part 2** Add compliance with Policy as Code](#part-2-add-compliance-with-policy-as-code)
  + [🎯 Goal](#-goal-1)
  + [📚 Concepts](#-concepts-1)
  + [🎬 Steps](#-steps-1)
* [**Part 3** Add drift detection](#part-3-add-drift-detection)
  + [🎯 Goal](#-goal-2)
  + [📚 Concepts](#-concepts-2)
  + [🎬 Steps](#-steps-2)
* [**Part 4** Add dedicated environments with Review Stacks](#part-4-add-dedicated-environments-with-review-stacks)
  + [🎯 Goal](#-goal-3)
  + [📚 Concepts](#-concepts-3)
  + [🎬 Steps](#-steps-3)
* [✨ Summary](#-summary)
* [🚀 Next steps](#-next-steps)

## 🧰 Prerequisites

To go through this workshop with us, here is what you need:

### Pulumi

1. A Pulumi Cloud account, head to [app.pulumi.com](https://app.pulumi.com/signup/?utm_source=da&utm_medium=referral&utm_campaign=workshops&utm_content=ced-fall2022-workshops) and follow the sign-up process.
2. An [access token](https://www.pulumi.com/docs/intro/pulumi-service/accounts/#access-tokens?utm_source=da&utm_medium=referral&utm_campaign=workshops&utm_content=ced-fall2022-workshops) from your Pulumi Cloud account.
3. The [Pulumi CLI]((https://www.pulumi.com/docs/get-started/install/?utm_source=da&utm_medium=referral&utm_campaign=workshops&utm_content=ced-fall2022-workshops)) is installed in your development environment.

### GitHub

1. A [GitHub](https://github.com/join) account.
2. The [GitHub CLI](https://cli.github.com/), [`gh`](https://cli.github.com/) is installed in your development environment.
3. [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) is installed in your development environment.

### AWS

1. The [`aws` CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) is installed in your development environment.
2. [Set up your local AWS credentials](https://www.pulumi.com/registry/packages/aws/installation-configuration/#credentials).


[**Click here to jump back to the Table of Contents**](#table-of-contents)

## **Part 1** Set up your GitHub project with Pulumi ESC

This workshop picks up right where the [Getting Started](../aws-getting-started-cicd/) workshop left off, so we'll start with a sample application and a basic pipeline.

### 🎯 Goal

Attendees will be able to authenticate using Dynamic Credentials by adding a Pulumi ESC Environment with an AWS OIDC configuration.

### 📚 Concepts

*Dynamic Credentials* Unlike static credentials, which remain constant over time, dynamic credentials are generated on-the-fly and have a short validity period, enhancing security by reducing the risk of unauthorized access from credential theft or misuse. It also eliminates the need for developers to manage the lifecycle of individual access keys for instances.

*OIDC* OpenID Connect (OIDC) is an authentication protocol built on top of the OAuth 2.0 framework. enables clients to authenticate users with a high degree of confidence while supporting single sign-on (SSO) and other identity-related functionalities such 

*Pulumi ESC* Pulumi ESC enables you to define environments, which contain collections of secrets and configuration. Each environment can be composed from multiple environments. An environment may be used to store dynamic credentials from an OIDC IdP such as Pulumi Cloud to connect to your AWS.


### 🎬 Steps

✅ Clone the CI/CD Getting Started workshop solution located at `TODO` to your machine.
✅ Add a GitHub Action secret to store your Pulumi access token as `PULUMI_ACCESS_TOKEN`
✅ Use a Pulumi ESC Environment to configure AWS Dynamic Credentials.
✅ Commit the changes by creating a feature branch and PR.

[**Click here to jump back to the Table of Contents**](#table-of-contents)

## **Part 2** Add compliance with Policy as Code

### 🎯 Goal

Attendees will be able to add compliance checks to the CI/CD pipeline using [Pulumi CrossGuard](https://www.pulumi.com/crossguard/).

### 📚 Concepts

*Cloud compliance* refers to the process of ensuring that cloud-based systems, services, and data storage adhere to relevant laws, regulations, standards, and best practices governing security, privacy, and data protection. 

*Policy as Code* involves codifying policy definitions, which allows for their automated enforcement and evaluation within various stages of IT operations and development pipelines. This method leverages version control systems, automation tools, and continuous integration/continuous deployment (CI/CD) pipelines to ensure that policies governing security, compliance, resource usage, and access controls are consistently applied across the entire ecosystem.

*Built-in packs* bundle compliance policies that are easily extendable with the aim to speed up development and ensure best practices from day one.

### 🎬 Steps

By adding a default policy pack, your workflow will automatically ensure your stack is not violating any cloud infrastructure best practices.

✅ Add the CIS compliance framework
<details>
    <summary>🧩 Click here for a hint </summary>
```bash
# Ensure you're in the project, `cicd-workshop-advanced/infra`, directory

# Add the policy under the policypack/ folder
$ pulumi policy new aws-cis-compliance-policies-typescript  --dir policypack

# Add deps for GHA
$ cd policypack
$ npm install @pulumi/policy @pulumi/compliance-policy-manager @pulumi/aws-compliance-policies
$ pulumi up
$ cd ../

# Test locally 
$ pulumi up  --policy-pack policypack 
# Policies:
#    ✅ aws-cis-compliance-ready-policies-typescript@v0.0.1 (local: policypack)

```

</details>
✅ Add the CIS compliance framework
# Modify the workflow file to test programmatically
$ vi .github/workflows/branch.yml
#   edit the last step as shown below
#   save the file.
```
</details>
`branch.yml` code snippet:
```yaml
      - name: Install PaC Dependencies
        working-directory: ./infra/policypack
        run: npm install

      - name: Preview the resources
        uses: pulumi/actions@v5
        with:
          command: preview
          stack-name: zephyr/cicd-workshop/test # UPDATE THIS
          work-dir: ./infra
          policyPacks: policypack
        env:
          PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}
```

<!-- Note to presenter: run pulumi up ahead to save time. -->

✅ Commit the changes by creating a feature branch and PR.

[**Click here to jump back to the Table of Contents**](#table-of-contents)

## **Part 3** Add drift detection

### 🎯 Goal

Attendees will be able to programmatically identify when a drift has occurred in their infrastructure via an Actions cronjob.

### 📚 Concepts

*Drift* refers to the phenomenon where the actual state of your infrastructure diverges from the expected or declared state as defined in your code. This can occur for a variety of reasons, such as manual changes made directly to the infrastructure (outside of the IaC processes), external processes modifying the environment, or discrepancies in the execution of IaC scripts.

*Drift detection* refers to the process of identifying discrepancies between the actual state of your infrastructure and its expected state as defined by your IaC configurations. This process is crucial for maintaining consistency, reliability, and security in cloud environments, where infrastructure components are dynamically provisioned and managed through code.

*Reconciling the infrastructure* Once drift is detected, the next step is to reconcile the infrastructure, which means resolving the differences between the actual state and the intended state. Reconciliation can be approached in different ways but two common approaches are to update the infrastructure to match the code or update the code to reflect the detected changes.

Both drift detection and infrastructure reconciliation are fundamental to the practice of infrastructure as code, allowing teams to maintain control over their environments and ensure that their infrastructure remains in a known, good state.

### 🎬 Steps

✅ Trigger the drift detection manually

In one terminal run

```bash
# TODO
pulumi update --refresh -y
```

In another terminal, run

```bash

# TODO
```

✅  Add a cronjob to your workflow named `drift.yml` that runs every 5 minutes.

Hint: 
 The cronjob does a preview with the `expect-no-changes: true`
More Hint:

Alternatively, navigate to the [drift.yml](./solution/.github/workflows/drift.yml) file to copy its contents.

✅ Commit the changes by creating a feature branch and PR.
✅ Run the drift detection action from the browser.


<!-- https://github.com/desteves/cicd-workshop-advanced/actions/workflows/drift.yml-->

## **Part 4** Add dedicated environments with Review Stacks

### 🎯 Goal

Attendees will be able to configure ephemeral dedicated cloud environments to deploy the infrastructure using Pulumi Deployments Review Stacks.

### 📚 Concepts

*Test in isolation* refers to the practice of testing components or units of an application without the interference from other parts of the system.

*Pulumi Deployments Review Stacks* An ephemeral isolated Pulumi Stack to test your IaC via a number of configurations.

### 🎬 Steps

✅ [Install the Pulumi GitHub App](https://www.pulumi.com/docs/using-pulumi/continuous-delivery/github-app/#installation-and-configuration)

Check your repository has been added to the access list https://github.com/settings/installations/46735415

✅ Add Review Stack.

```bash 
# Ensure you're in the project, `cicd-workshop-advanced/infra`, directory

# Re-use these values from Part 1
$ owner=desteves 
$ repo=cicd-workshop-advanced

# Use a Pulumi template to configure your Review Stacks
$ pulumi new https://github.com/desteves/reviewstacks-typescript/infra --dir deployment-settings
# project name: cicd-workshop-advanced
# project description: (default)
# stack: deployment-settings
#
# repository: $owner/$repo
# branch: /refs/heads/feature-rs
# repoDir: infra
# projectRef: cicd-workshop
# stackRef: test

# Create the Pulumi Deployments Review Stacks configuration
$ pulumi up --yes --cwd deployment-settings
# wait for the resource to get created; this can take a couple of seconds
```

✅ Commit the changes by creating a feature branch and PR.

[**Click here to jump back to the Table of Contents**](#table-of-contents)

## ✨ Summary

You introduced advanced elements to your continuous infrastructure pipeline to make it more robust. In particular, you:
- Added a Pulumi ESC environment to retrieve dynamic credentials for AWS;
- Added policy checks to test your infrastructure for compliance;
- Added a drift detection cron job to the pipeline; and
- Configured dedicated cloud environments with Review Stacks.

## 🚀 Next steps

At this point, you have completed this workshop. You have 
- a GitHub repository with a sample application; 
- AWS resources using Pulumi IaC; and
- a robust cloud infrastructure CI/CD pipeline to test any change automatically. 

We encourage you to modify your app or infra and watch the changes be tested programmatically. Possible changes:

- Deploy your application in two regions
- Add a new AWS policy

[**Click here to jump back to the Table of Contents**](#table-of-contents)