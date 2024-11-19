# Exercise 03: Stack References in ESC

In this exercise, you'll learn how to use ESC to:

    1. Replace stack references with configuration.
    2. Use ESC to generate temporary files.

In order to complete this exercise, you'll need to install kubectl: https://kubernetes.io/docs/tasks/tools/

You may also want to install k9s, which adds a text user interface (TUI), which can make Kubernetes administration easier compared to kubectl: https://k9scli.io/topics/install/

## Part 1: Stack Reference in ESC

1. We're going to refer to the projects that you created in module 03. If you don't have those available, you can find it in the `exercise-01-stack-references` folder alongside this guide. Make sure that you at least have the resources in the `output-references` project.

    ```bash
    cd exercise-03-stack-references/output-references
    pulumi stack init {stackname}
    pulumi up
    ```

1. In the Pulumi Cloud console, create an environment similar to the following:

    ```yaml
    values:
        stackRefs:
            fn::open::pulumi-stacks:
                stacks:
                    vpcInfra:
                        stack: output-references/{stackname} # Replace this with the path to your VPC stack
        pulumiConfig:
            password: ${stackRefs.passwordValue}
            petName: ${stackRefs.petName}
    ```

    Open the environment to verify that the `pulumiConfig` outputs have values.

1. You'll need to add the environment to your stack config (`Pulumi.dev.yaml` where `dev` is the name of the stack). You can do this in one or two ways:

    1. Run a command: `pulumi env config add {projectname}/{environmentname}`
    1. Edit the `Pulumi.dev.yaml` file directly so it contains the following (you'll need to create the file if it's not already there):

        ```yaml
        environment:
            - {projectname}/{environmentname}
        ```

1. In the `read-resources` project, you'll be removing or commenting out the lines related to stack references and replacing them with the following:

    ```
    const config = new pulumi.Config();

    export const password = config.get("password");
    export const petName = config.get("petName");
    ```

1. Now you can run `pulumi up` and you should see similar results to the exercise in module 03.

1. Once you're done, run `pulumi destroy` and `pulumi stack rm dev` in both folders to tidy things up. You might also want to delete the environment you created above: `pulumi env rm {projectname}/{environmentname}`.
