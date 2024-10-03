---
theme: default
paginate: true
header: "Pulumi ESC"
---
# Exercises - 🎯 Goal

Obtain hands-on experience by managing Pulumi ESC Environments:

- Use Environment inheritance
- Configure AWS OIDC
- Read a secret from AWS Secrets Manager
- Read Config values

---

## Exercise 1 - ESC Inheritance

Create two Pulumi ESC Environments such that

The `env_parent` Environment:

- Has a static value as `HELLO=world`
- Has a secret value as `BEST_NFL=<your_fav_NFL_team>`

The `env_child` Environment :

- Imports `env_parent` values
- Adds an `aws:region` value to be consumed by a Pulumi program**

Ensure you can open `env_child` in the Pulumi Cloud console. You'll test your work for correctness in the next exercise.

** **Hint:** Review the `pulumiConfig` ESC syntax.

---

## Exercise 2 - RBAC + Targets (CLI + Pulumi program)

- Create a Read Only ESC Team token to read everything** in `env_child`
- Use the token to Read the contents of `env_child` via:

  - Pulumi ESC CLI
  - Pulumi CLI
  - A Pulumi program

** Hint: Include imported ESC Environment(s)

---

## Exercise 3 - AWS OIDC + CLI

This exercise assumes you have a dedicated AWS sandbox account. The exercise can be adapted otherwise as a single OIDC IdP allows up to 100 audiences.

- Update the `env_parent` with AWS OIDC configuration

To create necessary AWS resources in your AWS sandbox account feel free to use the instructor-provided Pulumi template.

Test your Environment by running:

```bash
esc env open env_parent -- aws s3 ls
pulumi env open env_child
```

---

## Exercise 4 - AWS Secrets Manager + Pulumi program

- Update the `env_child` to read a secret from AWS Secrets Manager. Note, `env_child` should import `env_parent`.

To create necessary AWS resources in your AWS sandbox account feel free to use the instructor-provided Pulumi template.

Test your Environment by exporting the secret value as a `secretValue` Output in a Pulumi program. Then run,

```bash
pulumi stack output secretValue
```

Note: You'll need to update the IAM policy associated with the role to grant the necessary permissions (`secretsmanager:GetSecretValue`)

---

## Exercise 5 - RBAC and Auditing

- Create a dummy ESC Environment as `delete_this`
- Create a Team with a Team Token that can delete the `delete_this` Environment
- Using the above token, use the ESC CLI to delete the `delete_this` Environment.
- Find the audit logs for the above activity to confirm the proper Team token was used.
