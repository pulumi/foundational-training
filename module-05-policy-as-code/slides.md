---
theme: default
paginate: true
marp: true
---

# **Module 05: Policy as Code**

---

# Overview

- What do we mean by Policy as code?
- Types of Policy control
- CrossGuard
- Enforcement Levels
- Resource Validation
- Resource Remediation
- Stack Validation
- Compliance-Ready policies
- Server-side enforcement

---

# Policy Control Types

-   **Preventative controls:**
    -   Run before a resource is provisioned
    -   Examples: Pulumi Policy as Code, AWS Service Control Policies
    -   Advantage: Faster feedback
    -   Disadvantage: Doesn't catch resources created out-of-band (e.g., Console)
-   **Detective controls:**
    -   Run after a resource is provisioned
    -   Examples: AWS Config, Pulumi stack policies (on `update`, not `preview`)
    -   Advantage: Catches everything., even console updates
    -   Disadvantage: Slower feedback, cloud-specific (necessarily)
-   Either may include remediation actions

---

# Pulumi Policy as Code (AKA CrossGuard)

-   Open source
-   Author in Node.js or Python
-   Works against Pulumi programs in any language (b/c gRPC)
-   Run locally: `pulumi up --policy-pack path/to/policy-pack`
-   Easily incorporate into pipelines
-   _Much_ nicer and more capable authoring experience relative to DSL-type tools
-   Output captured in CLI (and therefore Pulumi Cloud)
-   User guide: <https://www.pulumi.com/docs/using-pulumi/crossguard/core-concepts/>

**Note:** OPA support is experimental

---

# Enforcement Levels

-   `Disabled`: Do not run
-   `Advisory`: Validate, print warning, and always return zero
-   `Mandatory`: Validate, print error, and return non-zero on failure
-   `Remediate`: Transform the resource to try fix the issue, validate, print error and return non-zero on failure
-   Can set a global default, or level per-policy

---

# Writing Resource Policy Rules: Fields

Each resource policy has the following fields:

-   `name`, `description`: (self-explanatory, required)
-   `enforcementLevel`: Default enforcement level (optional, `advisory` default)
-   `remediateResource`: Function to fix a potential validation issue. Executes only if `enforcementLevel` is set to `remediate`. Executes _before_ `validateResource` (optional)
-   `validateResource`: Function to determine whether the resource complies (required)
    -   Multiple functions can be defined to group similar resources, e.g., ALB and ELB log configuration

---

# Resource Validation Functions (Typescript)

-   `validateResourceOfType()` helper function in TS
-   Call `reportViolation` if validation fails

```typescript
{
    name: "aws-s3-bucket-enable-server-side-encryption",
    description: "Check that S3 Bucket Server-Side Encryption (SSE) is enabled.",
    enforcementLevel: "advisory",
    validateResource: validateResourceOfType(Bucket, (bucket, args, reportViolation) => {
        if (!bucket.serverSideEncryptionConfiguration) {
            reportViolation("S3 Buckets Server-Side Encryption (SSE) should be enabled.");
        }
    }),
}
```

---

# Resource Validation Functions (Python)

-   Create a function to validate the resource:

```python
def s3_has_server_side_encryption_validator(args: ResourceValidationArgs, report_violation: ReportViolation);
    if args.resource_type == "aws:s3/bucket:Bucket" and "serverSideEncryptionConfiguration" in args.props:
        has_sse_config = args.props["serverSideEncryptionConfiguration"]
        if has_sse_config = "false":
            report_violation(
                S3 Buckets Server-Side Encryption (SSE) should be enabled."
            )
```

-   Create the policy:

```python
s3_has_server_side_encryption = ResourceValidationPolicy(
    name="s3-sse-config",
    description="Check that SSE config hasn't been disabled.",
    enforcement_level=EnforcementLevel.MANDATORY,
    validate=s3_has_server_side_encryption_validator
)

```

---

# Remediation Functions (Typescript)

-   If the enforcement level is `remediate`, `remediateResource` runs before `validateResource`
-   Must `return` the resource after transforming

```typescript
remediateResource: remediateResourceOfType(aws.s3.Bucket, (bucket, args) => {
    if (!bucket.tags || !bucket.tags["Department"]) {
        bucket.tags = bucket.tags || {};
        bucket.tags["Department"] = bucket.tags["Department"] || "IT0001";
    }

    return bucket;
}),
```

---

# Remediation Functions (Python)

```python
def s3_has_server_side_encryption_validator(args: ResourceValidationArgs);
    if args.resource_type == "aws:s3/bucket:Bucket" and "serverSideEncryptionConfiguration" in args.props:
        has_sse_config = args.props["serverSideEncryptionConfiguration"]
        if has_sse_config = "false":
            args.props["serverSideEncryptionConfiguration"] = "true"
            return args.props
```

---

# Why not both? (Remediation and Validation in one) - Typescript

`validateRemediateResourceOfType` combines both `validateResource` and `remediateResource`:

```typescript
{
    enforcementLevel: "remediate",
    name: "s3-tags",
    description: "Ensure required tags are present on S3 buckets.",
    ...validateRemediateResourceOfType(aws.s3.Bucket, (bucket, args, reportViolation) => {
        if (!bucket.tags || !bucket.tags["Department"]) {
            reportViolation("S3 Bucket is missing required Department tag");
            bucket.tags = bucket.tags || {};
            bucket.tags["Department"] = bucket.tags["Department"] || "IT0001";
        }
        return bucket;
    }),
}
```

---

# Why not both? (Remediation and Validation in one) - Python

```python
def s3_has_server_side_encryption_validator(args: ResourceValidationArgs, report_violation: ReportViolation);
    if args.resource_type == "aws:s3/bucket:Bucket" and "serverSideEncryptionConfiguration" in args.props:
        has_sse_config = args.props["serverSideEncryptionConfiguration"]
        if has_sse_config = "false":
            report_violation(
                S3 Buckets Server-Side Encryption (SSE) should be enabled."
            )
            if has_sse_config = "false":
                args.props["serverSideEncryptionConfiguration"] = "true"
                return args.props

```

---

# Running Policies (OSS/Client Side)

-   For OSS, policies must be present on disk.
-   `pulumi preview --policy-pack /path/to/policy-pack`
-   `pulumi up --policy-pack /path/to/policy-pack`
-   Can run multiple packs at once:

    ```bash
    pulumi up --policy-pack /path/to/policy-pack-1  --policy-pack /path/to/policy-pack-2
    ```

---

# Exercise: Authoring Resource Policies

See: `exercise-01-authoring-resource-polices.md`

---

# Stack Policies

-   `preview`: Runs at the end of the Pulumi program (still preventative - nothing has been provisioned), best use
-   `update`: Runs after resources have been provisioned (detective control), all outputs will be available
-   `validateStack` instead of `validateResource`
-   Does not work with `remediate` (there is no `remediateStack`)
-   Useful for policies that depend on multiple resources (e.g., every S3 bucket must have has a corresponding replication bucket)

---

# Stack Policies: Example

```typescript
{
    name: "dynamodb-autoscaling-required",
    description: "Requires a dynamoDB table to have an associated App Autoscaling policy.",
    enforcementLevel: "mandatory",
    validateStack: (args: StackValidationArgs, reportViolation: ReportViolation) => {
        const dynamodbTables = args.resources.map(r => r.asType(aws.dynamodb.Table)).filter(r => r);
        const appScalingPolicies = args.resources.map(r => r.asType(aws.appautoscaling.Policy)).filter(r => r);

        const policyResourceIDMap: Record<string, q.ResolvedResource<aws.appautoscaling.Policy>> = {};
        for (const policy of appScalingPolicies) {
            policyResourceIDMap[policy.resourceId] = policy;
        }

        for (const table of dynamodbTables) {
            if (policyResourceIDMap[table.id] === undefined) {
                reportViolation(`DynamoDB table ${table.id} missing app autoscaling policy.`);
            }
        }
    },
}
```

---

# Stack Policies: Example

```python

def dynamodb_autoscaling_required_validator(args: StackValidationArgs, report_violation: ReportViolation):
    tables = filter(lambda r: r.resource_type == "aws:dynamodb/table:Table", args.resources)
    policies = filter(lambda r: r.resource_type == "aws:autoscaling/policy:Policy", args.resources)

    policy_resource_ids = set()
    for policy in policies:
        policy_resource_ids.add(policy["resourceId"])

    for table in tables:
        if table["id"] not in policy_resource_ids:
            report_violation(f"DynamoDB table {table['id']} missing app autoscaling policy.")

dynamodb_autoscaling_required = StackValidationPolicy(
    name="dynamodb-autoscaling-required",
    description="Requires a dynamoDB table to have an associated App Autoscaling policy.",
    enforcement_level=EnforcementLevel.MANDATORY,
    validate=dynamodb_autoscaling_required_validator,
)

```

---

# Compliance-Ready Policies

-   Encapsulate rules for compliance frameworks: ISO 27001, PCI-DSS, CIS
-   Open source
-   Select only needed policies using selectors:
    -   `vendor`: `aws`, `azure`, `gcp`
    -   `services`: `ec2`, `s3`, `rds`, etc.
    -   `topics`: `encryption`, `cost`, `backup`, `availability`
    -   `frameworks`: `pcidss`, `iso27001`, etc.
    -   `severity`: `medium`, `high`, `critical`, etc.
-   `policyManager` contains settings to print a summary

More info: <https://www.pulumi.com/docs/using-pulumi/crossguard/compliance-ready-policies/>

---

# Exercise: Compliance Ready Policies

See: `exercise-02-compliance-ready-policies.md`

---

# Server-Side Enforcement

-   Paid feature (currently Business Critical only)
-   Publish policy packs via `pulumi policy publish`
-   **Policy Group:** (some # of versioned policy packs) (policy pack config) + (some # of stacks)
-   Default Policy Group automatically includes all stacks.
-   When running `pulumi preview` or `pulumi up`, Pulumi CLI downloads the applicable packs and runs them. (Don't need to specify `--policy-pack`.)

---

# Custom Configuration, Consuming (Server-Side Enforcement)

Consumers can configure policy packs via the Pulumi Cloud UI:

![width:275px](policy-pack-config.png)

---

# Exercise: Server-Side Policy Enforcement

See: `exercise-03-server-side-enforcement.md`

---

# Recap

- What do we mean by Policy as code?
- Types of Policy control
- CrossGuard
- Enforcement Levels
- Resource Validation
- Resource Remediation
- Stack Validation
- Compliance-Ready policies
- Server-side enforcement
