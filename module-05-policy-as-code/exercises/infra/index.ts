import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();

new aws.s3.Bucket("policy-as-code-workshop-");

new aws.ec2.Instance("policy-as-code-workshop-", {
  // https://cloud-images.ubuntu.com/locator/ec2/
  ami: "ami-08f7912c15ca96832", // Replace with the AMI ID for your region, us-west-2
  associatePublicIpAddress: true,
  instanceType: "t3.micro"
});
