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

# Server-side Apply

**What is Server-side Apply?**
Server-side apply is a method for managing Kubernetes resources by sending the desired state to the Kubernetes server, which then applies the changes. This approach ensures that the resource state is consistent and conflict-free.

**How does it work?**
- Pulumi sends the entire desired state of the resource to the Kubernetes API server.
- The Kubernetes server then merges these changes with the existing state, ensuring consistency.
- If a resource with the given `metadata.name` already exists, it updates the resource.
- If the resource does not exist, it creates a new one.

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

---

## Module 03: Intro to Kubernetes

### Exercise Creating an EKS Cluster and Deploying a Simple Workload

Initialize a new Pulumi project:

```bash
mkdir simple-k8s-cluster
cd simple-k8s-cluster
pulumi new kubernetes-python 
```

---

The default responses for the prompts should be fine, but you may want to change the region into which the cluster is deployed if the default of `us-west-2` is far away from where you are.

1. Spin up the Kubernetes cluster:

```bash
pulumi up
```

---

3. Export the cluster's Kubeconfig to a local file:

```bash
pulumi stack output kubeconfig > kubeconfig.yml
```

---

**Because this cluster is set up to use IAM authentication, you do not need to worry about leaking secrets.**

4. Verify that the cluster is working by running either `kubectl` commands or exploring the cluster with a tool like <https://k9scli.io>:

```bash
KUBECONFIG=kubeconfig.yml k9s
```

---

5. Install the Pulumi Kubernetes provider and add a reference to your Pulumi program:

```bash
pip install pulumi-kubernetes
```

```python
import pulumi_kubernetes as k8s
```

---

6. Now we will add a simple, stateless workload (NGINX) to the cluster.

Because you are creating a cluster and then deploying resources into that cluster within the same Pulumi program, you will need to create an explicit provider. If you did not create this explicit provider, the default K8s provider would use your system Kubeconfig, which isn't what you want - you need the Kubeconfig for the cluster you just created.

Create an explicit Kubernetes provider toward the end of your Pulumi program:

```python
k8s_provider = k8s.Provider("k8s-provider", {
    kubeconfig: kubeconfig,
})
```

---

7. Using the YAML at the end of this step as a reference, create an NGINX Kubernetes Deployment and a corresponding `LoadBalancer` Service named `nginxService`. There are several ways that you could go about this:

8. Hand-author `kubernetes.apps.v1.Deployment` and `kubernetes.core.v1.Service` resources based off the YAML below.
9. Put the YAML in a file and reference it via a `kubernetes.yaml.ConfigFile` or `kubernetes.yaml.ConfigGroup`.
10. Convert the YAML to Pulumi K8s resources with `kube2pulumi`.

---


```python
deployment = k8s.apps.v1.Deployment("nginx",
  # Properties go here
  opts=pulumi.ResourceOptions(provider=k8s_provider)
)
```

---

The source YAML follows:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
name: nginx-deployment
labels:
  app: nginx
spec:
replicas: 1
selector:
  matchLabels:
    app: nginx
template:
  metadata:
    labels:
      app: nginx
  spec:
    containers:
      - name: nginx
        image: nginx:1.19.10
        ports:
          - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
name: nginx-service
spec:
selector:
  app: nginx
type: LoadBalancer
ports:
  - port: 80
    targetPort: 80
```

---

1. Finally, add an output that will give the DNS name of the load balancer:

```python
pulumi.export("url", nginxService.status.apply(lambda status: status.load_balancer.ingress[0].hostname if status and status.load_balancer.ingress else None))
```

Note: if you're using a `configGroup`, you can access the url as:

```python
pulumi.export("url", configGroup.get_resource("v1/Service", "nginx-service").status.apply(lambda status: status.load_balancer.ingress[0].hostname if status and status.load_balancer.ingress else None))
```

---

2. Deploy your program and verify that NGINX is working:

```bash
pulumi up
curl $(pulumi stack output url)
```

You should see the default NGINX welcome page in the output of the second command.

If time allows, try all the mentioned methods for creating the resources.

---
## Exercise 02: Stateful workloads on EKS

In this exercise, you'll learn how to run a stateful workload on EKS by installing the EBS CSI add-on. 

- This add-on enables EKS to fulfill Kubernetes persistent volume requests by provisioning EBS volumes. 
- The add-on installs a Kubernetes controller running under a service account. 
- The service account can assume an IAM role to provision storage in EBS via IAM Roles for Service Accounts (IRSA). 

---

Using the Pulumi program from Exercise 01:

1. Alter the EKS cluster component so that it creates an OIDC provider.
2. Create a role with the following assume role policy. You can use any Pulumi resources to accomplish this, but use the outputs of the EKS cluster to avoid hard-coding values:

---

```json
{
    "Statement": [
        {
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "<YOUR_CLUSTER_OIDC_URL>:aud": "sts.amazonaws.com",
                    "<YOUR_CLUSTER_OIDC_URL>:sub": "system:serviceaccount:kube-system:ebs-csi-controller-sa"
                }
            },
            "Effect": "Allow",
            "Principal": {
                "Federated": "<YOUR_CLUSTER_OIDC_PROVIDER_ARN>"
            },
            "Sid": "AllowAssumeRoleWithWebIdentity"
        }
    ],
    "Version": "2012-10-17"
}
```

---

1. Attach the `AmazonEBSCSIDriverPolicy` policy to the role.
2. Install the EBS CSI driver EKS add-on. (This is a resource in the AWS Classic provider.)
3. To verify that the add-on is correctly installed, install a stateful workload on your EKS cluster. A popular example is the WordPress Helm chart. (If the MariaDB service fails to spin up quickly, it's likely because the EBS CSI driver is not able to correctly assume the IRSA role.)

---

### Why use the EBS CSI Driver?

The EBS CSI driver is essential for managing stateful workloads on Kubernetes. It allows your Kubernetes clusters to use AWS EBS volumes as persistent storage.

---

**Advantages for Stateful Services:**

- **Persistent Storage**: EBS volumes provide persistent storage that retains data even if the pod using the volume is terminated. This is crucial for databases and other stateful applications.
- **Dynamic Provisioning**: The EBS CSI driver supports dynamic provisioning, allowing Kubernetes to automatically create and manage EBS volumes as needed.
- **Scalability**: EBS volumes can be easily resized to accommodate growing data needs, ensuring your stateful applications can scale without downtime.
- **High Availability**: EBS volumes are designed for high availability and durability, providing reliable storage for your applications.
- **Backup and Restore**: EBS volumes can be snapshotted and restored, providing a straightforward way to back up and recover your data.

---

# Python Solution

### Step-by-Step Code Breakdown

1. **Create a VPC with a single NAT gateway**:
```python
vpc = awsx.ec2.Vpc("eks-helm", 
    nat_gateways={"strategy": "Single"}
)
```
Setting up a VPC for our EKS cluster.

---

2. **Create an EKS cluster**:
   
```python
eks_cluster = eks.Cluster("eks-helm",
    version="1.29",
    vpc_id=vpc.vpc_id,
    public_subnet_ids=vpc.public_subnet_ids,
    private_subnet_ids=vpc.private_subnet_ids,
    min_size=3,
    max_size=3,
    desired_capacity=3,
    instance_type=aws.ec2.InstanceType.T3_SMALL,
    node_associate_public_ip_address=False,
    create_oidc_provider=True,  # Enable OIDC provider
)
```
Creating the EKS cluster with the OIDC provider enabled.

---

1. **Export the kubeconfig of the EKS cluster**:
```python
pulumi.export("kubeconfig", eks_cluster.kubeconfig)
```
Making the kubeconfig available for further use.

---

2. **Define an IAM policy document for EBS CSI driver**:

```python
trust_document = aws.iam.get_policy_document_output(statements=[{
    "sid": "AllowAssumeRoleWithWebIdentity",
    "actions": ["sts:AssumeRoleWithWebIdentity"],
    "effect": "Allow",
    "conditions": [{
        "test": "StringEquals",
        "variable": pulumi.Output.concat(eks_cluster.core.oidc_provider.url, ":aud"),
        "values": ["sts.amazonaws.com"],
    }, {
        "test": "StringEquals",
        "variable": pulumi.Output.concat(eks_cluster.core.oidc_provider.url, ":sub"),
        "values": [pulumi.Output.concat("system:serviceaccount:kube-system:ebs-csi-controller-sa")],
    }],
    "principals": [{
        "type": "Federated",
        "identifiers": [eks_cluster.core.oidc_provider.arn],
    }],
}])
```
Creating the IAM policy document required for the EBS CSI driver.

---

3. **Export the policy document JSON**:

```python
pulumi.export("policyJson", trust_document.json)
```
Exporting the policy document for visibility.

---

4. **Create an IAM role for EBS CSI driver**:

```python
csi_role = aws.iam.Role("ebs-csi", 
    assume_role_policy=trust_document.json,
)
```
Creating an IAM role with the policy document.

---

5. **Attach AmazonEBSCSIDriverPolicy to the IAM role**:

```python
aws.iam.RolePolicyAttachment("ebs-csi",
    role=csi_role.name,
    policy_arn="arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy",
)
```
Attaching the necessary policy to the IAM role.

---

6. **Add the EBS CSI driver to the EKS cluster**:

```python
csi_addon = aws.eks.Addon("ebs-csi-driver",
    addon_name="aws-ebs-csi-driver",
    addon_version="v1.29.1-eksbuild.1",
    cluster_name=eks_cluster.core.cluster.name,
    service_account_role_arn=csi_role.arn,
)
```
---


7. **Create a Kubernetes provider using the EKS cluster kubeconfig**:
```python
k8s_provider = k8s.Provider("k8s-provider",
    kubeconfig=eks_cluster.kubeconfig,
)
```
Setting up the Kubernetes provider to interact with the cluster.

---

8.  **Deploy the WordPress Helm chart**:
```python
wordpress_chart = k8s.helm.v3.Chart("wordpress-chart",
    k8s.helm.v3.ChartOpts(
        fetch_opts=k8s.helm.v3.FetchOpts(
            repo="https://charts.bitnami.com/bitnami",
        ),
        chart="wordpress",
        values={
            "service": {
                "type": "LoadBalancer"
            }
        }
    ),
    opts=pulumi.ResourceOptions(provider=k8s_provider),
)
```
Deploying the WordPress application using a Helm chart.

---

9.  **Check and export the WordPress service URL**:
```python
frontend_service = wordpress_chart.get_resource("v1/Service", "wordpress-chart-wordpress")
pulumi.export("chartUrl", frontend_service.status.apply(lambda status: f"http://{status.load_balancer.ingress[0].hostname}" if status and status.load_balancer.ingress else "Service not available"))
```
