---
theme: default
paginate: true
marp: true
---

# **Module 06: Components and Modularity (TODO: and Refactoring?)**

---

# Resource Aliases

- Resource option that allows refactoring
- Defaults to `urn`
  - TODO: Explain what a URN is.
- Alias can be removed after a `pulumi update`

---

# Component Resources

- Encapsulate multiple resources, e.g. `awsx.ec2.Vpc`

```typescript
class MyComponent extends pulumi.ComponentResource {
    constructor(name: string, opts: pulumi.ComponentResourceOptions) {
        super("packageName:moduleName:ComponentName", name, {}, opts);
    }
}
```

- Always call the parent constructor first.
- Create resources in the constructor (functions are fine).
- Each top-level resource should have component specified as `parent`, e.g.:

    ```typescript
    const bucket = new aws.s3.Bucket("my-component-bucket", {
      // specify bucket args
    }, { parent: this});
    ```

  (Nesting resources is also fine.)

---

# Sharing Modules

- Publish code via npm, PyPI, etc.
- Consumable only in the same language as they are authored (because they have no schema).

---

# Multi-language Components/Packages

Similar requirements to publishing providers:

- Examples: `awsx`, `eks`, etc.
- Requires authoring a schema
- Requires producing an SDK in every supported language
  - Need credentials for each language's package feed

Good fit for *very* large, very high-functioning orgs with a need for internal components consumed by many teams that run their own infra and do not use the same language. (MAANG-scale or SaaS platform orgs, e.g. Uber.) Or, cloud providers...

---

# Refactoring Programs

---

# Refactoring to Modules

---

# Components and Modularity: Best Practices

---

# Dynamic Providers

- Write your own CRUD operations, e.g.:

    ```typescript

    ```

- Node and Python are supported.

More info: 
