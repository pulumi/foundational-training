import * as pulumi from "@pulumi/pulumi";
// npm install @pulumi/aws 
// pulumi config set aws:region us-east-1
import * as aws from "@pulumi/aws";

async function getStackOutput(stackName: string, outputKey: string): Promise<string> {
    const stack = await aws.cloudformation.getStack({
        name: stackName,
    });
    // For debugging purposes
    // console.log(stack.outputs);
    const output = stack.outputs[outputKey];
    if (!output) {
        throw new Error(`Missing expected output with key '${outputKey}'`);
    }

    return output;
}

const stackName = "CdkStack";
const vpcIdPromise = getStackOutput(stackName, "vpcId");
const privateSubnetIdPromise = getStackOutput(stackName, "privateSubnetId0");


// Part 1
// Export the VPC and private subnet IDs from the referenced CloudFormation stack
export const vpcId = vpcIdPromise;
export const privateSubnetId = privateSubnetIdPromise;


// Part 2
// Create a security group for the EC2 instance
const ec2SecurityGroup = new aws.ec2.SecurityGroup("ec2-security-group", {
    vpcId,
    description: "Allow inbound HTTP",
    ingress: [{
        description: "Allow inbound HTTP",
        fromPort: 80,
        toPort: 80,
        protocol: "tcp",
        cidrBlocks: ["0.0.0.0/0"],
    }],
    egress: [{ // Allow all outbound traffic
        fromPort: 0,
        toPort: 0,
        protocol: "-1",
        cidrBlocks: ["0.0.0.0/0"],
    }],
});

// Create a new EC2 instance running NGINX on a t3.micro
const ec2Instance = new aws.ec2.Instance("nginx-ec2-instance", {
    // https://cloud-images.ubuntu.com/locator/ec2/
    ami: "ami-07d9b9ddc6cd8dd30", // Replace with the AMI ID for your region
    instanceType: "t3.micro",
    subnetId: privateSubnetId,
    vpcSecurityGroupIds: [ec2SecurityGroup.id],
    // keyName: "my-key-name", // Replace with your key name N/A
    userData: `#!/bin/bash
        # Install NGINX
        sudo yum update -y
        sudo amazon-linux-extras install nginx1.12 -y
        sudo systemctl start nginx
        sudo systemctl enable nginx`,
    tags: {
        Name: "NGINXWebServer",
    },
});

export const instanceId = ec2Instance.id;