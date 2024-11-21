# Exercise 02: Using Compliance-Ready Policies

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
1. Run the policy pack:

    ```bash
    # from the infra/ directory, run 
    pulumi preview --policy-pack ../compliance-ready-policies
    ```

    You should see an error on your EC2 instance for having a public IP address.

1. Remediate the issue on your EC2 instance by setting `associatePublicIpAddress` to `false`. (It must be `false` because if the value is undefined the instance will have a public IP if deployed into a public subnet.) Re-run the policy pack:

    ```bash
    pulumi preview --policy-pack ../compliance-ready-policies
    ```

    The policy should pass.

1. You can run both sets, the compliance-ready policies and the policy pack you created earlier, by specifying the `--policy-pack` flag twice:

    ```bash
    pulumi preview --policy-pack ../my-company-policies --policy-pack ../compliance-ready-policies
    ```
