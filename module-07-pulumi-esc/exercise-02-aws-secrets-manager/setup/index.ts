import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
// import * as random from "@pulumi/random";
// import * as pcloud from "@pulumi/pulumiservice";

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

export const envYaml = secret.name.apply(name => `
imports:
  - aws/aws-oidc-admin
values:
  aws:
    secrets:
      fn::open::aws-secrets:
        region: us-west-2
        login: \${aws.login}
        get:
          github-token:
            secretId: ${name}
  pulumiConfig:
    githubToken: \${aws.secrets.github-token-name}
`);

// TODO: Uncomment this once this issue is resolved:
// https://github.com/pulumi/pulumi-pulumiservice/issues/423

// // TODO: Remove this random suffix once this is resolved:
// // https://github.com/pulumi/pulumi-pulumiservice/issues/424
// const suffix = new random.RandomString("env-name-suffix", {
//   length: 6
// });

// // const org = pulumi.getOrganization();

// new pcloud.Environment("aws-secrets", {
//   organization: org,
//   project: "foundational-training",
//   name: pulumi.interpolate`aws-secrets-${suffix.result}`,
//   yaml: envYaml.apply(yaml => new pulumi.asset.StringAsset(yaml))
// });
