---
theme: default
paginate: true
marp: true
---

# **Module 03: Introduction to Kubernetes**

---

# Pulumi Kubernetes Provider

* Pulumi provides a Kubernetes provider to manage Kubernetes resources.
* Resources are strongly-typed, meaning you get code completion and type checking.
* Direct integration with Kubernetes API, ensuring high compatibility and reduced abstraction.

---

**Why use the native Kubernetes provider?**
* **Simplicity**: Directly interact with Kubernetes resources using familiar programming languages.
* **Strong Typing**: Benefit from type checking, code completion, and inline documentation.
* **Consistency**: Use the same tool for managing both cloud infrastructure and Kubernetes resources.
* **Rich Ecosystem**: Leverage the full Pulumi ecosystem for Kubernetes management.

---

Example of creating a Deployment in Pulumi:

```python
import pulumi_kubernetes as k8s

deployment = k8s.apps.v1.Deployment("nginx-deployment",
    metadata={
        "labels": {
            "app": "nginx",
        },
    },
    spec={
        "replicas": 3,
        "selector": {
            "matchLabels": {
                "app": "nginx",
            },
        },
        "template": {
            "metadata": {
                "labels": {
                    "app": "nginx",
                },
            },
            "spec": {
                "containers": [{
                    "name": "nginx",
                    "image": "nginx:1.19.10",
                    "ports": [{
                        "containerPort": 80,
                    }],
                }],
            },
        },
    },
)
```

---

**Amazon EKS Package**

* Pulumi offers components to easily create and manage EKS clusters.
* Key resources include Clusters and Node Groups.
  
---

**Server-side Apply**

**What is Server-side Apply?**
  Server-side apply is a method to create or update Kubernetes resources directly on the Kubernetes server.

---

**How does it work?**
  Pulumi uses the resource's `metadata.name` to check if it already exists:
  - If it exists, it updates the resource.
  - If it doesn't exist, it creates a new one.

---

**Why use it?**
  This ensures that your changes are applied correctly, even if other tools or users are also modifying the same resources.

**Handling Conflicts:**
  When multiple changes occur on the same resource, conflicts might arise. You can resolve these conflicts using the `pulumi.com/forcePatch` annotation, which forces your changes to take precedence. 

---

**Example of Server-side Apply:**
  ```python
  import pulumi_kubernetes as k8s

  config_map_patch = k8s.core.v1.ConfigMapPatch("example-configmap",
      metadata={
          "name": "example-configmap",
      },
      data={
          "key": "new-value",
      },
      opts=pulumi.ResourceOptions(
          custom_timeout=60,  # Optional: set a custom timeout for the operation
          ignore_changes=["metadata"],  # Optional: ignore changes to metadata
      )
  )
  ```
  In this example, if the `ConfigMap` named `example-configmap` exists, it will be updated with the new data. If it doesn't exist, a new `ConfigMap` will be created.

---

**Consuming YAML**

Use `k8s.yaml.ConfigFile` to create resources from YAML manifests:

```python
config_file = k8s.yaml.ConfigFile("nginx",
    file="manifests/nginx.yaml"
)
```

```text
    +   ├─ kubernetes:yaml:ConfigFile           nginx                       create     
    +   │  ├─ kubernetes:core/v1:Service        nginx-service               create     
    +   │  └─ kubernetes:apps/v1:Deployment     nginx-deployment            create 
```

---

# Consuming YAML, cont'd

Use `k8s.yaml.ConfigGroup` to create resources from multiple YAML files:

```python
config_group = k8s.yaml.ConfigGroup("manifests", 
    files=["manifests/*"]
)
```

```text
+   └─ kubernetes:yaml:ConfigGroup          manifests                   create     
+      ├─ kubernetes:yaml:ConfigFile        manifests/nginx.yaml        create     
+      │  ├─ kubernetes:core/v1:Service     nginx-service               create     
+      │  └─ kubernetes:apps/v1:Deployment  nginx-deployment            create     
+      └─ kubernetes:yaml:ConfigFile        manifests/configmap.yaml    create     
+         └─ kubernetes:core/v1:ConfigMap   some-config                 create     
```

---

**Helm**

`helm.v3.Chart`: Templates the chart locally like `helm template`, and creates each resource.

    ```text
        ├─ kubernetes:helm.sh/v3:Chart                  wp-chart                             create      
    +   │  ├─ kubernetes:core/v1:ServiceAccount         default/wp-chart-mariadb             create      
    +   │  ├─ kubernetes:core/v1:ConfigMap              default/wp-chart-mariadb             create      
    +   │  ├─ kubernetes:core/v1:Service                default/wp-chart-mariadb             create      
    +   │  ├─ kubernetes:core/v1:Secret                 default/wp-chart-mariadb             create      
    +   │  ├─ kubernetes:core/v1:Service                default/wp-chart-wordpress           create
        etc.
    ```

* `helm.v3.Release`: Single resource, full functionality of Helm CLI (hooks, etc.).
* Guide: <https://www.pulumi.com/registry/packages/kubernetes/how-to-guides/choosing-the-right-helm-resource-for-your-use-case/#limitations>
* Additional Helm Release options: <https://www.pulumi.com/registry/packages/kubernetes/api-docs/provider/#helmreleasesettings>
