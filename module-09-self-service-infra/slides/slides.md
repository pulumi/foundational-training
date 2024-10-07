---
theme: default
paginate: true
marp: true
---

# **Module 09: Self-service Infrastructure**

---

## Overview

* What is self-service infrastructure?
* Options with Pulumi
* Pulumi templates
* New Project workflow
* Automation API

---

## Self-Service Infrastructure

* Enabling end-users to get started quickly
* Re-usable solutions
* Great for end-users with little or no Pulumi knowledge
* Great for end-users who don't care about infrastructure

---

## Pulumi Options

* Pulumi templates
* New Project Workflow
* Automation API
* Honourable Mention: Pulumi Backstage plugin

---

## Pulumi Templates

* Standalone Pulumi programs
* What you get with `pulumi new`
* Can specify configuration values

---

## Project YAML Example

```yaml
name: ${PROJECT}
runtime: nodejs
description: ${DESCRIPTION}
template:
  config:
    aws:region:
      description: The AWS region to deploy into
      default: us-west-2
    myAccessToken:
      description: My access token
      secret: true
```

<!--
The above template will produce a project containing:

- A modified Pulumi.yaml file
- New Pulumi.{stackname}.yaml file
- Copy of all the other files co-located with the Pulumi.yaml file
- ${PROJECT} and ${DESCRIPTION} are replaced 
-->

---

## Example

<!-- example 01 -->

---

## New Project Workflow

* Built into Pulumi Cloud
* Shared templates for end-users
* GitHub only as a repository source
* Can use private repositories
* Two options:
  * CLI-based
  * Pulumi Deployments

---

## Demo

---

## Automation API

* Run Pulumi CLI commands through code
* Embed Pulumi programs in code
* Pulumi program orchestrator
* Build custom workflows around Pulumi

---

## Demo

<!-- standalone application with local program and inline program -->

---

## Automation API Ideas

* Build wrapper application
* Build your own CLI
* Embed in REST API

---

## Exercise

<!-- 
automation api: standalone app and rest api 
Rest api should deploy function url with input passed as environment variable to be read into lambda function
-->

---

## Backstage Plugin

* Build Backstage templates to deploy infrastructure through Pulumi
* Pro Tip: Don't just this unless you're either using Backstage already or are 100% committed to using Backstage

<!-- it's a pain to run -->