# Exercise 03: Refactoring with Resource Aliases

In this exercise, you will learn how to refactor a monolithic Pulumi program into multiple programs while ensuring zero downtime using resource aliases. This is a common scenario in real-world applications where you need to split resources across different stacks without disrupting the running services.

## Overview

You will work with three Pulumi programs:

1. **Monolith**: A single program containing both shared resources and workload-specific resources
2. **Shared**: A program containing only shared resources (like an S3 bucket)
3. **Workload**: A program containing workload-specific resources (like a Lambda function)

The key technique you'll learn is how to use Pulumi's resource aliases to maintain the identity of resources when moving them between stacks, preventing unnecessary resource replacement.

## Step-by-Step Instructions

### Step 1: Deploy the Monolithic Stack

1. Navigate to the monolith directory:
   ```bash
   cd exercise-03-refactor-with-alias/monolith
   ```

2. Initialize a new stack:
   ```bash
   pulumi stack init dev
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Deploy the stack:
   ```bash
   pulumi up
   ```

5. Note the outputs, particularly the Lambda function ARN and the S3 bucket name.

### Step 2: Create the Shared Resources Stack

1. Navigate to the shared directory:
   ```bash
   cd ../shared
   ```

2. Initialize a new stack:
   ```bash
   pulumi stack init dev
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Deploy the stack:
   ```bash
   pulumi up
   ```

   This will create the S3 bucket that was previously in the monolith stack, but now as a standalone resource. The resource alias ensures that the existing bucket is adopted rather than replaced.

### Step 3: Create the Workload Stack with Resource Aliases

1. Navigate to the workload directory:
   ```bash
   cd ../workload
   ```

2. Initialize a new stack:
   ```bash
   pulumi stack init dev
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Update the stack reference in `__main__.py` to match your organization and project names:
   ```python
   # Replace "organization/project" with your actual organization and project names
   shared_stack = pulumi.StackReference("organization/project/shared-dev")
   ```

5. Deploy the stack:
   ```bash
   pulumi up
   ```

   This will create the Lambda function that references the S3 bucket from the shared stack. The Lambda function uses a resource alias to maintain the same identity as the one in the monolith stack.

### Step 4: Verify Zero-Downtime Migration

1. Check that the Lambda function in the workload stack has the same ARN as the one that was in the monolith stack:
   ```bash
   pulumi stack output lambda_arn --stack monolith-dev
   pulumi stack output lambda_arn --stack workload-dev
   ```

2. Invoke the Lambda function to verify it's still working:
   ```bash
   aws lambda invoke --function-name $(pulumi stack output lambda_name --stack workload-dev) output.txt
   cat output.txt
   ```

3. Destroy the monolith stack (the resources have been successfully migrated):
   ```bash
   cd ../monolith
   pulumi destroy
   ```

   You should see that Pulumi doesn't actually delete any resources, as they have been successfully transferred to the other stacks.

## Understanding Resource Aliases

Resource aliases in Pulumi allow you to change certain properties of a resource (like its name or parent in the resource hierarchy) without replacing the underlying cloud resource. This is crucial for zero-downtime migrations.

In this exercise, we use aliases to tell Pulumi that the Lambda function in the workload stack is the same resource as the one that was previously managed by the monolith stack. This prevents Pulumi from trying to create a new Lambda function and delete the old one.

The key code for this is in the workload's `__main__.py` file:

```python
function = lambda_.Function("my-function",
    # ... other properties ...
    opts=pulumi.ResourceOptions(
        aliases=[
            # This tells Pulumi that this resource was previously defined in the monolith stack
            pulumi.Alias(name="my-function", stack="organization/project/monolith-dev")
        ]
    ))
```

## Conclusion

By using resource aliases, you can safely refactor your Pulumi programs without causing downtime or resource replacement. This technique is especially valuable in production environments where you need to evolve your infrastructure organization without disrupting services.

## Clean Up

When you're done with the exercise, clean up the resources:

```bash
cd ../workload
pulumi destroy -y
cd ../shared
pulumi destroy -y
```