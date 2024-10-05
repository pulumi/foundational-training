# Exercise 01: Refactoring to Components

In this exercise, you will take a VPC and a simple EC2 workload and refactor the latter into a ComponentResource.

1. Initialize a Pulumi program with the following content (you don't need to run an update to provision the resources):

    ```typescript
    import * as pulumi from "@pulumi/pulumi";
    import * as awsx from "@pulumi/awsx";
    import * as aws from "@pulumi/aws";

    const vpc = new awsx.ec2.Vpc("components-refactor", {
      natGateways: {
        strategy: "Single"
      }
    });

    const subnetId = vpc.privateSubnetIds.apply(ids => ids[0]);

    const sg = new aws.ec2.SecurityGroup("security-group", {
      vpcId: vpc.vpcId,
      description: "Allow all outbound traffic and no inbound traffic",
      egress: [{
        protocol: "-1",
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"],
      }],
      tags: {
        Name: "components-refactor"
      }
    });

    const ami = aws.ec2.getAmiOutput({
      mostRecent: true,
      owners: ["amazon"],
      filters: [{
        name: "name",
        values: ["amzn2-ami-hvm-*-x86_64-gp2"],
      }],
    });

    new aws.ec2.Instance("my-server", {
      subnetId: subnetId,
      instanceType: aws.ec2.InstanceType.T3_Micro,
      ami: ami.id,
      vpcSecurityGroupIds: [sg.id],
      associatePublicIpAddress: true,
      tags: {
        Name: "components-refactor",
      },
    });
    ```

1. Create a new file to hold the component. `workload.ts` in TypeScript, `workload.py` in Python, etc.
1. In the component file, create an arguments class for the Component. As a refresher, the arguments class is the second parameter to a Pulumi resource. (The args class functions similarly to e.g. `aws.ec2.VpcArgs` does for `aws.ec2.Vpc`.)

    Note that the fields in the args class should be of type `pulumi.Input<T>`.

    See the module lecture notes for an example of an args class.

1. In the component file, create a ComponentResource that takes the args class you created as an argument.

    See the module lecture notes for an example of a ComponentResource.

1. In the component's constructor, create the resources that comprise the workload. You'll need to ensure the following:

    - Be sure to set the `parent` resource option so that all resources in the ComponentResource are correctly displayed in `preview` and `update`. Note that this is similar to the way resources display for `awsx.ec2.Vpc` - as a tree under the parent component.
    - Template the names of the resources so that they include the `name` parameter of the ComponentResource.

      For example, if the component is created with a name `foo`, the security group should have the name `foo-security-group`. This will allow the component to be called multiple times without creating naming collisions.

1. After creating the resources, add the IP address of the EC2 instance as an output. Also, be sure to call `registerOutputs` in the last line of the constructor.
1. Now that your ComponentResource has been authored, back in the main file (`index.ts` or `__main__.py`), import and instantiate the component 3 times, once for each private subnet in the VPC.
1. Ensure that `pulumi up` completes successfully. Verify that the EC2 instance and security groups are clearly named in the AWS console.
