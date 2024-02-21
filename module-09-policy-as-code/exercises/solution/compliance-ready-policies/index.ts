import { PolicyPack } from "@pulumi/policy";
import { policyManager } from "@pulumi/compliance-policy-manager";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

// pulumi config set MY_NAME bugs-bunny  
const name = config.require("MY_NAME");

new PolicyPack("compliance-ready-policies-" + name, {
    policies:[
        ...policyManager.selectPolicies({
            vendors: ["aws"],
            services: ["ec2"], // ["alb", "apigateway", "apigatewayv2", "appflow", "athena", "cloudfront", "ebs", "ec2", "ecr", "efs", "eks", "elb", "iam", "kms", "lambda", "rds", "s3", "secretsmanager"],
            // severities: ["critical", "high", "low", "medium"],
            // topics: ["availability", "backup", "container", "cost", "documentation", "encryption", "kubernetes", "logging", "network", "performance", "permissions", "resilience", "security", "storage", "vulnerability"],
            frameworks: ["pcidss"] // Other available frameworks: cis", "iso27001", "pcidss
        }, "mandatory"),
        ...policyManager.selectPolicies({
            vendors: ["aws"],
            services: ["s3"],
            // severities: ["critical", "high", "low", "medium"],
            // topics: ["availability", "backup", "container", "cost", "documentation", "encryption", "kubernetes", "logging", "network", "performance", "permissions", "resilience", "security", "storage", "vulnerability"],
            frameworks: ["pcidss"] // Other available frameworks: cis", "iso27001", "pcidss
            
        }
        , "advisory"),
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
