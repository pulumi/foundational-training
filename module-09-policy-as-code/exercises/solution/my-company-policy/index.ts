import * as aws from "@pulumi/aws";
import {
    PolicyPack,
    validateResourceOfType,
    remediateResourceOfType, // Exercise 01
} from "@pulumi/policy";


// Exercise 01: Authoring and Using Resource Policies

new PolicyPack("my-company-policy-diana", {
    policies: [{
        enforcementLevel: "remediate", // use "disabled" to turn off, "advisory" to warn, "mandatory" to require
        name: "s3-tags",
        description: "Ensure required tags are present on S3 buckets.",
        validateResource: validateResourceOfType(aws.s3.Bucket, (bucket, args, reportViolation) => {
            if (!bucket.tags || !bucket.tags["Department"]) {
                reportViolation("S3 Bucket is missing required Department tag");
            }
        }),
        remediateResource: remediateResourceOfType(aws.s3.Bucket, (bucket, args) => {
            if (!bucket.tags || !bucket.tags["Department"]) {
                bucket.tags = bucket.tags || {};
                bucket.tags["Department"] = bucket.tags["Department"] || "Oh Yeah!";
            }
            return bucket;
        }),

    }],
});
