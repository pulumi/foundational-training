---
theme: default
paginate: true
marp: true
---

# **Module 03: Introduction to Kubernetes**

---

# Pulumi Kubernetes Provider - TypeScript

* First native provider (no underlying TF provider dependency)
* Strongly-typed standard resources:

    ```typescript
    const deployment = new kubernetes.apps.v1.Deployment("deployment", {
        metadata: {
            labels: {
                app: "nginx",
            },
        },
        spec: {
            replicas: 3,
            selector: {
                matchLabels: {
                    app: "nginx",
                },
            },
        // etc.
    ```

---

# Pulumi Kubernetes Provider - Python

* First native provider (no underlying TF provider dependency)
* Strongly-typed standard resources:

```python
deployment = k8s.apps.v1.Deployment(
    "nginx-deployment",
    spec=k8s.apps.v1.DeploymentSpecArgs(
        replicas=3,
        selector=k8s.meta.v1.LabelSelectorArgs(
            match_labels={"app": "nginx"},
        ),
        template=k8s.core.v1.PodTemplateSpecArgs(
            metadata=k8s.meta.v1.ObjectMetaArgs(labels={"app": "nginx"}),
            spec=k8s.core.v1.PodSpecArgs(
                containers=[
                    k8s.core.v1.ContainerArgs(
                        name="nginx",
                        image="nginx:latest",
                        ports=[k8s.core.v1.ContainerPortArgs(container_port=80)]
                    )
                ],
            ),
        ),
    ),
)
```

---

# Amazon EKS Package

* Contains component resources for common EKS constructs:
  * Clusters
  * Node Groups
* Best suited for proofs of concept, getting started quickly

---

# Server-side Apply

* Upsert a resource by default (matching on `metadata.name`)
* Most resources corresponding `XPatch` resources, e.g. `ConfigMapPatch`
* Use the `pulumi.com/forcePatch` annotation to resolve conflicts with the existing version of the resource, rather than the patch that is being applied.
* Default for SSA is `true`, can be turned off in provider config.

---

# Consuming YAML

`k8s.yaml.ConfigFile`: Component resource that takes a path to a manifest and and creates a Pulumi resource for each K8s resource:

```typescript
const configFile = new k8s.yaml.ConfigFile("nginx", {
    file: "manifests/nginx.yaml"
});
```

```python
config_file = k8s.yaml.ConfigFile(
    "nginx",
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

`k8s.yaml.ConfigGroup`: Component resource that takes a list of file and creates a `ConfigFile` for each file:

```typescript
const configGroup = new k8s.yaml.ConfigGroup("manifests", {
    files: ["manifests/*"]
});
```

```python
config_group = k8s.yaml.ConfigGroup(
    "manifests",
    files=["manifests/*.yaml"]
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

# Emitting YAML (TypeScript)

**Note:** This is a beta feature

Can configure the K8s provider to write YAML files to a given directory:

```typescript
const k8sProvider = new k8s.Provider("k8s-provider", {
    kubeconfig: kubeconfig,
    renderYamlToDirectory: "./manifests"
});

const configMap = new k8s.core.v1.ConfigMap("config-map", {
    // ...
}, {
    provider: k8sProvider
});
```

```text
$ tree manifests
manifests
├── 0-crd
└── 1-manifest
    └── v1-configmap-default-my-config-map.yaml
```

---

# Emitting YAML (Python)

**Note:** This is a beta feature

Can configure the K8s provider to write YAML files to a given directory:

```python
k8s_provider = k8s.Provider(
    "k8s-provider",
    render_yaml_to_directory="./manifests"
)

config_map = k8s.core.v1.ConfigMap(
    # ...
    opts=pulumi.ResourceOptions(provider=k8s_provider)
)
```

```text
$ tree manifests
manifests
├── 0-crd
└── 1-manifest
    └── v1-configmap-default-my-config-map.yaml
```

---

# Helm

* `helm.v3.Chart`: Templates the chart locally like `helm template`. ComponentResource containing each of the constituent, templated resources:

    ```text
        ├─ kubernetes:helm.sh/v3:Chart                  wp-chart                             create      
    +   │  ├─ kubernetes:core/v1:ServiceAccount         default/wp-chart-mariadb             create      
    +   │  ├─ kubernetes:core/v1:ConfigMap              default/wp-chart-mariadb             create      
    +   │  ├─ kubernetes:core/v1:Service                default/wp-chart-mariadb             create      
    +   │  ├─ kubernetes:core/v1:Secret                 default/wp-chart-mariadb             create      
    +   │  ├─ kubernetes:core/v1:Service                default/wp-chart-wordpress           create
        etc.
    ```

* `helm.v3.Release`: Single resource, full functionality of Helm CLI (hooks, etc.)
* Guide: <https://www.pulumi.com/registry/packages/kubernetes/how-to-guides/choosing-the-right-helm-resource-for-your-use-case/#limitations>
* Additional Helm Release options: <https://www.pulumi.com/registry/packages/kubernetes/api-docs/provider/#helmreleasesettings>
