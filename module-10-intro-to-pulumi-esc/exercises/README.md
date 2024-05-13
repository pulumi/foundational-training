# Module 10 - Intro to Pulumi ESC - Exercises

Goal:

- To obtain hands-on experience by CRUD'ing Pulumi ESC Environments.

---

## Module 10 - Intro to Pulumi ESC - Exercise 1 - [C]reate

Create two Pulumi ESC Environments such that

The `env_parent` Environment:

- Has a static value as `HELLO=world`
- Has a secret value as `BEST_NFL=<your_fav_NFL_team>`

The `env_child` Environment :

- Imports `env_parent` values
- Adds an `aws:region` value to be consumed by a Pulumi program**

** Hint: take a look at the ESC `pulumiConfig` syntax

---

## Module 10 - Intro to Pulumi ESC - Exercise 2 - [R]ead

- Create a Read Only ESC Team token to read everything** in `env_child`
- Use the token to Read the contents of `env_child` via:

  - Pulumi ESC CLI
  - Pulumi CLI
  - A Pulumi program

** Hint: Inlcuding imported values

---

## Module 10 - Intro to Pulumi ESC - Exercise 3 - [U]pdate

Update the `env_parent` with AWS OIDC integration
Update the `env_child` to read a secret from AWS Secrets Manager

(Create necessary resources in AWS)

Test your Environment by Opening the Env + toggle "Show secrets" in Pulumi Cloud

---

## Module 10 - Intro to Pulumi ESC - Exercise 4 - [D]elete

- Create a dummy ESC Environment as `delete_this`
- Create a Team with an ESC Token that can Delete environments
- Use the ESC CLI to delete the `delete_this` Environment. Make sure to use the proper token.
- Find the audit logs for the above activity
