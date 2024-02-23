import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();

// pulumi config set MY_NAME bugs-bunny  
const name = config.require("MY_NAME");


// Create a KMS Customer Master Key (CMK)
const kmsKey = new aws.kms.Key("policy-as-code-workshop-" + name, {
  description: "Exercise 2 -  KMS key",
  multiRegion: true,
  deletionWindowInDays: 7, // valid values are 7-30

});


new aws.ec2.Instance("policy-as-code-workshop-" + name, {
  // https://cloud-images.ubuntu.com/locator/ec2/
  ami: "ami-08f7912c15ca96832", // Replace with the AMI ID for your region, us-west-2
  associatePublicIpAddress: false,
  instanceType: "t3.micro"
});


// Exercise 02: Using Compliance-Ready Policies

// [Replication reqs link](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html#replication-requirements)
// Create an IAM role for S3 to assume
const replicationRole = new aws.iam.Role("replicationRole", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Action: "sts:AssumeRole",
      Effect: "Allow",
      Principal: {
        Service: "s3.amazonaws.com",
      },
    }],
  }),
});

// Attach the policy to the role for replication permissions
new aws.iam.RolePolicyAttachment("replicationRolePolicyAttachment", {
  role: replicationRole.id,
  policyArn: aws.iam.ManagedPolicy.AmazonS3FullAccess,
});

// Create a destination bucket in another region with versioning enabled
const destinationBucket = new aws.s3.Bucket("policy-as-code-workshop-dest-" + name, {
  versioning: {
    enabled: true,
  },
  // Enabling server-side encryption by default using AES256
  serverSideEncryptionConfiguration: {
    rule: {
      applyServerSideEncryptionByDefault: {
        sseAlgorithm: "aws:kms",
        kmsMasterKeyId: kmsKey.id,
      },
      bucketKeyEnabled: true,
    },
  },
    // // replication config is needed for exercise 02
    // replicationConfiguration: {
    //   role: replicationRole.arn,
    //   rules: [{
    //     status: "Enabled",
    //     destination: {
    //       bucket: "",
    //     },
    //   }],
    // },

}, {
  provider: new aws.Provider("policy-as-code-workshop-dest" + name, {
    region: aws.Region.USWest1, // example destination region
  }),
});

const sourceBucket = new aws.s3.Bucket("policy-as-code-workshop-" + name, {

  // Exercise 01: Authoring and Using Resource Policies
  tags: {
    // "Department": "Engineering",
    "Owner": name,
  },
  // Versioning is needed for exercise 02
  versioning: {
    enabled: true,
  },
  // replication config is needed for exercise 02
  replicationConfiguration: {
    role: replicationRole.arn,
    rules: [{
      status: "Enabled",
      filter: {
        prefix: "", // an empty string means to replicate everything
      },
      destination: {
        bucket: destinationBucket.arn,
      },
    }],
  },
  // Enabling server-side encryption by default using AES256
  serverSideEncryptionConfiguration: {
    rule: {
      applyServerSideEncryptionByDefault: {
        sseAlgorithm: "aws:kms",
        kmsMasterKeyId: kmsKey.id,
      },
      bucketKeyEnabled: true,
    },
  },


});

// Enable replication on the source bucket
const bucketReplicationRolePolicy = new aws.iam.Policy("policy-as-code-workshop-" + name, {
  policy: pulumi.all([sourceBucket.arn, destinationBucket.arn, replicationRole.arn])
    .apply(([sourceBucketArn, destinationBucketArn, replicationRoleArn]) =>
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
          Action: [
            "s3:GetReplicationConfiguration",
            "s3:ListBucket",
          ],
          Effect: "Allow",
          Resource: [
            sourceBucketArn,
          ],
        }, {
          Action: [
            "s3:GetObjectVersionForReplication",
            "s3:GetObjectVersionAcl",
            "s3:GetObjectVersionTagging",
          ],
          Effect: "Allow",
          Resource: [
            `${sourceBucketArn}/*`,
          ],
        }, {
          Action: [
            "s3:ReplicateObject",
            "s3:ReplicateDelete",
            "s3:ReplicateTags",
            "s3:GetObjectVersionForReplication",
          ],
          Effect: "Allow",
          Resource: [
            `${destinationBucketArn}/*`,
          ],
        }],
      })
    ),
});

new aws.iam.RolePolicyAttachment("policy-as-code-workshop-" + name, {
  role: replicationRole.name,
  policyArn: bucketReplicationRolePolicy.arn,
});
