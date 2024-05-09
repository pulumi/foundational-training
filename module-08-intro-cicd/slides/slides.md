# Module 08 - Intro to CI/CD - 🌐 Overview

This module introduces new users to DevOps/GitOps best practices. You will become familiar with the core concepts needed to deploy cloud resources _continuously_ by configuring Pulumi GitHub Actions.

You will also learn the fundamentals of an infrastructure CI/CD pipeline through guided exercises. You will be introduced to Pulumi to define cloud infrastructure using familiar programming languages.

---

## Module 08 - Intro to CI/CD - 🎯 Learning Objectives

- The key components of a continuous pipeline
- How to build your own infrastructure CI/CD pipeline
- Configuring the Pulumi GitHub Actions to deploy AWS resources

---

## Module 08 - Intro to CI/CD - 📚 Concepts

- **DevOps** streamline the software delivery process, accelerate the pace of development, and improve the quality and reliability of software deployments.
- **GitOps** leverages Git as the single source of truth for defining and managing infrastructure and application deployments. It extends the principles of DevOps by using Git repositories as the primary interface for managing infrastructure as code (IaC) and application configurations.

---

## Module 08 - Intro to CI/CD - 📚 Concepts (cont'd)

An **infrastructure CI/CD pipeline** is a set of automated processes and tools designed to manage and deploy (IaC) consistently, efficiently, and reliably. It's an essential part of modern DevOps practices and is used to streamline the provisioning and maintenance of infrastructure resources, such as servers, networks, and cloud services.

---

## Module 08 - Intro to CI/CD - 📚 Stages

In other modules, you manually ran commands using the Pulumi CLI to get your application and cloud infrastructure running. In a DevOps fashion, however, you would deploy everything _programmatically_.

The three stages of infra CI/CD are:

1. Define Infrastructure as Code
2. Continuously Test+Commit
3. Continuously Build+Deploy

## Module 08 - Intro to CI/CD - 📚 Stage 1

Define Infrastructure as Code

Why?: GitOps best practices
How?: Via **Pulumi**, CDK, CloudFormation, Terraform, etc.

Use-cases:

- Internal Developer Platforms / self-serve solutions,
- Tenant management for PaaS/SaaS customers
- Multi-Cloud/Multi-region Applications

---

## Module 08 - Intro to CI/CD - 📚 Stage 2

Continuously Test+Commit

Why?: Qualtiy
How?: Version control, trunk-based development
      Unit/Integration/E2E Testing
      Code linting / Static analysis for Vulns

Solutions:

- ESLint
- Snyk / OWASP
- Jenkins, Travis CI, or GitHub Actions
- Postman API testing

---

## Module 08 - Intro to CI/CD - 📚 Stage 3

Continuously Build+Deploy

Why? Time-to-market
How?: By automating builds for typically containarized applications

Solutions:

- Jenkins, Travis CI, CircleCI, and GitLab CI/CD
- Docker, Kubernetes, Ansible, and Makefiles
- Monitor/Alerting/Rollback integration

---

## Module 08 - Intro to CI/CD - ✨ Summary

We briefly discussed DevOps/GitOps and dived into each of the major components that make up an infra CI/CD pipeline. Head over to the exercises to obtain hands-on experience across the three major elements of an infrastructure CI/CD pipeline.
