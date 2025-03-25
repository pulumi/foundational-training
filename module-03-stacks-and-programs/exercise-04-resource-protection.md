# Exercise 04: Resource Protection

In this exercise, you will learn how to use Pulumi's resource protection feature to prevent accidental deletion of critical infrastructure resources. This is particularly important for production environments where resource deletion could cause significant disruption.

## Overview

You will create a simple Pulumi program that provisions an S3 bucket, and then configure resource protection differently based on the stack environment:

- **Development Stack**: Resources will not be protected, allowing for easy cleanup during development
- **Production Stack**: Resources will be protected, preventing accidental deletion

This exercise demonstrates a common pattern where protection is applied conditionally based on the environment, providing an additional safety layer for production resources.

## Step-by-Step Instructions

### Step 1: Create a New Pulumi Project

1. Create a new directory for this exercise:
   ```bash
   mkdir -p exercise-04-resource-protection
   cd exercise-04-resource-protection
   ```

2. Initialize a new Pulumi project:
   ```bash
   pulumi new python # or typescript/javascript if you prefer
   # Complete the prompts with appropriate values
   ```

### Step 2: Create the S3 Bucket Resource

1. Replace the contents of `__main__.py` (or equivalent file for your language) with the following code:

   ```python
   import pulumi
   import pulumi_aws as aws

   # Get the current stack name
   stack_name = pulumi.get_stack()
   
   # Create configuration with default values
   config = pulumi.Config()
   enable_protection = config.get_bool("enableProtection") or False
   
   # Create a unique bucket name based on the stack
   bucket_name = f"protected-bucket-{stack_name}-{pulumi.get_project()}"
   
   # Create an S3 bucket with conditional protection
   bucket = aws.s3.Bucket("protected-bucket",
       # Set bucket properties
       bucket=bucket_name,
       tags={
           "Environment": stack_name,
           "Protected": str(enable_protection)
       },
       # Apply resource protection based on configuration
       opts=pulumi.ResourceOptions(
           protect=enable_protection
       )
   )
   
   # Export the bucket name and protection status
   pulumi.export("bucket_name", bucket.bucket)
   pulumi.export("protection_enabled", enable_protection)
   ```

### Step 3: Create and Configure the Development Stack

1. Create a development stack:
   ```bash
   pulumi stack init dev
   ```

2. Configure the development stack to disable protection:
   ```bash
   pulumi config set enableProtection false
   ```

3. Deploy the development stack:
   ```bash
   pulumi up
   ```

4. Note the outputs, particularly the bucket name and protection status.

### Step 4: Create and Configure the Production Stack

1. Create a production stack:
   ```bash
   pulumi stack init prod
   ```

2. Configure the production stack to enable protection:
   ```bash
   pulumi config set enableProtection true
   ```

3. Deploy the production stack:
   ```bash
   pulumi up
   ```

4. Note the outputs, particularly the bucket name and protection status.

### Step 5: Test Resource Protection

1. Try to destroy the development stack:
   ```bash
   pulumi stack select dev
   pulumi destroy
   ```

   This should succeed because protection is disabled for the development stack.

2. Try to destroy the production stack:
   ```bash
   pulumi stack select prod
   pulumi destroy
   ```

   This should fail with an error message indicating that the resource is protected and cannot be deleted.

### Step 6: Removing Protection

1. To properly clean up the production stack, you need to first remove the protection:
   ```bash
   # Update the configuration to disable protection
   pulumi config set enableProtection false
   
   # Update the stack to apply the configuration change
   pulumi up
   ```

2. Now you can destroy the production stack:
   ```bash
   pulumi destroy
   ```

## Understanding Resource Protection

Resource protection in Pulumi is a powerful feature that prevents accidental deletion of critical infrastructure. When a resource is protected:

- The resource cannot be deleted through normal `pulumi destroy` operations
- The protection must be explicitly removed before the resource can be deleted
- Protection can be applied conditionally based on stack configuration

This provides an additional safety layer for production environments where resource deletion could cause significant disruption.

The key code for enabling protection is:

```python
aws.s3.Bucket("protected-bucket",
    # ... other properties ...
    opts=pulumi.ResourceOptions(
        protect=enable_protection
    )
)
```

## Best Practices for Resource Protection

1. **Environment-Based Protection**: Apply protection based on the environment (dev, staging, prod)
2. **Configuration-Driven**: Use stack configuration to control protection settings
3. **Document Protected Resources**: Clearly document which resources are protected and why
4. **Protection Removal Process**: Establish a clear process for removing protection when needed

## Conclusion

By using resource protection, you can add an additional layer of safety to your infrastructure, preventing accidental deletion of critical resources. This is particularly important for production environments where resource deletion could cause significant disruption.

## Clean Up

When you're done with the exercise, clean up the resources:

```bash
# Make sure protection is disabled for both stacks
pulumi stack select dev
pulumi destroy -y

pulumi stack select prod
pulumi config set enableProtection false
pulumi up
pulumi destroy -y
```