# Module 09: Policy as Code Exercises

## Authoring and Using Resource Policies

In this exercise, you will learn how to initialize policy packs, write a basic resource policy, and explore the various enforcement levels.

The `infra` directory contains a Pulumi program that contains some basic (contrived) infrastructure resources. You will validate these resources against company policies.

1. Initialize a new Pulumi policy pack based on the `aws-typescript` template:

    ```bash
    mkdir my-company-policy
    cd my-company-policy
    pulumi policy new aws-typescript
    ```

1. Change the name of the policy pack to something like `my-company-policy-${YOUR_NAME}`. (Pulumi policy packs don't contain the name in `PulumiPolicy.yaml`, similar to Pulumi IaC programs - the name of the pack is instead in the code itself.) Also remove the policy that comes with the template. Your code should look something like the following, assuming you are Bugs Bunny or similarly named:

    ```typescript
    new PolicyPack("my-company-policy-bugs-bunny", {
        policies: [],
    });
    ```

1. Add an `advisory` resource policy that ensures that all S3 buckets have a `Department` tag. (This example was covered in the slides, but you may want to try writing one from scratch.)
1. Run the policy pack against your infrastructure:

    ```bash
    cd ../infra
    # pulumi up will also work similarly, but will actually provision the 
    pulumi preview --policy-pack ../my-company-policy
    ```

1. Make the policy `disabled` and deploy the infrastructure (or just skip the `--policy-pack` flag) in order to deploy your non-compliant infrastructure:

    ```bash
    pulumi up --policy-pack ../my-company-policy
    ```

1. Pulumi policy packs work against resources that are already deployed. To see this in action, set the S3 bucket tagging rule to `mandatory` and run a Pulumi command again. It should fail (even on a preview):
1. Change the `aws.s3.Bucket` resource to comply with the policy and make the policy pass.
1. Now, change the tagging rule to `remediate` and write a `remediateResource` function for your tagging rule that adds the tag if it is missing.
1. Remove the `Department` tag from the bucket in your Pulumi program, and a `Owner` tag with value `bugs-bunny`. You'll use this to verify the correctness of your remediation rule.
1. Run your policy pack again. Your policy should pass because the remediation function will add the missing required tag. Note the diff created by the remediation function: Your function should _only_ add the `Department` tag and should not alter or remove the `Owner` tag.

## Authoring Stack Policies

TODO: Might come back to this later. Need more use cases.

## Using Compliance-Ready Policies

In this exercise, you'll learn how to

## Server-Side Policy Enforcement

## Discussion

- What are the most common needs for automated policy that you see in the field with customers? How would Pulumi Policy as Code fill this need? Where are the gaps?
- What integrations would you like to see for Pulumi Policy as Code?
- What additional features would be helpful within Pulumi Cloud for Policy as Code?
