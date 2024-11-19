import * as awsx from "@pulumi/awsx";

const vpc = new awsx.ec2.Vpc("esc-ex-03-vpc", {
  natGateways: {
    strategy: "Single"
  }
});

export const vpcId = vpc.vpcId;
export const publicSubnetIds = vpc.publicSubnetIds;
export const privateSubnetIds = vpc.privateSubnetIds;