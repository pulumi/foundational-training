"""A Python Pulumi program"""

import pulumi
import json
import pulumi_aws as aws
import pulumi_docker as docker

aws.iam.Role(
    "test-setup",
    assume_role_policy=json.dumps({
        "Version": "2008-10-17",
        "Statement": [{
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "Service": "ecs-tasks.amazonaws.com"
            },
            "Action": "sts:AssumeRole",
        }]
    }),
)

docker.Image(
    "test-setup",
    skip_push=True,
    image_name="foo",
    build=docker.DockerBuildArgs(
        dockerfile="./Dockerfile"
    ),
)
