---
theme: default
paginate: true
header: "Pulumi + Docker"
---

## Use the Docker build provider to deploy a workload on ECS on Fargate

- Deploy the following resources:
  - ECS Cluster, `aws.ecs.Cluster`
  - ALB, `awsx.lb.ApplicationLoadBalancer`
  - ECR, `awsx.ecr.Repository`
  - Fargate Service, `awsx.ecs.FargateService`
  - Use `FROM nginx` in a Dockerfile
  - Docker Image, `dockerBuild.Image`

Output the loadbalancer URL.To get the ECR credentials:

```typescript
const auth = aws.ecr.getAuthorizationTokenOutput({
    registryId: ecr.repository.registryId,
});
```
