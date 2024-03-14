# Module 08 - Intro to CI/CD - 🌐 Overview

In this module, you will learn the fundamentals of an infrastructure CI/CD pipeline through guided exercises. You will be introduced to Pulumi, an infrastructure-as-code platform that provides modern cloud infrastructure using familiar programming languages.

This module introduces new users to DevOps best practices. You will become familiar with the core concepts needed to deploy cloud resources _continuously_. Walk through configuring Pulumi GitHub Actions to deploy AWS resources programmatically and accelerate your cloud projects with the skeleton code provided.

---

## Module 08 - Intro to CI/CD - 🎯 Learning Objectives

- The basics of the Pulumi programming model
- The key components of a continuous pipeline
- How to build your own infrastructure CI/CD pipeline
- Configuring the Pulumi GitHub Actions to deploy AWS resources

---

## Module 08 - Intro to CI/CD - **Part 1** Define IaC

### 📚 Concepts

The _Pulumi programming model_ is centered around defining infrastructure using familiar programming languages.

A _Pulumi template_ refers to a configuration and infrastructure-as-code (IaC) project created using the Pulumi programming model so that it may be easily reused. At Pulumi, we have curated a list of 100s of out-of-the-box templates for the most popular providers at <https://github.com/pulumi/templates>. These are directly integrated with the CLI via `pulumi new`. Users can also author your own templates.

---

## Module 08 - Intro to CI/CD - **Part 1** Define IaC

You will add cloud infrastructure to a Hello World web app so that it runs in an Amazon S3 with a CloudFront.

### 🎬 Steps

Note: The Pulumi program needs an empty directory. Often, this is a subfolder within your application's repository named something like 'infra'. However, because Pulumi templates are standalone full-working solutions, you'll see the app folder nested.

1. Create a new project folder
2. Use the `static-website-aws-typescript` Pulumi template
3. Explore the generated Pulumi program

---

## Module 08 - Intro to CI/CD - **Part 1** Define IaC

Each time you create a new Pulumi program, you'll see the following:

- `Pulumi.yaml` contains the project and top-level configuration settings.
- A `Pulumi.<stackName>.yaml` file for each stack within your program. This is the stack configuration file, e.g., `Pulumi.test.yaml`
- A language-specific Pulumi program entry point. This is `index.ts` in our example.
- Other language-specific package and dependency files.

---

## Module 08 - Intro to CI/CD - **Part 1** Define IaC

### 🎬 Steps (cont.)

4. Inspect your `dev` stack.

```bash
$ cat Pulumi.dev.yaml        
config:
  aws:region: us-west-2
  cicd-workshop:errorDocument: error.html
  cicd-workshop:indexDocument: index.html
  cicd-workshop:path: ./www
```

_Stacks_ are logical environments within your Pulumi project. Each stack can have its own configuration and resources. For example, you might have a development stack and a production stack within the same project.

Note the custom config settings we were prompted during the `pulumi new` are stored in the stack file.

---

## Module 08 - Intro to CI/CD - **Part 1** Define IaC

### 🎬 Steps (cont.)

5. Inspect the `index.ts` file to identify its key elements.

_Pulumi program entrypoint_: Your Pulumi program starts with an entry point, typically a function written in your chosen programming language. This function defines the infrastructure resources and configurations for your project.

**IMPORTANT** _Pulumi is declarative_: Pulumi allows you to define your desired infrastructure state using code in a declarative manner. In a declarative approach to infrastructure management, you **specify what you want** the infrastructure to look like, and the underlying system (Pulumi in this case) takes care of figuring out how to achieve that desired state.

---

## Module 08 - Intro to CI/CD - **Part 1** Define IaC

The key elements in the Pulumi program entry point file are defined below.

- **Providers** enable you to define and deploy resources in your target environment using familiar programming languages. There are over [150+ providers available](https://www.pulumi.com/registry/) that allow you to interact with and manage resources in a specific cloud or infrastructure environment, such as AWS, Azure, or Google Cloud.
- **Configurations** are used to manage different environments setting variables. These variables can be set via command-line arguments, environment variables, configuration files (e.g., `Pulumi.test.yaml`), or secrets. 
- **Resources** represent cloud components. You define resources using constructors specific to the cloud provider you're working with.
- **Outputs**  You can define outputs in your Pulumi program to expose information about your infrastructure. These outputs can be used for debugging, integration with other services, or to provide information to other parts of your application.


---

## Module 08 - Intro to CI/CD - **Part 1** Define IaC

### 🎬 Steps (cont.)

6. Deploy the Pulumi program 
7. Access the `originURL` Output to confirm your website is reachable
8. Clean up the resources

---

## Module 08 - Intro to CI/CD - **Part 2** Automatically deploy IaC

In [Part 1](#part-1-define-infrastructure-as-code), you manually ran commands using the Pulumi CLI to get your application and cloud infrastructure running. In a DevOps fashion, however, you would deploy everything _programmatically_.

### 🎯 Goal

Define and configure the three stages of an infrastructure CI/CD pipeline to deploy changes automatically.

--- 

## Module 08 - Intro to CI/CD - **Part 2** 📚 Concepts

An **infrastructure CI/CD pipeline** is a set of automated processes and tools designed to manage and deploy infrastructure as code (IaC) consistently, efficiently, and reliably. It's an essential part of modern DevOps practices and is used to streamline the provisioning and maintenance of infrastructure resources, such as servers, networks, and cloud services.

The three stages are:

1. Define Infrastructure as Code
2. Continuously Test+Commit
3. Continuously Build+Deploy

---

## Module 08 - Intro to CI/CD - **Part 2** Automatically deploy IaC

### 🎬 Steps

1. Add version control, GitHub

With IaC and version control in place, we are one step closer to defining the infrastructure pipeline. As a next step, we need to add a trigger to run the IaC automatically. We'll use the [Pulumi GitHub Actions](https://github.com/pulumi/actions), responsible for instantiating the infrastructure and running the application.

2. Configure Pulumi GitHub Actions
  a. Add a secret, `PULUMI_ACCESS_TOKEN` to store your Pulumi access token to be used by Actions.
  b. Add your `aws` credentials.

---

## Module 08 - Intro to CI/CD - **Part 2** Automatically deploy IaC

Next, you will configure the pipeline so it is triggered by commits to PR against the `main` branch. For each commit, the pipeline will automatically.

### 🎬 Steps (cont.)

3. Add a `.github/workflows/branch.yaml` file
4. Navigate to the [branch.yml](./solution/.github/workflows/branch.yml) file to copy its contents
5. Commit all the changes as a PR
6. Navigate and inspect the Actions' results in your browser
7. Merge the PR

---

## Module 08 - Intro to CI/CD - **Part 3** Automatically deploy IaC

### 🎯 Goal

Practice enhancing the infrastructure CI/CD pipeline.

At this point, you have

- a GitHub repository with a sample web application;
- AWS resources using Pulumi IaC; and
- a CI/CD pipeline to test any change automatically.

---

## Module 08 - Intro to CI/CD - **Part 3** Automatically deploy IaC

## 💡 Exercices

- Excersice 1: Make an application change to print the current Unix time when visiting the `index.html` page.
- Excersice 2: Make an infrastructure change to deploy the application in another AWS region.
- Excersice 3: Make a pipeline change to destroy the `dev` stack upon successfully merging to the `main` branch.
- Excersice 4 (Advanced): Uses Pulumi ESC to connect to your AWS account via OIDC.
 
Note: The advanced workshop will cover Pulumi ESC in a lot more detail.

TIP: To see all the above solutions, check out the [🏁 solution](./solution/) folder.

---

## Module 08 - Intro to CI/CD - ✨ Summary

In this  module, you incrementally worked through creating an infrastructure CI/CD pipeline. In Part 1, you learned the Pulumi IaC programming model basics by developing and deploying a Pulumi template containing Amazon S3 and CloudFront resources. In Part 2, you added version control and a continuous test that deploys your infrastructure. You built your pipeline using GitHub Actions and modified it to validate commits using a Pulumi `dev` stack. You had hands-on experience across the three major elements of an infrastructure CI/CD pipeline. Lastly, Part 3 encouraged you to introduce a change to the application, infrastructure, or pipeline and watch changes be automatically applied.
