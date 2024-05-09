# Module 08 - Intro to CI/CD - 💡 Exercices

## Module 08 - Intro to CI/CD - 🎯 Goal

To obtain hands-on practice with infrastructure CI/CD pipelines

Create:

- a GitHub repository with a sample web application;
- AWS resources using Pulumi IaC; and
- a CI/CD pipeline to test any change automatically.

---

## Module 08 - Intro to CI/CD - **Exercise 1**

1. Create a new Pulumi program using the `static-website-aws-typescript` template.
2. Add GitHub for version control
  With IaC and version control in place, we are one step closer to defining the infrastructure pipeline. As a next step, we need to add a trigger to run the IaC automatically. We'll use the [Pulumi GitHub Actions](https://github.com/pulumi/actions), responsible for instantiating the infrastructure and running the application.
3. Configure Pulumi GitHub Actions
  a. Add a secret, `PULUMI_ACCESS_TOKEN` to store your Pulumi access token to be used by Actions.
  b. Add your `aws` credentials.

---

## Module 08 - Intro to CI/CD - **Exercise 2**

Next, configure the pipeline so it is triggered by commits to PR against the `main` branch.

1. Add a `.github/workflows/branch.yaml` file
2. Navigate to the [branch.yml](./solution/.github/workflows/branch.yml) file to copy its contents
3. Commit all the changes as a PR
4. Navigate and inspect the Actions' results in your browser
5. Merge the PR

---

## Module 08 - Intro to CI/CD - **Exercise 3**

Pick at least 2 of the following:

- Make an application change to print the current Unix time when visiting the `index.html` page.
- Make an infrastructure change to deploy the application in another AWS region.
- Make a pipeline change to destroy the `dev` stack upon successfully merging to the `main` branch.
- (Advanced): Use Pulumi ESC to connect to your AWS account via OIDC.

Note: The advanced workshop will cover Pulumi ESC in a lot more detail.
