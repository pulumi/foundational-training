# Module 16 - Advanced CI/CD - 🌐 Overview

## 🎯 Goals

- Add a Pulumi ESC environment to retrieve dynamic credentials for AWS;
- Add policy checks to test your infrastructure for compliance;
- Add a drift detection cron job to the pipeline; and
- Configure dedicated cloud environments with Review Stacks.

---

## Module 16 - Advanced CI/CD - **Exercise 1**

**🎯 Goal**: Set up your GitHub project with Pulumi ESC to authenticate using Dynamic Credentials with an AWS OIDC configuration.

**🎬 Steps**:

1. Clone the Module 08 solution to your machine.
2. Add a GitHub Action secret to store your Pulumi access token as `PULUMI_ACCESS_TOKEN`
3. Use a Pulumi ESC Environment to configure AWS Dynamic Credentials.
4. Commit the changes by creating a feature branch and PR.

---

## Module 16 - Advanced CI/CD - **Exercise 2**

**🎯 Goal**: By adding a default policy pack, your workflow will automatically ensure your stack is not violating any cloud infrastructure best practices. You'll add compliance checks to the CI/CD pipeline using [Pulumi CrossGuard](https://www.pulumi.com/crossguard/).

**🎬 Steps**:

1. Add the CIS compliance framework, `aws-cis-compliance-policies-typescript`, under the `policy/` subfolder.
2. Test locally, `pulumi up  --policy-pack policy`
3. Add the CIS compliance framework to the pipeline.
4. Commit the changes by creating a feature branch and PR.

---

## Module 16 - Advanced CI/CD - **Exercise 3**

**🎯 Goal**: Identify when a drift has occurred in their infrastructure via an Actions cronjob.
**🎬 Steps**:

1. Trigger the drift detection manually:
 a. In the console, add a tag to one of your Pulumi-defined AWS resources.
 b. Run `pulumi update --refresh -y`
2. Add a cronjob to your workflow named `drift.yml` that runs every 5 minutes.
    Hint: The cronjob does a preview with the `expect-no-changes: true` flag.
3. Commit the changes by creating a feature branch and PR.
4. Run the drift detection action from the browser.
5. Modify a resource's tag and re-run the action.

---

## Module 16 - Advanced CI/CD - **Exercise 4**

**🎯 Goal**: Configure ephemeral environments using Pulumi Deployments Review Stacks.

**🎬 Steps**:

1. [Install the Pulumi GitHub App](https://www.pulumi.com/docs/using-pulumi/continuous-delivery/github-app/#installation-and-configuration)
2. Add Review Stack by using the given Pulumi template.

    ```bash
    # Ensure you're in the project, `cicd-workshop-advanced/infra`, directory

    # Use a Pulumi template to configure your Review Stacks
    $ pulumi new https://github.com/desteves/reviewstacks-typescript/infra --dir deployment-settings
    # project name: cicd-workshop-advanced
    # project description: (default)
    # stack: deployment-settings
    # repository: $owner/$repo ////// Your Advanced CI/CD Repo
    # branch: /refs/heads/feature-rs
    # repoDir: infra
    # projectRef: cicd-workshop
    # stackRef: test

    # Create the Pulumi Deployments Review Stacks configuration
    $ pulumi up --yes --cwd deployment-settings
    # wait for the resource to get created; this can take a couple of seconds
    ```

3. Commit the changes by creating a feature branch and PR.
