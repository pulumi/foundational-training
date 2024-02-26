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

1. Now we will add a simple, stateless workload (NGINX) to the cluster.

    Because you are creating a cluster and then deploying resources into that cluster within the same Pulumi program, you will need to create an explicit provider. If you did not create this explicit provider, the default K8s provider would use your system Kubeconfig, which isn't what you want - you need the Kubeconfig for the cluster you just created.

    Create an explicit Kubernetes provider toward the end of your Pulumi program:

    ```typescript
    const k8sProvider = new k8s.Provider("k8s-provider", {
      kubeconfig: kubeconfig,
    });
    ```

1. Using the following YAML as a reference, create a NGINX Kubernetes Deployment and a corresponding `LoadBalancer` Service. There's several ways that you could go about this

    ```yaml
    
    ```
