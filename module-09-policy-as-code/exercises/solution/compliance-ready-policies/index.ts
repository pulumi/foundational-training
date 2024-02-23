import { PolicyPack, ReportViolation, StackValidationArgs, StackValidationPolicy } from "@pulumi/policy";
import { policyManager } from "@pulumi/compliance-policy-manager";
import * as aws from "@pulumi/aws";
// import { ResolvedResource } from "@pulumi/pulumi/queryable";

const name = "diana"
const enableReplicationConfigurationExceptDestinationBuckets: StackValidationPolicy = {
    name: "policy-as-code-workshop-dest" + name,
    description: "enableReplicationConfigurationExceptDestinationBuckets",
    enforcementLevel: "mandatory",
    validateStack: (args: StackValidationArgs, reportViolation: ReportViolation) => {

        const unreplicatedBucketList = args.resources.map(r => r.asType(aws.s3.Bucket)).filter(r =>
            r?.replicationConfiguration === undefined ||
            r?.replicationConfiguration?.rules === undefined ||
            r?.replicationConfiguration?.rules.length < 1 ||
            r?.replicationConfiguration?.rules.every(rule => rule.status === "Disabled")
        );

        let destinationBucketARNList: string[] = [];

        const replicatedBucketList = args.resources.map(r => r.asType(aws.s3.Bucket)).filter(r =>
            (r?.replicationConfiguration?.rules?.length ?? 0) > 0 &&
            r?.replicationConfiguration?.rules.some(rule => rule.status === "Enabled")
        );
        for (const replicatedBucket of replicatedBucketList) {
            for (const rule of replicatedBucket?.replicationConfiguration?.rules ?? []) {
                if (rule.status == "Enabled") {
                    destinationBucketARNList.push(rule.destination.bucket);
                }
            }
        }

        for (const bucket of unreplicatedBucketList) {
            let arnie: string = bucket?.arn ?? "";
            if (!destinationBucketARNList.includes(arnie)) {
                reportViolation(`every bucket must have at least one enabled replication rule or be a destination bucket of an enabled rule. ${arnie}`);
            }
        }
    },
}

new PolicyPack("compliance-ready-policies-" + name, {
    policies: [
        enableReplicationConfigurationExceptDestinationBuckets,
        ...policyManager.selectPolicies({
            vendors: ["aws"],
            services: ["ec2"], // ["alb", "apigateway", "apigatewayv2", "appflow", "athena", "cloudfront", "ebs", "ec2", "ecr", "efs", "eks", "elb", "iam", "kms", "lambda", "rds", "s3", "secretsmanager"],
            // severities: ["critical", "high", "low", "medium"],
            // topics: ["availability", "backup", "container", "cost", "documentation", "encryption", "kubernetes", "logging", "network", "performance", "permissions", "resilience", "security", "storage", "vulnerability"],
            frameworks: ["pcidss"] // Other available frameworks: cis", "iso27001", "pcidss
        }, "mandatory"),
        ...policyManager.selectPoliciesByName(
            [
                "aws-s3-bucket-configure-replication-configuration",
                "aws-s3-bucket-configure-server-side-encryption-customer-managed-key",
                "aws-s3-bucket-configure-server-side-encryption-kms",
                "aws-s3-bucket-disallow-public-read",
                "aws-s3-bucket-enable-replication-configuration",
                "aws-s3-bucket-enable-server-side-encryption",
                "aws-s3-bucket-enable-server-side-encryption-bucket-key",
                "awsnative-s3-bucket-configure-replication-configuration",
                "awsnative-s3-bucket-configure-server-side-encryption-customer-managed-key",
                "awsnative-s3-bucket-configure-server-side-encryption-kms",
                "awsnative-s3-bucket-disallow-public-read",
                "awsnative-s3-bucket-enable-replication-configuration",
                "awsnative-s3-bucket-enable-server-side-encryption",
                "awsnative-s3-bucket-enable-server-side-encryption-bucket-key",
            ]   // services: ["s3"],
            , "mandatory"),
    ]
});

/**
 * Optional✔️: Display additional stats and helpful
 * information when the policy pack is evaluated.
 */
policyManager.displaySelectionStats({
    displayGeneralStats: true,
    displayModuleInformation: true,
    displaySelectedPolicyNames: true,
});
