# Exercise 03: Stack References and Files in ESC

In this exercise, you'll learn how to use ESC to:

1. Replace stack references with configuration.
1. Use ESC to generate temporary files.

In order to complete this exercise, you'll need to install `kubectl`: <https://kubernetes.io/docs/tasks/tools/>

You may also want to install k9s, which adds a text user interface (TUI), which can make Kubernetes administration easier compared to `kubectl`: <https://k9scli.io/topics/install/>

In this exercise, we'll explore a common multi-program infrastructure setup:

1. A stack containing a VPC (which would typically be owned by the platform or networking team).
1. A stack containing an EKS cluster (which would typically be owned by the platform team).
1. A stack containing a Kubernetes workload (NGINX, because it's easy to deploy, which would typically be owned by an application team).

## Part 1: Stack Reference in ESC

1. Spin up the VPC stack:

    ```bash
    cd 01-vpc-ts
    npm i
    pulumi up -y
    ```

    or Python:

    ```bash
    # TODO
    ```

1. Spin up the EKS stack:

    NOTE: You may need to tweak the stack reference in the EKS and Kubernetes stacks if you are working in a shared Pulumi org: instead of `dev`, use whatever stack name you used to spin up the VPC.

    ```bash
    cd ../02-eks-ts
    npm i
    pulumi up -y
    ```

    or Python:

    ```bash
    # TODO
    ```

1. In the Pulumi Cloud console, create an environment similar to the following:

    ```yaml
    values:
      stackRefs:
        fn::open::pulumi-stacks:
          stacks:
            vpcInfra:
              stack: vpc-program-name/dev # Replace this with the path to your VPC stack
      pulumiConfig:
        vpcId: ${stackRefs.vpcInfra.vpcId}
        publicSubnetIds: ${stackRefs.vpcInfra.publicSubnetIds}
        privateSubnetIds: ${stackRefs.vpcInfra.privateSubnetIds}
    ```

    Open the environment in the console to verify that the `pulumiConfig` outputs have values.

1. Comment out the stack reference code in the EKS stack so that it takes its values as Pulumi configuration rather than directly from a stack reference:

    ```typescript
    const config = new pulumi.Config();
    const vpcId = config.require("vpcId");
    const publicSubnetIds = config.requireObject<string[]>("publicSubnetIds");
    const privateSubnetIds = config.requireObject<string[]>("privateSubnetIds");
    ```

    ```python
    # TODO
    ```

1. Add the environment to your EKS stack config file:

    ```bash
    environment:
      - your-project-name/esc-ex-03-vpc # Edit these as necessary to match your VPC stack
    ```

1. Preview the EKS cluster. You should see no changes because we've replaces a stack reference with the equivalent config via Pulumi ESC:

    ```bash
    pulumi preview
    ```

## Part 2: ESC File outputs and Kubeconfig

1. Create an environment in the Pulumi Cloud console similar to the following:

    ```yaml
    values:
      stacks:
        fn::open::pulumi-stacks:
          stacks:
            eks-cluster:
              stack: eks-program-name/dev # Change this to match the name of your EKS program/stack
      kubeconfig: {'fn::toJSON': "${stacks.eks-cluster.kubeconfig}"}
      files:
        KUBECONFIG: ${kubeconfig}
    ```

    Open the environment in the Pulumi Cloud console to ensure that the environment is correct.

1. Run a command with the environment. ESC will write the Kubeconfig as a temporary file and remove it once the command completes:

    ```bash
    pulumi env run your-org/your-esc-project/your-env-with-kubeconfig -- kubectl get pods --all-namespaces
    ```

    or, if using K9s (note the `-i` flag for an interactive command):

    ```bash
    pulumi env run -i your-org/your-esc-project/your-env-with-kubeconfig -- k9s
    ```

1. Add the following section at the end of your environment (under `values`) to configure the default Kubernetes provider with the EKS Kubeconfig:

    ```yaml
      pulumiConfig:
        kubernetes:kubeconfig: ${kubeconfig}

1. Spin up the stack containing NGINX:

    ```bash
    cd ../03-k8s-app-ts
    npm i
    pulumi up -y
    ```

    or Python:

    ```bash
    # TODO
    ```

    When the stack has completed running, you should be able to view the NGINX default index page by opening the URL at:

    ```bash
    pulumi stack output url
    ```

## Part 3: Clean Up

NOTE: Tearing down the EKS cluster may take 5 to 10 minutes, so you may want to grab a snack.

1. Tear down the K8s stack:

    ```bash
    pulumi destroy -y
    ```

1. Tear down the EKS cluster:

    ```bash
    cd ../02-eks-ts # or -python
    pulumi destroy -y
    ```

1. Tear down the VPC stack:

    ```bash
    cd ../01-vpc-ts # or -python
    pulumi destroy -y
    ```
