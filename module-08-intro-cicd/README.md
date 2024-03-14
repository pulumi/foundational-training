# Module 08 - Intro to CI/CD - 🌐 Overview

In this module, you will learn the fundamentals of an infrastructure CI/CD pipeline through guided exercises. You will be introduced to Pulumi, an infrastructure-as-code platform that provides modern cloud infrastructure using familiar programming languages.

This module introduces new users to DevOps best practices. You will become familiar with the core concepts needed to deploy cloud resources _continuously_. Walk through configuring Pulumi GitHub Actions to deploy AWS resources programmatically and accelerate your cloud projects with the skeleton code provided.

---

## Module 08 - Intro to CI/CD - 🎯 Learning Objectives

- The key components of a continuous pipeline
- How to build your own infrastructure CI/CD pipeline
- Configuring the Pulumi GitHub Actions to deploy AWS resources

--- 

## Module 08 - Intro to CI/CD - 📚 Concepts

An **infrastructure CI/CD pipeline** is a set of automated processes and tools designed to manage and deploy infrastructure as code (IaC) consistently, efficiently, and reliably. It's an essential part of modern DevOps practices and is used to streamline the provisioning and maintenance of infrastructure resources, such as servers, networks, and cloud services.

In other modules, you manually ran commands using the Pulumi CLI to get your application and cloud infrastructure running. In a DevOps fashion, however, you would deploy everything _programmatically_.

The three stages are:

1. Define Infrastructure as Code
2. Continuously Test+Commit
3. Continuously Build+Deploy

---

## Module 08 - Intro to CI/CD - 🎬 Steps

1. Create a new Pulumi program using the `static-website-aws-typescript` template.
1. Add version control, GitHub

With IaC and version control in place, we are one step closer to defining the infrastructure pipeline. As a next step, we need to add a trigger to run the IaC automatically. We'll use the [Pulumi GitHub Actions](https://github.com/pulumi/actions), responsible for instantiating the infrastructure and running the application.

2. Configure Pulumi GitHub Actions
  a. Add a secret, `PULUMI_ACCESS_TOKEN` to store your Pulumi access token to be used by Actions.
  b. Add your `aws` credentials.

---

## Module 08 - Intro to CI/CD - 🎬 Steps (cont.)

Next, you will configure the pipeline so it is triggered by commits to PR against the `main` branch. For each commit, the pipeline will automatically.

3. Add a `.github/workflows/branch.yaml` file
4. Navigate to the [branch.yml](./solution/.github/workflows/branch.yml) file to copy its contents
5. Commit all the changes as a PR
6. Navigate and inspect the Actions' results in your browser
7. Merge the PR

---

## Module 08 - Intro to CI/CD - 💡 Exercices

### 🎯 Goal

Practice enhancing the infrastructure CI/CD pipeline.

At this point, you have

- a GitHub repository with a sample web application;
- AWS resources using Pulumi IaC; and
- a CI/CD pipeline to test any change automatically.

---

## Module 08 - Intro to CI/CD - 💡 Exercices

- Excersice 1: Make an application change to print the current Unix time when visiting the `index.html` page.
- Excersice 2: Make an infrastructure change to deploy the application in another AWS region.
- Excersice 3: Make a pipeline change to destroy the `dev` stack upon successfully merging to the `main` branch.
- Excersice 4 (Advanced): Uses Pulumi ESC to connect to your AWS account via OIDC.
 
Note: The advanced workshop will cover Pulumi ESC in a lot more detail.

TIP: To see all the above solutions, check out the [🏁 solution](./solution/) folder.

---

## Module 08 - Intro to CI/CD - ✨ Summary

In this  module, you incrementally worked through creating an infrastructure CI/CD pipeline. In Part 1, you learned the Pulumi IaC programming model basics by developing and deploying a Pulumi template containing Amazon S3 and CloudFront resources. In Part 2, you added version control and a continuous test that deploys your infrastructure. You built your pipeline using GitHub Actions and modified it to validate commits using a Pulumi `dev` stack. You had hands-on experience across the three major elements of an infrastructure CI/CD pipeline. Lastly, Part 3 encouraged you to introduce a change to the application, infrastructure, or pipeline and watch changes be automatically applied.
