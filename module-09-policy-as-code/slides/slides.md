---
theme: default
paginate: true
marp: true
---

# **Module 09: Policy as Code**

---

# Policy Control Types

* **Preventative controls:**
  * Run before a resource is provisioned.
  * Examples: Pulumi Policy as Code, AWS Service Control Policies
  * Good: Faster feedback.
  * Bad: Doesn't catch resources created out-of-band (e.g., Console)
* **Detective controls:**
  * Run after a resource is provisioned.
  * Examples: AWS Config, Pulumi stack policies (on `update`, not `preview`)
  * Good: Catches everything.
  * Bad: Slower feedback, cloud-specific (necessarily).
* Either may include remediation actions

---

# Pulumi Policy as Code

* Author in Node.js or Python
* Works against Pulumi programs in any language (b/c gRPC)
* Run locally: `pulumi up --policy-pack path/to/policy-pack`
* Easily incorporate into pipelines
* _Much_ nicer and more capable authoring experience relative to DSL-type tools
* Output captured in CLI (and therefore Pulumi Cloud)
* User guide: <https://www.pulumi.com/docs/using-pulumi/crossguard/core-concepts/>

**Note:** OPA support is not production-ready, and no plans to enhance

---

# Enforcement Levels

* `Disabled`: Do not run.
* `Advisory`: Validate, print warning and always return zero.
* `Mandatory`: Validate, print error, and return non-zero if fails.
* `Remediate`: Mutate the resource to try fix the issue, validate, print error and return non-zero if fails.
* Can set a global default, or level per-policy
* Consumers can override at the same levels

---

# Writing Resource Policy Rules: Fields

Each resource policy has the following fields:

* `name`, `description`: (self-explanatory)
* `enforcementLevel`: Default enforcement level
* `remediateResource`: Function to fix a potential validation issue. Executes only if `enforcementLevel` is set to `remediate`. Executes _before_ `validateResource`.
* `validateResource`: Function to determine whether the resource complies.
  * Multiple functions can be defined to group similar resources, e.g., ALB and ELB log configuration.

---

# Resource Validation Functions

* `validateResourceOfType()` helper function in TS.
* Must check type in Python.
* Call `reportViolation` if validation fails.
* Example:

    ```typescript
    {
        enforcementLevel: "mandatory",
        name: "s3-tags",
        description: "Ensure required tags are present on S3 buckets.",
        validateResource: validateResourceOfType(aws.s3.Bucket, (bucket, args, reportViolation) => {
            if (!bucket.tags || !bucket.tags["Department"]) {
                reportViolation("S3 Bucket is missing required Department tag");
            }
        }),
    },
    ```

---

# Remediation Functions

* If the enforcement level is `remediate`, `remediateResource` runs before `validateResource`.
* Must return the resource after mutating.
* Example:

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

# Why not both? (Remediation and Validation in one)

`validateRemediateResourceOfType` combines both functions:

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

# Stack Policies

* `preview`: Runs at the end of the Pulumi program (still preventative - nothing has been provisioned), best use
* `update`: Runs after resources have been provisioned (detective control)
* `validateStack` instead of `validateResource`
* Does not work with `remediate` (there's no `remediateStack`)
* Useful for policies that depend on multiple resources (e.g., every X resource has a corresponding Y)

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

# Compliance-Ready Policies

* Encapsulate rules for compliance frameworks: ISO 27001, PCI-DSS,
* Open-source
* Select only needed policies using selectors:
  * `vendor`: `aws`, `azure`, `gcp`
  * `services`: `ec2`, `s3`, `rds`, etc.
  * `topics`: `encryption`,`cost`, `backup`,`availability`
  * `frameworks`: `pcidss`, `iso27001`, etc.
* `policyManager` contains settings to print a summary.

---

# Running Policies (OSS/Client Side)

* For OSS, policies must be present on disk.
* `pulumi preview --policy-path /path/to/policy`
* `pulumi up --policy-path /path/to/policy`

---

# Server-Side Enforcement

* Paid feature (currently Business Critical only)
* Publish policy packs via `pulumi policy publish`
* **Policy Group:** (some # of versioned policy packs) (policy pack config) + (some # of stacks)
* Default Policy Group automatically includes all stacks.
* When running `pulumi preview` or `pulumi up`, Pulumi CLI downloads the applicable packs and runs them. (Don't need to specify `--policy-pack`.)

---

# Configuration Schemas

TODO: This might end up out of scope. Might want to come back to it after we fill out the other modules.
