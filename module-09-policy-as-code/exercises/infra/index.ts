import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";

new aws.s3.Bucket("policy-as-code-workshop");

new aws.ec2.Instance("policy-as-code-workshop", {
  ami: "abc123",
  associatePublicIpAddress: false,
  instanceType: "t3.micro"
});

new docker.Image("policy-as-code-workshop", {
  imageName: "docker.io/joshkodroff/pulumi-policy-test",
  buildOnPreview: false,
  build: {
    dockerfile: "./Dockerfile",
    platform: "linux/amd64"
  }
});