# Module 11 - Advanced CI/CD - 🌐 Overview

In this module, you will learn advanced topics that make up a robust infrastructure CI/CD pipeline through guided exercises. You will use Pulumi tooling to introduce production features to an infra CI/CD pipeline.

- Dynamic Credentials
- Compliance Checks
- Drift detection/remediation
- Ephemeral infrastructure

---

## Advanced CI/CD - **Credentials**

- The infra CI/CD pipeline should use short-term credentials for the cloud access
- Leverage **Pulumi ESC** to configure AWS OIDC
- Pulumi Token should be RBAC'ed
- Can be added via `github.ActionsEnvironmentSecret` GH Provider
- Only keep the Pulumi Token in the GitHub Repo

---

## Advanced CI/CD - **Compliance**

- Use Pulumi CrossGuard - Policy as Code
- Start with an existing Policy pack, and modify
- Add to the GitHub Actions pipeline via `policyPacks`
- Server-side enforcement via Policy Groups

---

## Advanced CI/CD - **Drift**

- Infra changes out-of-band due to:
  - Disaster Recovery steps still use ClickOps
  - An outage or partition
  - Time-sensitive critical fixes

- **Drift detection**

  `pulumi refresh --expect-no-changes`

---

## Advanced CI/CD - **Reconciling**

Option 1: Bring cloud changes into your Pulumi state

- `pulumi refresh`
- You need to update your Pulumi program to match the state before the next up/preview run.

Option 2: Revert cloud changes to match the Pulumi state

- `pulumi up`

**The above commands and parameters are available in the [Github Pulumi Action](https://github.com/marketplace/actions/pulumi-cli-action)**

---

## Advanced CI/CD - **Ephemeral infrastructure**

- Helpful when working on multiple feature branches
- Need to test in isolation
- Use **Pulumi Deployments Review Stacks**
- Auto destroy once PR merges

---

## Advanced CI/CD - ✨ Summary

You were introduced to various production needs of an infrastructure pipeline. Head over to the exercises to obtain hands-on practice for each.

Questions?
