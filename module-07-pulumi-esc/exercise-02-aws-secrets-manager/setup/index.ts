import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();

const gitHubToken = config.requireSecret("githubToken");

const secret = new aws.secretsmanager.Secret("github-token", {
  description: "GitHub token for ESC.",
  recoveryWindowInDays: 0
});

new aws.secretsmanager.SecretVersion("github-token", {
  secretId: secret.id,
  secretString: gitHubToken
});

export const secretId = secret.id.apply(id => id.split(":").at(-1));

const envYaml = `

`