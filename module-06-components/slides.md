---
theme: default
paginate: true
marp: true
---

# **Module 06: Components and Modularity**

---

# Component Resources Overview

ComponentResources (e.g. `awsx.ec2.Vpc`) are like CustomResources (e.g. `aws.s3.Bucket`):

- Analogous to TF modules or CDK constructs
- Unlike CustomResources, ComponentResources encapsulate multiple resources, e.g. `awsx.ec2.Vpc`
- Like CustomResources, ComponentResources may (usually) take input args, like other resources, e.g. `numberOfAvailabilityZones` input on `awsx.ec2.Vpc`
- Like CustomResources, ComponentResources may have outputs, like other resources, e.g. `awsx.ec2.Vpc.privateSubnetIds`
- Unlike CustomResources, ComponentResources take a specialized options class `pulumi.ComponentResourceOpts` (similar to `pulumi.CustomResourceOptions`)

---

# Component Resources: Authoring

When writing Component Resources:

- Always call the parent constructor first.
- Create resources in the constructor (functions are fine).
- Each top-level resource should have component specified as `parent`, so it displays clearly in preview/update
- Always call `registerOutputs` as the final line in the constructor

---

# Component Resource Example: TypeScript

```typescript
export interface MyComponentArgs {
  bucketSuffix: pulumi.Input<string>,
}

export class MyComponent extends pulumi.ComponentResource {
    public readonly bucketDomainName: pulumi.Output<string>;

    constructor(name: string, args: MyComponentArgs, opts: pulumi.ComponentResourceOptions = {}) {
      // This must always be called first:
      super("myPackage:index:MyComponent", name, {}, opts);

      // Create resources, remembering to template the resource name and set parent:
      const bucket = new aws.s3.Bucket(`${name}-${args.bucketSuffix}`,
        {/*...*/},
        { parent: this }
      );

      // Create an output that can be accessed by the calling program:
      this.bucketDomainName = bucket.bucketDomainName

      // This must always be called last:
      this.registerOutputs({
          bucketDnsName: bucket.bucketDomainName,
      })
    }
}
```

---

# Component Resource Example: Python

```python
@dataclass
class MyComponentArgs:
    bucket_suffix: pulumi.Input[str]


class MyComponent(pulumi.ComponentResource):
  def __init__(self, name: str, args: MyComponentArgs, opts: pulumi.ResourceOptions = None) -> None:

    # This must always be called first:
    super().__init__("myPackage:index:MyComponent", name, None, opts)

    # Create resources, remembering to template the resource name and set `parent`:
    bucket = aws.s3.Bucket(
      f"{name}-{args.bucket_suffix}",
      pulumi.ResourceOptions()
    )

    # Create an output that can be accessed by the calling program:
    self.bucket_domain_name = bucket.bucket_domain_name

    # This must always be called last:
    self.register_outputs({
        "bucket_domain_name": self.bucket_domain_name
    })
```

---

# Sharing Code in a Single Language

- Publish packages via npm, PyPI, etc.
- Consumable only in the same language as they are authored

---

# Multi-language Components/Packages

Multi-Language Components are ComponentResources that are compiled to a provider-like binary, have a schema, and SDKs generated in all Pulumi languages.

- Examples: `awsx`, `eks`, etc.
- Requires authoring a schema (less mature tooling compared to authoring providers)
- Requires producing an SDK in every supported language (need credentials for each language's package feed)

---

# Multi-language Components/Packages: Best Fit

Multi-language components are non-trivial to write and maintain, and are best suited for components that are consumed by a wide audience in multiple languages:

- **For internal use** in very large, high-functioning orgs with many teams that run their own infra and do not use the same language. (MAANG-scale or SaaS platform orgs, e.g. Uber.)
- **For use with customers** for large system implementers that want to reuse components across multiple engagements.
- **For external use** for cloud providers who want to publish their own constructs to be consumed in all Pulumi languages.
