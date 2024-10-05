import * as cdk from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, "cf-exercise", {
      natGateways: 1
    });

    new cdk.CfnOutput(this, "vpcId", {
      value: vpc.vpcId,
    });

    vpc.privateSubnets.forEach((subnet, index) => {
      new cdk.CfnOutput(this, `privateSubnetId${index}`, {
        value: subnet.subnetId,
      });
    });
  }
}
