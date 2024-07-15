---
theme: default
paginate: true
marp: true
---

# **Module 05: Organizing Programs and Stacks**

---

# Stack Configuration (Review)

- Each stack has its own config file `Pulumi.{STACK_NAME}.yaml`, e.g.`Pulumi.dev.yaml` or `Pulumi.prod.yaml`
- Setting config values:

    ```bash
    $ pulumi config set my-key my-value
    $ cat Pulumi.dev.yaml
    config:
      project-name:my-key: my-value
    ```

- Reading config values:

    ```typescript
    const config = new pulumi.Config();
    const optionalValue = config.get("some-optional-value") || "default-value";
    const requiredValue = config.require("some-required-value");
    // also, getBoolean(), getRequiredInt(), etc.
    ```

---

# Using Multiple Stacks in a Single Program

- Represent roughly identical environments, e.g.:
  - dev/stage/prod
  - SaaS tenants
  - primary/disaster recovery
- Create a new stack: `pulumi stack init prod`
- Change the current stack: `pulumi stack select staging`
- List stacks: `pulumi stack ls`

---

# Stack Config w/Multiple Stacks

- Use config to control differences, e.g.:
  - `pulumi config set desiredNodeCount 3`
  - `pulumi config set logRetentionDays 90`
  - `pulumi config set apiKey abc123 --secret`
- Commit all stack config files to git, but **be sure to correctly mark secrets!!!**
- Can use ESC to manage config at scale.

---

# Organizing Stacks, Example: Pulumi Cloud @ Pulumi

How we use stacks in our SaaS product (Pulumi Cloud):

- Individual developer stacks used w/feature branches
- Staging stack on`main` branch w/continuous delivery
- Production deployments on-demand
- 139 stack config parameters

---

# Stack References

- Retrieve outputs from one stack in another stack
- Limit blast radius
- Define areas of ownership

```typescript
const stackRef = new pulumi.StackReference("other-stack", {
  name: "org-name/project-name/stack-name"
});

const vpcId = stackRef.getOutput("vpcId"); // implicitly pulumi.Output<string>
const privateSubnetIds = stackRef.getOutput("privateSubnetIds") as pulumi.Output<string[]>;

// use outputs to create additional resources
```

---

# Stack Outputs/References: Best Practices

- **Do** share only what you _know_ is actually consumed downstream. (Limit fan-out.)
- **Do not** share entire resources. Unnecessary performance hit and churn on values.
- **Do** share _stable_ IDs and query for the resource in the downstream stack if other attribs are needed, e.g.:

    ```typescript
    const vpcId = stackRef.getOutput("vpcId");
    const existingVpc = aws.ec2.Vpc.Get(vpcId);
    const serviceSecGroup = new aws.ec2.SecurityGroup("security-group", {
      vpcId: vpcId,
      ingress: [{
        cidrBlocks: [vpc.cidrBlock],
        // ...
    ```

---

# Organizing Programs: Principles

- Align with team ownership and the org chart (Conway's Law)
- Limit blast radius
- Pulumi Cloud automatically prevents concurrent stack updates
- Things that change together should live together:

  If you see yourself consistently making changes in multiple repos (app or infra code) or multiple folders, then your code organization is probably not optimal.

---

# Organizing Repos and Programs, Example: Early Startup (Pre-Product Market Fit)

- Small number of engineers
- Monorepo is fine at this stage
  - Side note: Monolith is also the appropriate app architecture
- App code in the same repo with infrastructure, assuming workloads are containerized or serverless
- Deploy everything every time

---

# Organizing Repos, Example: Multi-Team Enterprise

- Each team has its own repo or repos:
  - Ease of access controls
  - Clear boundaries of ownership
  - Unit of work/deployment is simple to determine (git commit)
  - Allow outside contributions if feasible!
- Common example:
  - Networking team/repos: VPCs, TGW, centralized egress, firewall rules, load balancers
  - Platform team/repos: EKS clusters, RDS clusters, S3 buckets, backup storage, container registries
  - Application teams/repos: Containers, related K8s resources
