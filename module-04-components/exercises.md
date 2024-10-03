# Module 06: Components - Exercises

## Exercise: Refactoring to ComponentResources

In an exercise in the stacks module, we created an ECS on Fargate workload and separated it into 2 separate stacks. We'll now take the workload resources and refactor them into a ComponentResource so they can be reused to create multiple Fargate workloads without unnecessarily repeating code.

1. If you haven't yet done so, make sure the shared resources stack (VPC, ALB, ECS Cluster) is still spun up.
1. Create a new file to hold the component. `workload.ts` in TypeScript, `workload.py` in Python, etc.
1. In the component file, create an arguments class for the Component. As a refresher, the arguments class is the second parameter to a Pulumi resource. functions similarly to e.g. `aws.ec2.VpcArgs` does for `aws.ec2.Vpc` Note that the fields in the args class should be of type `pulumi.Input<T>`.

    See the module lecture notes for an example of an args class.

1. In the component file, create a ComponentResource that takes the args class you created as an argument.

    See the module lecture notes for an example of a ComponentResource.

1. In the component's constructor, create the resources that comprise the workload. You'll need to ensure the following:

    - Be sure to set the `parent` resource option so that all resources in the ComponentResource are correctly displayed in `preview` and `update`. Note that this is similar to the way resources display for `awsx.ec2.Vpc` - as a tree under the parent component.
    - Template the names of the resources so that they include the `name` parameter of the ComponentResource.
  
      For example, if the component is created with a name `foo`, the Route 53 record resource should have the name `foo-record`. This will allow the component to be called multiple times without creating naming collisions.

1. After creating the resources, add the public URL of the service as an output. Also, be sure to call `registerOutputs` in the last line of the constructor.
1. Now that your ComponentResource has been authored, back in the main file (`index.ts` or `__main__.py`), import and instantiate the resource several times in the same program:

    1. An instance of the `httpd` container (i.e. "Apache") with the DNS/service name `httpd1`.
    1. A second instance of the `httpd` container (i.e. "Apache") with the DNS/service name `httpd2`.
    1. An instance of the `nginx` container with the DNS/service name `nginx`.

  Note the following when verifying the results:
  
    - You'll get an HTTP 503 (service temporarily unavailable) while the load balancer is waiting for the health check to pass. This is normal and takes about 60 seconds to resolve.
    - The httpd default index page simply says "It works!" in `<h1>`, so if you are seeing this page, httpd is running correctly.

For an extra challenge, spin up the old, non-modularized httpd workload and attempt to alias/import it to a Component.

When the module is complete and you have shown your work to an instructor, you can run `pulumi destroy` on this stack as well as the share resources.
