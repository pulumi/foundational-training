# Exercise 03: Refactoring with Resource Aliases

## Objective

In this exercise, you will learn how to refactor a monolithic Pulumi program into multiple programs while ensuring zero downtime using resource aliases. This is a common scenario in real-world applications where you need to split resources across different stacks without disrupting the running services.

## Overview

You will work with three Pulumi programs:

1. **Monolith**: A single program containing both shared resources and workload-specific resources
2. **Shared**: A program containing only shared resources (like an S3 bucket)
3. **Workload**: A program containing workload-specific resources (like a Lambda function)

The key technique you'll learn is how to use Pulumi's resource aliases to maintain the identity of resources when moving them between stacks, preventing unnecessary resource replacement.

## Prerequisites

- Basic understanding of Pulumi concepts (resources, stacks, outputs)
- Python 3.6 or later
- AWS CLI configured with appropriate credentials
- Pulumi CLI installed

## Directory Structure

```
exercise-03-refactor-with-alias/
├── monolith/         # Original monolithic program
│   ├── Pulumi.yaml
│   └── __main__.py
├── shared/           # Shared resources program
│   ├── Pulumi.yaml
│   └── __main__.py
└── workload/         # Workload-specific program
    ├── Pulumi.yaml
    └── __main__.py
```

## Step-by-Step Instructions

### Step 1: Deploy the Monolithic Stack

1. Navigate to the monolith directory:
   ```bash
   cd monolith
   ```

2. Initialize a new stack:
   ```bash
   pulumi stack init dev
   ```

3. Deploy the stack:
   ```bash
   pulumi up
   ```

4. Note the outputs, particularly the Lambda function ARN and the S3 bucket name.

### Step 2: Create the Shared Resources Stack

1. Navigate to the shared directory:
   ```bash
   cd ../shared
   ```

2. Initialize a new stack:
   ```bash
   pulumi stack init dev
   ```

3. Deploy the stack:
   ```bash
   pulumi up
   ```

   This will create the S3 bucket that was previously in the monolith stack, but now as a standalone resource.

### Step 3: Create the Workload Stack with Resource Aliases

1. Navigate to the workload directory:
   ```bash
   cd ../workload
   ```

2. Initialize a new stack:
   ```bash
   pulumi stack init dev
   ```

3. Deploy the stack:
   ```bash
   pulumi up
   ```

   This will create the Lambda function that references the S3 bucket from the shared stack. The Lambda function uses a resource alias to maintain the same identity as the one in the monolith stack.

### Step 4: Verify Zero-Downtime Migration

1. Check that the Lambda function in the workload stack has the same ARN as the one that was in the monolith stack.

2. Invoke the Lambda function to verify it's still working:
   ```bash
   aws lambda invoke --function-name $(pulumi stack output lambda_name) output.txt
   cat output.txt
   ```

3. Destroy the monolith stack (the resources have been successfully migrated):
   ```bash
   cd ../monolith
   pulumi destroy
   ```

## Understanding Resource Aliases

Resource aliases in Pulumi allow you to change certain properties of a resource (like its name or parent in the resource hierarchy) without replacing the underlying cloud resource. This is crucial for zero-downtime migrations.

In this exercise, we use aliases to tell Pulumi that the Lambda function in the workload stack is the same resource as the one that was previously managed by the monolith stack. This prevents Pulumi from trying to create a new Lambda function and delete the old one.

The key code for this is in the workload's `__main__.py` file:

```python
from pulumi import ResourceOptions, StackReference, export
from pulumi_aws import lambda_

# Reference the shared stack
shared_stack = StackReference("organization/project/shared-dev")

# Get the S3 bucket name from the shared stack
bucket_name = shared_stack.get_output("bucket_name")

# Create the Lambda function with an alias to the one in the monolith stack
func = lambda_.Function("my-function",
    # ... other properties ...
    opts=ResourceOptions(
        aliases=[
            # This tells Pulumi that this resource was previously defined in the monolith stack
            {"parent": None, "name": "my-function", "stack": "organization/project/monolith-dev"}
        ]
    )
)

# Export the function name and ARN
export("lambda_name", func.name)
export("lambda_arn", func.arn)
```

## Conclusion

By using resource aliases, you can safely refactor your Pulumi programs without causing downtime or resource replacement. This technique is especially valuable in production environments where you need to evolve your infrastructure organization without disrupting services.