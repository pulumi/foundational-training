---
theme: default
paginate: true
header: "Pulumi + Docker"
---

# 🌐 Overview

- Docker provider - 2018
  - Updated over the years, added `build-on-preview`.
  - `v3` and `v4` are still widely popular for image building but the `docker.Image` resource is to be deprecated.
  - **Recommend** Continue using it to manage non-image building resources. eg Containers, Networks, Volumes.
- Docker Build provider - 2024 **in preview**
  - Align with Docker's official support for BuildKit functionality (v23)
  - **Recommend** to migrate all images to `docker_build.Image`.

---

## Docker provider v3 Image

- `v3` exposes BuildKit functionality through raw command-line arguments. The `extraOptions` field became a catch-all for BuildKit then-experimental features.
- Needs `DOCKER_BUILDKIT` to use the `extraOptions` Example,

  ```typescript
  const v3 = new docker.Image("v3-image", {
  // ...
    env: {  DOCKER_BUILDKIT: "1", },
      extraOptions: [
        "--cache-from", "type=registry,myregistry.com/user/repo:cache",
        "--cache-to", "type=registry,myregistry.com/user/repo:cache",
        "--platform",  "linux/amd64",
      ],
    },
  // ...
  });
  ```

---

## Docker provider v4 Image

- Does *not* support `extraOptions` (nor secrets).
- `v4` uses the `build` Input to configure *some* BuildKit params. Example,

  ```typescript
  const v4 = new docker.Image("v4-image", {
  // ...
      build: {
          dockerfile: "./Dockerfile",
          context: "../app",
          target: "mytarget",
          cacheFrom: {
              images: ["myregistry.com/user/repo:cache"],
          },
          platform: "linux/amd64",
      },
  // ...
  });
  ```

---

## Docker Build provider

- Exposes v4 `build` arguments as top-level fields on the resource.
- Pluralized or renamed params to better align with the Docker CLI, e.g., `registries`, `platforms`, etc.
- Full BuildKit support (yes, secrets)
- Docker Build Cloud option (or other builders)
- Multi-platform support
- Multi-registry push

---

## Docker Build provider image example

```typescript
// ... other code...
// Build and push an image to ECR with inline caching.
const image = new dockerBuild.Image(ownership.Project + "-image", {
    tags: [ pulumi.interpolate`${repo.repositoryUrl}:${commitTag}`,],
    context: { location: "../app",},
    platforms: [ dockerBuild.Platform.Linux_amd64,],
    push: isCI,
    buildOnPreview: true, // always build on preview
    registries: [{
        address: repo.repositoryUrl,
        password: registryId.password,
        username: registryId.userName,
    }],
});
```

---

## Docker Build image defaults

- Docker Build image does **not** push images, set `push` to `true` to override.
- Docker Build image builds images during previews, set `buildOnPreview` to `false` to override.
- Tags: Docker image tags are appended (rather than replaced) to the existing tag set for a given Image resource.
  - **Recommended** Use a separate tool (a lifetime policy or otherwise) to delete old tags. Verify ECR `imageTagMutability: "IMMUTABLE"` option.
  - It's possible to use the resource options `replaceOnChanges: [ "tags" ]` with `deleteBeforeReplace: true` however this may be excessive.

---

## Migrating to `docker_build.Image` from `docker.Image`

- Use `.ref` instead of `.imageName` when referencing the Image in a service/container. (Or `digest`, if you have multiple tags. )
- `registry.server` is now `registries[].address`
- Use `buildOnPreview` and `push` as needed to maintain existing behavior.
- Consult the [registry docs](https://www.pulumi.com/registry/packages/docker-build/api-docs/image/) for other changes.

---

## What about the AWSx ECR Image resource?

- Currently, the `awsx.ecr.Image` still uses the Docker provider.
- Expected to be updated to Docker Build without any behavior changes.
- Expected to automatically store and use an inline cache if the user hasn't configured anything explicitly.
- [GitHub Issue](https://github.com/pulumi/pulumi-awsx/pull/1278)
