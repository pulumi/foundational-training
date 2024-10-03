import * as aws from "@pulumi/aws";
import { PolicyPack, validateResourceOfType } from "@pulumi/policy";

new PolicyPack("my-company-policy-bugs-bunny", {
    policies: [],
});
