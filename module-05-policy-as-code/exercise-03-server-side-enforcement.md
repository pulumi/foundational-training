# Exercise 03: Server-Side Policy Enforcement

In this exercise, you'll learn how to use Pulumi Cloud server-side enforcement of Pulumi Policy as Code to enable continuous compliance at scale.

1. **Pre-requisite:** This exercise requires (at the time of writing) a Pulumi Cloud organization on the Business Critical plan. You can create an organization on a temporary free trial in the Pulumi Cloud console. Pulumi will not ask you for payment information.

    Be sure to set your Pulumi default org if creating a new organization:

    ```bash
    pulumi org set-default your-org-name
    ```

1. Publish the compliance policies policy pack:

    ```bash
    cd compliance-ready-policies
    pulumi policy publish
    ```

    Depending on the organization you are in, you may have a name/version collision. Ask the instructor to help you resolve if you hit this issue.

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

## Optional: Exploring the Default Policy Group

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
    pulumi new aws-typescript -n module-07-policy-as-code-infra2-your-name
    ```

1. In the Pulumi Cloud console, locate the default policy group for your organization and add the two policy packs you published.
1. Run a Pulumi command against your stack:

    ```bash
    pulumi preview
    ```

    Notice how your stack is automatically included in the default policy group.
