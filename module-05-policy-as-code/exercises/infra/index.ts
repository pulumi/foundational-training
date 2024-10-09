import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";


new aws.s3.Bucket("policy-as-code-workshop", {
  tags: {
    "Department": "my department"
  }
});

const latestUbuntuAmi = aws.ec2.getAmiOutput({
  filters: [
    { name: "name", values: ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"] },
    { name: "virtualization-type", values: ["hvm"] },
  ],
  owners: ["099720109477"], // Canonical
  mostRecent: true,
});

new aws.ec2.Instance("policy-as-code-workshop", {
  ami: latestUbuntuAmi.imageId,
  associatePublicIpAddress: true,
  instanceType: "t3.micro"
});
