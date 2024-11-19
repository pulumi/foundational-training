# Exercise 03: Using Multiple Stacks

This exercise assumes you've broken the ECS on Fargate exercise into two separate programs in Exercise 02.

1. In the directory with the VPC, create a new stack:

    ```bash
    pulumi stack init prod
    ```

1. In the VPC program, template the name of the `awsx.ec2.Vpc` resource so that the name of the stack is the suffix to the name of the VPC resource.
1. Spin up both the `dev` and `prod` stacks:

    ```bash
    pulumi stack select dev && pulumi up -y
    pulumi stack select prod && pulumi up -y
    ```

1. Verify that the VPCs are correctly named in the AWS console.
1. Ensure that `dev` stack references the `dev` VPC and likewise for the `prod` stack by using `pulumi.getStack()` in your `pulumi.StackReference`.
1. Add a parameter to the VPC program on both the `dev` and `prod` stacks:

    ```bash
    pulumi stack select dev && pulumi stack config useLogs false
    pulumi stack select prod && pulumi stack config useLogs true
    ```

1. In the program, when the `useLogs` parameter is true, create a CloudWatch log group and have your ECS container log to the log group. (Be sure to look at the config value, not the current stack name as the latter is best practice.)

1. Spin up both the `dev` and `prod` stacks of the ECS program:

    ```bash
    pulumi stack select dev && pulumi up -y
    pulumi stack select prod && pulumi up -y
    ```

1. Verify that both stacks are up and running, then tear them down (both the VPCs and the Fargate workloads):

    ```bash
    pulumi stack select dev && pulumi destroy -y
    pulumi stack select prod && pulumi destroy -y
    ```
