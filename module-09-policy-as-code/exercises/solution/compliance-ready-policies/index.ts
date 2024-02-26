import { PolicyPack, ReportViolation, StackValidationArgs, StackValidationPolicy } from "@pulumi/policy";
import { policyManager } from "@pulumi/compliance-policy-manager";
import * as aws from "@pulumi/aws";

const name = "bugs-bunny"

const enableReplicationConfigurationExceptDestinationBuckets: StackValidationPolicy = {
    name: "pulumi-stackvalidation-example-" + name,
    description: "every bucket must have at least one enabled replication rule or be a destination bucket of an enabled rule",
    enforcementLevel: "mandatory",
    validateStack: (args: StackValidationArgs, reportViolation: ReportViolation) => {

        const buckets = args.resources
            //StackValidationArgs.PolicyResource[]
            .map(resource => resource.asType(aws.s3.Bucket))
            // Returns the resource if the type of this resource is the same as resourceClass, otherwise undefined.
            // Filter out the undefined values and keep only the ResolvedResource<aws.s3.Bucket> values
            .filter((bucket): bucket is ResolvedResource<aws.s3.Bucket> => bucket !== undefined) ?? [];


        let destinationBucketARNList: string[] = [];
        let sansReplicationBucketARNList: string[] = [];

        for (const bucket of buckets) {
            // Buckets that have at least one enabled replication rule...
            let noRules = true;
            if (bucket.replicationConfiguration != null) {
                const brc = bucket.replicationConfiguration;
                if (brc.rules != null) {
                    for (const rule of brc.rules) {
                        if (rule.status === "Enabled") {
                            noRules = false;
                            destinationBucketARNList.push(rule.destination.bucket);
                        }
                    }
                }
            }
            if (noRules) {
                sansReplicationBucketARNList.push(bucket.arn);
            }
        }

        // Report violations for unreplicated buckets that are not destinations of enabled replication rules
        for (const arn of sansReplicationBucketARNList) {
            if (!destinationBucketARNList.includes(arn)) {
                reportViolation(arn);
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
