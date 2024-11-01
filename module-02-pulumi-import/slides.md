---
theme: default
paginate: true
marp: true
---

# **Module 02: Import and Using Pulumi with other IaC Tools**

---

# Demo/Exercise Prep

1. Optional (demo only): Install CDK
1. Required (for exercises): Install Terraform

---

# Big Picture: Pulumi in Brownfields

## Strategies

1. **Coexist:** Interoperate with existing resources that are not (and will not be) managed by Pulumi
1. **Replace:** Bring resources under Pulumi management, remove from other tool (if applicable)

## Common Scenarios

1. ClickOps
1. CloudFormation/CDK
1. Terraform
1. Kubernetes

---

# Get Functions: Reference any existing resource (TypeScript)

```typescript
const existingVpcId = "vpc-0340ffe6c77c3a42f";
const existingVpc = aws.ec2.Vpc.get("existing-vpc", existingVpcId);

new aws.ec2.SecurityGroup("security-group", {
  vpcId: existingVpcId,
  ingress: [{
    cidrBlocks: [existingVpc.cidrBlock],
    // ...
})
```

- Every Pulumi resource has a `get` function
- Takes 2 parameters: `name`, and `id`
- `id` parameter is resource-specific and identical to the id used in `pulumi import`
- `get` will fail in preview if resource cannot be found

Docs: <https://www.pulumi.com/docs/concepts/resources/get/>

---

# Get Functions: Reference any existing resource (Python)

```python
vpc_id = "vpc-aefe77d6"
existing_vpc = aws.ec2.Vpc.get("existing_vpc", vpc_id)
security_group = aws.ec2.SecurityGroup(
    "security-group",
    vpc_id=vpc_id,
    ingress=[aws.ec2.SecurityGroupIngressArgs(
        cidr_blocks=[existing_vpc.cidr_block]
    # etc...
```

- Every Pulumi resource has a `get` function
- Takes 2 parameters: `name`, and `id`
- The `id` parameter is resource-specific and identical to the id used in `pulumi import`
- `get` will fail in preview if resource cannot be found

Docs: <https://www.pulumi.com/docs/concepts/resources/get/>

---

# Quick Demo: Get Functions

---

# `pulumi import` Command

```bash
pulumi import aws:ec2/vpc:Vpc my-vpc vpc-0f12a82357335a28f
```

Does two things:

1. Brings resources into Pulumi state file
1. Generates complete code (all properties)

For each resource:

1. Type identifier: `aws:ec2/vpc:Vpc`
1. Resource name (for Pulumi program): `my-vpc`
1. ID (specific to resource type, e.g. VPC ID): `vpc-0f12a82357335a28f`

---

# Quick Demo: `pulumi import` with a single resource

---

# `pulumi import`: Bulk Import

```bash
pulumi import -f path/to/file.json -o file.ts -y
```

```json
{
  "resources": [
    {
      "type": "aws:ec2/vpc:Vpc",
      "name": "my-vpc",
      "id": "vpc-094958e4051c478c3"
    },
    {
      "type": "aws:ec2/vpc:Vpc",
      "name": "my-other-vpc",
      "id": "vpc-0f12a82357335a28f"
    }
  ]
}
```

---

# Scenario 1: ClickOps

- **Coexist:** Get Functions
- **Replace:** `pulumi import`

Additional Resources:

- [Automating Pulumi Import with Manually Created Resources](https://www.pulumi.com/blog/automating-pulumi-import-to-bring-manually-created-resources-into-iac/)

---

# Exercise: Pulumi Import CLI

See: `exercise-01-pulumi-import-cli.md`

---

# Scenario 2: CloudFormation/CDK (Coexist)

1. Get functions
1. Reference CloudFormation Stack Outputs:

    ```typescript
    const network = aws.cloudformation.getStackOutput({
        name: "my-network-stack",
    });

    const subnetId = network.outputs["SubnetId"];

    const web = new aws.ec2.Instance("web", {
        ami: "ami-0adc0e3ef2558cb1f",
        instanceType: "t3.micro",
        subnetId: subnetId,
    });
    ```

**Note:** Pulumi/CDK interop exists, but is experimental

---

# Exercise: Coexisting with CloudFormation

See: `exercise-02-cloudformation-coexist.md`

---

# Scenario 2: CloudFormation/CDK (Replace)

`pulumi import`

**Note:** `cf2pulumi` is experimental

---

# Demo: Bulk Import with Pulumi

---

# Scenario 3: Terraform (Coexist)

Reference TF state outputs with the Pulumi Terraform Provider (not in the Pulumi registry):

```typescript
const tfState = new terraform.state.RemoteStateReference("tf-state", {
    backendType: "local",
    path: "/path/to/terraform.tfstate",
});

new aws.ec2.SecurityGroup("security-group", {
    description: "Allow all egress",
    vpcId: tfState.getOutput("vpc_id"),
    // etc
});
```

---

# Scenario 3: Terraform (Coexist)

Reference TF state outputs with the Pulumi Terraform Provider (not in the Pulumi registry):

```typescript
import pulumi_aws as aws
import pulumi_terraform as terraform

tf_state = terraform.state.RemoteStateFile(
    "tf-state",
    backend_type="local",
    path="/path/to/terraform.tfstate"
)

vpc_id = tf_state.get_output("vpc_id")

security_group = aws.ec2.SecurityGroup(
    "my-security-group",
    vpc_id=vpc_id
)
```

---

# Exercise: Coexisting with Terraform

See: `exercise-03-terraform-coexist.md`

---

# Scenario 3: Terraform (Replace)

1. Convert Terraform code:

    ```bash
    pulumi convert --from terraform --out path/to/pulumi/project --language typescript
    ```

1. Import Terraform state:

    ```bash
    pulumi import --from terraform path/to/terraform.tfstate --protect=false
    ```

---

# Exercise: Replacing Terraform via Conversion and State Import

See: `exercise-04-terraform-replace.md`

---

# Scenario 4: Kubernetes YAML (Coexist)

1. Single YAML File:

    ```typescript
    new k8s.yaml.ConfigFile("manifest", {
        file: "manifest.yaml",
    });
    ```

1. Directory of YAML files:

    ```typescript
    const guestbook = new k8s.yaml.ConfigGroup("manifests", {
        files: [ path.join("yaml", "*.yaml") ],
    });
    ```

1. `k8s.helm.v3.Chart`: Like `helm template`
1. `k8s.helm.v3.Release`: Like `helm install`

---

# Scenario 4: Kubernetes YAML (Replace)

- [kube2pulumi](https://www.pulumi.com/kube2pulumi/): Convert K8s YAML files into Pulumi resources.
- [crd2pulumi](https://github.com/pulumi/crd2pulumi): Convert K8s CustomResourceDefinitions into Pulumi components.

**Note:** These will likely be converted into `pulumi convert` plugins
