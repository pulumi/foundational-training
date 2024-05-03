import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as aws from "@pulumi/aws";
import * as k8s from "@pulumi/kubernetes";

const vpc = new awsx.ec2.Vpc("eks-helm", {
  natGateways: {
    strategy: "Single"
  }
});

const eksCluster = new eks.Cluster("eks-helm", {
  version: "1.29",
  vpcId: vpc.vpcId,
  publicSubnetIds: vpc.publicSubnetIds,
  privateSubnetIds: vpc.privateSubnetIds,
  minSize: 3,
  maxSize: 3,
  desiredCapacity: 3,
  instanceType: aws.ec2.InstanceType.T3_Small,
  nodeAssociatePublicIpAddress: false,
  createOidcProvider: true,
});

export const kubeconfig = eksCluster.kubeconfig;

const trustDocument = aws.iam.getPolicyDocumentOutput({
  statements: [
    {
      sid: 'AllowAssumeRoleWithWebIdentity',
      actions: ['sts:AssumeRoleWithWebIdentity'],
      effect: 'Allow',
      conditions: [
        {
          test: 'StringEquals',
          variable: pulumi.interpolate`${eksCluster.core.oidcProvider!.url}:aud`,
          values: ['sts.amazonaws.com'],
        },
        {
          test: 'StringEquals',
          variable: pulumi.interpolate`${eksCluster.core.oidcProvider!.url}:sub`,
          values: [pulumi.interpolate`system:serviceaccount:kube-system:ebs-csi-controller-sa`],
        },
      ],
      principals: [
        {
          type: 'Federated',
          identifiers: [eksCluster.core.oidcProvider!.arn],
        },
      ],
    },
  ],
});

export const policyJson = trustDocument.json;

const csiRole = new aws.iam.Role("ebs-csi", {
  assumeRolePolicy: trustDocument.json,
});

new aws.iam.RolePolicyAttachment("ebs-csi", {
  role: csiRole.name,
  policyArn: aws.iam.ManagedPolicy.AmazonEBSCSIDriverPolicy,
});

const csiAddOn = new aws.eks.Addon("ebs-csi-driver", {
  addonName: "aws-ebs-csi-driver",
  addonVersion: "v1.29.1-eksbuild.1",
  clusterName: eksCluster.core.cluster.name,
  serviceAccountRoleArn: csiRole.arn,
});

const k8sProvider = new k8s.Provider("k8s-provider", {
  kubeconfig: kubeconfig
});

const wordpressChart = new k8s.helm.v3.Chart("wordpress-chart", {
  fetchOpts: {
    repo: "https://charts.bitnami.com/bitnami"
  },
  chart: "wordpress",
}, {
  provider: k8sProvider,
});

const frontendService = wordpressChart.getResource("v1/Service", "default/wordpress-chart");
export const chartUrl = pulumi.interpolate`http://${frontendService.status.loadBalancer.ingress}`;


// const wordpress = new k8s.helm.v3.Release("wordpress-release", {
//   chart: "wordpress",
//   repositoryOpts: {
//     repo: "https://charts.bitnami.com/bitnami"
//   }
// }, {
//   provider: k8sProvider,
//   dependsOn: csiAddOn,
// });

// export const frontend = wordpress.resourceNames;