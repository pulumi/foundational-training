import * as terraform from "@pulumi/terraform";
import * as aws from "@pulumi/aws";

// pulumi config set aws:region us-east-1

// Instantiate a reference to a remote Terraform state
const remoteState = new terraform.state.RemoteStateReference("remoteState", {
    backendType: "local",
    path: "../terraform/terraform.tfstate", // Replace with the real path to your TF state file
});


// Part 1
// Read the outputs from the remote Terraform state
export const vpcId = remoteState.getOutput("vpc_id");
export const privateSubnets = remoteState.getOutput("private_subnet_ids");
const privateSubnetId = privateSubnets.apply(subnets => subnets[0]);


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
    ami: "ami-08f7912c15ca96832", // Replace with the AMI ID for your region, us-west-2
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