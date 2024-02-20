import * as aws from "@pulumi/aws";
import { PolicyPack, validateResourceOfType } from "@pulumi/policy";


// Exercise 01: Authoring and Using Resource Policies

new PolicyPack("my-company-policy-diana", {
    policies: [  {
        enforcementLevel: "mandatory", // use "disabled" to turn off, "advisory" to warn, "mandatory" to require
        name: "s3-tags",
        description: "Ensure required tags are present on S3 buckets.",
        validateResource: validateResourceOfType(aws.s3.Bucket, (bucket, args, reportViolation) => {
            if (!bucket.tags || !bucket.tags["Department"]) {
                reportViolation("S3 Bucket is missing required Department tag");
            }
        }),
    } ],
});
