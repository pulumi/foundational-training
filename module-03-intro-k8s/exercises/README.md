# Module 03: Intro to Kubernetes

## Exercise 01: Creating an EKS Cluster and Deploying a Simple Workload

1. Initialize a new Pulumi project:

    ```bash
    mkdir simple-k8s-cluster
    cd simple-k8s-cluster
    pulumi new kubernetes-aws-typescript 
    ```

    The default responses for the prompts should be fine, but you may want to change the region into which the cluster is deployed if the default of `us-west-2` is far away from where you are.

1. Spin up the Kubernetes cluster:

    ```bash
    pulumi up
    ```

1. Export the cluster's Kubeconfig to a local file:

    ```bash
    pulumi stack output kubeconfig > kubeconfig.yml
    ```

    Because this cluster is set up to use IAM authentication, you do not need to worry about leaking secrets.

1. Verify that the cluster is working by running either `kubectl` commands or exploring the cluster with a tool like <https://k9scli.io>:

    ```bash
    KUBECONFIG=kubeconfig.yml k9s
    ```

1. Import the Pulumi Kubernetes provider and add a reference to your Pulumi program:

    ```bash
    npm i @pulumi/kubernetes
    ```

    ```typescript
    import * as k8s from "@pulumi/kubernetes";
    ```

1. Now we will add a simple, stateless workload (NGINX) to the cluster.

    Because you are creating a cluster and then deploying resources into that cluster within the same Pulumi program, you will need to create an explicit provider. If you did not create this explicit provider, the default K8s provider would use your system Kubeconfig, which isn't what you want - you need the Kubeconfig for the cluster you just created.

    Create an explicit Kubernetes provider toward the end of your Pulumi program:

    ```typescript
    const k8sProvider = new k8s.Provider("k8s-provider", {
      kubeconfig: kubeconfig,
    });
    ```

1. Using the YAML at the end of this step as a reference, create a NGINX Kubernetes Deployment and a corresponding `LoadBalancer` Service. There's several ways that you could go about this:

    1. Hand-author `kubernetes.apps.v1.Deployment` and `kubernetes.core.v1.Service` resources based off the YAML below.
    1. Put the YAML in a file and reference it via a `kubernetes.yaml.ConfigFile` or `kubernetes.yaml.ConfigGroup`.
    1. Convert the YAML to Pulumi K8s resources with `kube2pulumi`.

    Note that for all approaches, you must specify the explicit provider in any resources you author, e.g.:

    ```typescript
    const deployment = new k8s.apps.v1.Deployment("nginx", {
      // Properties go here
    }, {
      provider: k8sProvider
    });
    ```

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

1. Finally, add an output that will give the DNS name of the load balancer:

    ```typescript
    export const url = nginxService.status.loadBalancer.ingress[0].hostname;
    ```

1. Deploy your program and verify that NGINX is working:

    ```bash
    pulumi up
    curl $(pulumi stack output url)
    ```

    You should see the default NGINX welcome page in the output of the second command.

## Server-Side Apply
