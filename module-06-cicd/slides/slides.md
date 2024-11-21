---
theme: default
paginate: true
marp: true
---

# **Module 08: CI/CD**

---

# Pulumi CI/CD: Foundations

Infra CI/CD differs from application CI/CD b/c it's _stateful_

You have to see the code changes _in context with the infrastructure changes_ (i.e. `pulumi preview`) in order to properly review IaC code

MVP of a Pulumi pipeline:

1. `pulumi preview` on a PR open
1. `pulumi update` on a merge to the target branch

---

# Pulumi CI/CD: Integrations

- GitHub Action: <https://github.com/marketplace/actions/pulumi-cli-action>
- GitLab integration: <https://about.gitlab.com/blog/2024/01/10/managing-gitlab-resources-with-pulumi/>
- Anything else: `pulumi` is just a CLI...

---

# Pulumi CI/CD: Building on Foundations

1. Improve pipeline security posture
1. Add in policy as code
1. Drift detection
1. Ephemeral infra (Review Stacks)

---

# Pulumi CI/CD: Improve Security Posture w/ESC

- Use a team or org Pulumi Token with least priv (RBAC)
- Configure AWS OIDC to grab short-lived credentials
- Only keep the Pulumi Token in GitHub Secrets, no additional config needed
- Token can be generated with the Pulumi Cloud provider, written with the GH/GL provider

---

# Pulumi CI/CD: Policy as Code

## Advanced CI/CD - **Compliance**

- Add to the GitHub Actions pipeline via `policyPacks`
- Server-side enforcement via Policy Groups

---

# Drift: Stuff Happens

Drift may occur due to:

- Informed ClickOps (e.g., during an outage)
- Uninformed ClickOps (i.e., people not yet hip to the wonders of IaC)
- Out-of-band automated processes (e.g. tags applied to subnet by EKS)

---

# Drift Detection in CI/CD

Run `pulumi refresh --expect-no-changes` on a schedule:

- Errors out if drift detected
- Optionally, use a webhook to notify, e.g. Slack
- Pulumi Deployments excels here

Opinion: Do not automatically remediate drift. Alert and have a conversation (But it does need to be remediated eventually)

---

# Drift Remediation

- Informed ClickOps:
  - If permanent solution: update Pulumi code to match cloud state
  - If temporary solution: `pulumi up` to revert changes
- Uninformed ClickOps:
  - Refer the offender to a Pulumi workshop on YouTube _immediately_
  - Consider tagging, e.g. `managed-by: Pulumi` `repo: org/repo-name`
- Automated, out-of-band processes:
  - Use `resourceOptions.ignoreChanges`: <https://www.pulumi.com/docs/concepts/options/ignorechanges/>

---

# Review Stacks: Ephemeral infrastructure

Review Stacks are a Pulumi Deployments feature:

- Helpful when working on multiple feature branches
- Need to test in isolation
- Auto destroy once PR merges
