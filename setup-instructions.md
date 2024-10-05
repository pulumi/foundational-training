# Pulumi Foundational Training - Setup Instructions

Welcome and thank you for participating in Pulumi Foundational Training! This document will take you through the steps to install and configure Pulumi for use with AWS.

## Overview

In order to verify your setup, you'll need to do the following:

1. Make sure you have an AWS account to which you have administrator access and have configured AWS CLI credentials to use the principal with administrator access.
1. Install either Node.js (<http://nodejs.org/en/download/package-manager>) or Python (<https://www.python.org/downloads/>)
1. Install the AWS CLI: <https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html>
1. Install Terraform: <https://developer.hashicorp.com/terraform/install>
1. Install JQ: <https://jqlang.github.io/jq/download/>
1. [Install Pulumi](#install-pulumi)
1. [Set up Pulumi Cloud](#set-up-pulumi-cloud): Sign up for Pulumi Cloud and configure a Pulumi token
1. [Create a Pulumi Cloud Organization](#create-a-pulumi-cloud-organization): Create a trial Pulumi organization

## Install Pulumi

You can install Pulumi via one of the following methods:

1. Install to your operating system using a package manager or direct download. This method is preferred and can be supported by the workshop instructors. Follow the instructions at <https://www.pulumi.com/docs/install/> for your operating system.
1. Use a [DevContainer](https://code.visualstudio.com/docs/devcontainers/containers) with Visual Studio Code. This method is not supported by the workshop instructors (because we don't have experience using it), but if you know what you're doing, go for it! The Pulumi DevContainer can be found at <https://github.com/pulumi/devcontainer>. Installation instructions are in the README.

## Set up Pulumi Cloud

If you have never used Pulumi before, you should create a Pulumi Cloud account. Pulumi Cloud is free for individual use forever and makes learning Pulumi significantly easier.

The easiest way to create a Pulumi Cloud account and generate your access token is to run the following command:

```bash
pulumi login
```

Follow the prompts to configure your Pulumi Cloud account and access token.

Alternatively, you can follow the following steps:

1. Sign up for a Pulumi Cloud account at <https://pulumip.us/SignUp-Pulumi>. Pulumi Cloud accounts are free for individual use forever, and we will not ask you for payment information.
1. Once your have your Pulumi Cloud account, you will need to add your Pulumi Cloud personal token to your environment. The token authenticates your personal identity with Pulumi Cloud. (You can use your personal token to authenticate with any Pulumi Cloud organization of which you are a member.) To obtain a Pulumi Cloud token, click here in [Pulumi Cloud](https://app.pulumi.com/):

    ![Creating a personal access token](images/personal-access-token.png)

1. Follow the instructions to create a Pulumi Cloud personal token. Place the token's value in your shell's environment, e.g.:

    ```bash
    export PULUMI_ACCESS_TOKEN=pul-4a7028d227cd0f7fac6f3714fec1c3368921f25e
    ```

**Note:** Be careful with your Pulumi access token. Anyone who has its value will be able to authenticate to Pulumi Cloud via the Pulumi CLI.

To verify that Pulumi is working on your system and that your personal token is correctly configured, run the following command:

```bash
pulumi whoami
```

The output from the command should contain your Pulumi Cloud username, e.g.:

```bash
$ pulumi whoami
josh-pulumi-corp
```

## Create a Pulumi Cloud Organization

Some of the later exercises in the workshop will benefit from having your own Pulumi organization. If you don't already have a Pulumi Organization, create a trial organization by navigating to <https://app.pulumi.com/?create-organization=1> or by clicking here in the Pulumi Cloud UI:

![Creating a personal access token](images/create-org.png)

Give your trial organization a name like `training-<your name>`, e.g. `training-joshkodroff` or `training-jkodroff`, etc.

Set your default org to your trial org:

```bash
pulumi org set-default training-jkodroff
```

### Optional: Pre-Install Required Pulumi Plugins

Some Pulumi providers can take a while to download when they are used for the first time. In order to shorten this time, you should run these commands before the workshop begins on your home or hotel wifi:

```bash
pulumi plugin install resource aws
pulumi plugin install resource awsx
```
