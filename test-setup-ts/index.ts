import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";

new aws.iam.Role("test-setup", {
  assumeRolePolicy: JSON.stringify({
    Version: "2008-10-17",
    Statement: [{
      Action: "sts:AssumeRole",
      Principal: {
        Service: "ecs-tasks.amazonaws.com",
      },
      Effect: "Allow",
      Sid: "",
    }],
  }),
});

new docker.Image("test-setup", {
  skipPush: true,
  imageName: "foo",
  build: {
    dockerfile: "./Dockerfile"
  }
});