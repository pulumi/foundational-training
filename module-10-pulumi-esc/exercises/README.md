# Module 10 - Pulumi ESC - Exercises - 🎯 Goal

Obtain hands-on experience by CRUD'ing Pulumi ESC Environments.

---

## Module 10 - Pulumi ESC - Exercise 1 - [C]reate

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

## Module 10 - Pulumi ESC - Exercise 2 - [R]ead

- Create a Read Only ESC Team token to read everything** in `env_child`
- Use the token to Read the contents of `env_child` via:

  - Pulumi ESC CLI
  - Pulumi CLI
  - A Pulumi program

** Hint: Include imported ESC Environments

---

## Module 10 - Pulumi ESC - Exercise 3 - [U]pdate

This exercise assumes you have a dedicated AWS sandbox account. The exercise can be adapted otherwise as a single OIDC IdP allows up to 100 audiences.

- Update the `env_parent` with the AWS OIDC provider
- Update the `env_child` to read a secret from AWS Secrets Manager

To create necessary AWS resources in your AWS sandbox account feel free to use the instructor-provided Pulumi templates.

Test your Environment by opening it in the Pulumi Cloud console.

---

## Module 10 - Pulumi ESC - Exercise 4 - [D]elete

- Create a dummy ESC Environment as `delete_this`
- Create a Team with an ESC Token that can delete Environments
- Use the ESC CLI to delete the `delete_this` Environment.
- Find the audit logs for the above activity to confirm the proper Team token was used.
