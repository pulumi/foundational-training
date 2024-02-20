# Module 09: Policy as Code Exercises

**NOTE:** The exercises in this module are designed to be completed in order. Performing the exercises out of order may require changes to the steps to work.

## Exercise 01: Authoring and Using Resource Policies

In this exercise, you will initialize policy packs, write a basic resource policy, and explore the various enforcement levels.

The `infra` directory contains a Pulumi program that contains some basic (contrived) infrastructure resources. You will validate these resources against company policies.

1. Initialize a new Pulumi policy pack based on the `aws-typescript` template:

    ```bash
    mkdir my-company-policy
    cd my-company-policy
    pulumi policy new aws-typescript
    ```

1. Change the name of the policy pack to something like `my-company-policy-${YOUR_NAME}`. (Pulumi policy packs don't contain the name in `PulumiPolicy.yaml`, similar to Pulumi IaC programs - the name of the pack is instead in the code itself.) Also, remove the policy that comes with the template. Your code should look something like the following, assuming you are Bugs Bunny or similarly named:

    ```typescript
    new PolicyPack("my-company-policy-bugs-bunny", {
        policies: [],
    });
    ```

1. Add an `advisory` resource policy ensuring all S3 buckets have a `Department` tag. (This example was covered in the slides, but you may want to try writing one from scratch.)
1. Run the policy pack against your infrastructure:

    ```bash
    cd ../infra
    # pulumi up will also work similarly, but will actually provision the 
    pulumi preview --policy-pack ../my-company-policy
    ```

1. Make the policy `disabled` and deploy the infrastructure (or just skip the `--policy-pack` flag) to deploy your non-compliant infrastructure:

    ```bash
    pulumi up --policy-pack ../my-company-policy
    ```

1. Pulumi policy packs work against resources that are already deployed. To see this in action, set the S3 bucket tagging rule to `mandatory` and rerun a Pulumi command. It should fail (even on a preview):
1. Change the `aws.s3.Bucket` resource to comply with the policy and make the policy pass.
1. Now, change the tagging rule to `remediate` and write a `remediateResource` function for your tagging rule that adds the tag if it is missing.
1. Remove the `Department` tag from the bucket in your Pulumi program and an `Owner` tag with the value `bugs-bunny`. You'll use this to verify the correctness of your remediation rule.
1. Rerun your policy pack. Your policy should pass because the remediation function will add the missing required tag. Note the diff created by the remediation function: Your function should _only_ add the `Department` tag and should not alter or remove the `Owner` tag.

## Authoring Stack Policies

TODO: Might come back to this later. Need more use cases.

## Exercise 02: Using Compliance-Ready Policies

In this exercise, you'll use compliance-ready policies to ensure your resources comply with common frameworks like PCI-DSS, ISO 27001, etc.

1. Create a new compliance-ready policy pack:

    ```bash
    mkdir compliance-ready-policies
    cd compliance-ready-policies
    pulumi policy new
    ```

    Select the `aws-pcidss-compliance-policies-typescript` template from the list.

1. Change the name of the policy pack to `compliance-ready-policies-your-name`.
1. Change the generated selector so that all issues pertaining to the `ec2` are `mandatory`.
1. Add a selector that brings in all `pcidss` rules for the `s3` service as `advisory`.
1. Run the policy pack:

    ```bash
    pulumi preview --policy-pack ../compliance-ready-policies
    ```

    You should see advisory warnings on your S3 bucket for lack of cross-region replication and encryption and an error on your EC2 instance for having a public IP address.
1. Remediate the issues and re-run the policy pack.
1. You can run both sets, the compliance-ready policies and the policy pack you created earlier, by specifying the `--policy-pack` flag twice:

    ```bash
    pulumi preview --policy-pack ../my-company-policies --policy-pack ../compliance-ready-policies
    ```

## Exercise 03: Server-Side Policy Enforcement

In this exercise, you'll learn how to use Pulumi Cloud's server-side enforcement of Pulumi Policy as Code to enable continuous compliance at scale.

1. **Pre-requisite:** This exercise requires (at the time of writing) a Pulumi Cloud organization on the Business Critical plan.

    If you complete this training individually, you can create an organization on a temporary free trial in the Pulumi Cloud console. Pulumi will not ask you for payment information.

    If you complete this training in a training session, your instructor should supply you with a Pulumi organization.

    In either case, you should set your Pulumi default org:

    ```bash
    pulumi org set-default your-org-name
    ```

1. Publish the compliance policies policy pack:

    ```bash
    cd compliance-ready-policies
    pulumi policy publish
    ```

1. Publish your custom policy pack:

    ```bash
    cd ../my-company-policy
    pulumi policy publish
    ```

1. In the Pulumi Cloud console, create a Policy Group that includes both policy packs and the infrastructure stack.
1. Run a Pulumi command against your stack:

    ```bash
    cd ../infra
    pulumi preview
    ```

    Notice how the policy packs are run without specifying the `-`-policy-pack` flag.
1. Delete your policy group.

### Exploring the Default Policy Group

**Note:** Because Pulumi Cloud organizations can have only one default policy group, and that policy group automatically includes all stacks in the org, you may need to create a trial organization in the Pulumi Cloud console to complete this exercise. You can switch between Pulumi orgs with the following command:

```bash
pulumi org set-default your-org-name
```

1. If you are working in a new org, publish the policy packs you created earlier in this module to the new org:

    ```bash
    cd compliance-ready-policies
    pulumi policy publish
    cd ../my-company-policy
    pulumi policy publish
    ```

1. Create a new stack:

    ```bash
    cd ../infra2
    pulumi new aws-typescript -n module-09-policy-as-code-infra2-your-name
    ```

1. In the Pulumi Cloud console, locate the default policy group for your organization and add the two policy packs you published.
1. Run a Pulumi command against your stack:

    ```bash
    pulumi preview
    ```

    Notice how your stack is automatically included in the default policy group.

## Discussion Topics

- What are some use cases for stack policies?
- What are the most common needs for automated policy that you see in the field with customers? How would Pulumi Policy as Code fill this need? Where are the gaps?
- What integrations would you like to see for Pulumi Policy as Code?
- What additional features would be helpful within Pulumi Cloud for Policy as Code?
