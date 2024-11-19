# Exercise 02: Refactoring to multiple programs

In this exercise, you will start with a single program that contains a VPC, and all the resources needed to run NGINX an ECS on Fargate workload in the VPC. This approach is fine for a simple scenario, but in more real-world scenarios with multiple workloads running in the same VPC, you'll likely want to re-use shared resources like the VPC and ALB in order to control for costs or to account for differing team ownership.

1. Spin up the ECS on Fargate stack from module 01. If you were unable to complete the exercise, ask an instructor for help:

   ```bash
   cd <monolithic-stack-dir>
   pulumi up
   ```

   From here, you'll break this stack into 2 stacks: one for resources that could be shared among workloads, and one stack that contains the NGINX workload.

1. Initialize a new Pulumi program to which you will move the non-shared resources for the NGINX workload:

   ```bash
   cd ../
   mkdir fargate-workloads
   pulumi new typescript # or python
   # Complete all the prompts
   ```

1. Move the workload-specific resources to the new Pulumi program:

   - Add stack outputs to the program containing the shared resources as needed. Your stack outputs should be in alignment with the best practices you were taught earlier in the session.
   - Use a `pulumi.StackReference` in the program containing the workload resources.

1. Run `pulumi up` on the original, monolithic stack. This will delete the NGINX workload from the stack and make the stack outputs available to the new workload stack.
1. Run `pulumi up` on the workload stack. Verify that the workload is up and running:

   ```bash
   curl $(pulumi stack output nginxUrl)
   ```

1. Tear down all the infrastructure in this exercise, but keep the code broken into separate programs for Exercise 03.

For an extra challenge, re-attempt the exercise by moving the workload resources _without deleting the running NGINX workload_ by using the `pulumi import` command. (We generally recommend spinning up new infrastructure and transitioning workloads over to it, but this is not always possible.)
