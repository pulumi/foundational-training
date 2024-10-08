# Exercise 01: Authoring and Using Resource Policies

In this exercise, you will initialize policy packs, write a basic resource policy, and explore the various enforcement levels.

The `infra` directory contains a Pulumi program that contains some basic (contrived) infrastructure resources. You will validate these resources against company policies.

1. Initialize a new Pulumi policy pack based on the `aws-typescript` template:

    ```bash
    # Ensure you are in the /exercises directory
    pulumi policy new aws-typescript --dir my-company-policy
    # wait for dependencies to download
    cd my-company-policy
    ```

1. In the `index.ts` file, change the name of the policy pack to something like `my-company-policy-${YOUR_NAME}`. (Pulumi policy packs don't contain the name in `PulumiPolicy.yaml`, similar to Pulumi IaC programs - the pack's name is in the code.) Also, remove the policy that comes with the template. Your code should look something like the following, assuming you are Bugs Bunny or similarly named:

    ```typescript
    new PolicyPack("my-company-policy-bugs-bunny", {
        policies: [],
    });
    ```

1. Add an `advisory` resource policy ensuring all S3 buckets have a `Department` tag. Note that you will need to check whether `tags` is defined at all (it will be `undefined` in TS or `None` in Python) if no tags are defined before verifying whether the `Department` tags is defined.
1. Run the policy pack against your infrastructure:

    ```bash
    cd ../infra
    # pulumi up will also work similarly, but will actually provision the resources
    pulumi preview --policy-pack ../my-company-policy
    ```

1. Make the policy `disabled` and deploy the infrastructure (or just skip the `--policy-pack` flag) to deploy your non-compliant infrastructure:

    ```bash
    pulumi up --policy-pack ../my-company-policy --yes
    # or
    pulumi up --yes
    ```

1. Pulumi policy packs work against resources that are already deployed. To see this in action, set the S3 bucket tagging rule to `mandatory` and rerun a Pulumi command. It should fail (even on a preview).
1. Change the `aws.s3.Bucket` resource to comply with the policy and make the policy pass.
1. Now, change the tagging rule to `remediate` and write a `remediateResource` function for your tagging rule that adds the tag if it is missing. Hint: Update your imports to include `remediateResourceOfType`
1. Remove the `Department` tag from the bucket in your Pulumi program and add an `Owner` tag with the value `bugs-bunny`. You'll use this to verify the correctness of your remediation rule.
1. Rerun your policy pack. Your policy should pass because the remediation function will add the missing required tag. Note the diff created by the remediation function: Your function should _only_ add the `Department` tag and should not alter or remove the `Owner` tag.
