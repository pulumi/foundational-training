import * as pulumi from "@pulumi/pulumi";
import * as eks from "@pulumi/eks";

const org = pulumi.getOrganization();

const stackRef = new pulumi.StackReference("vpc-stack", {
  name: `${org}/esc-ex-03-vpc-ts/dev`
});

const vpcId = stackRef.getOutput("vpcId");
const publicSubnetIds = stackRef.getOutput("publicSubnetIds") as pulumi.Output<string[]>;
const privateSubnetIds = stackRef.getOutput("privateSubnetIds") as pulumi.Output<string[]>;


const eksCluster = new eks.Cluster("eks-cluster", {
  vpcId: vpcId,
  publicSubnetIds: publicSubnetIds,
  privateSubnetIds: privateSubnetIds,

  instanceType: "t3.medium",
  desiredCapacity: 3,
  minSize: 3,
  maxSize: 3,
  nodeAssociatePublicIpAddress: false,
  endpointPrivateAccess: false,
  endpointPublicAccess: true,
});

export const kubeconfig = eksCluster.kubeconfig;