# Exercise 01: Stack references

In this exercise, you will create two projects: the first will create two resources and export them as stack outputs. The second will read in these values and write them out to the console as values to show that they have been referenced properly.

1. Create a new folder and two sub-folders. Then change to the `output-references` folder:

   ```bash
   mkdir stack-references-exercise
   mkdir -p stack-references-exercise/output-references
   mkdir -p stack-references-exercise/read-references

   cd stack-references-exercise/output-references
   ```

2. Create a new project: `pulumi new typescript -y` [^1]

3. Install the `Random` Pulumi SDK: `npm install @pulumi/random`

4. In the index.ts create a `Random Pet` resource and a `Random Password` resource:

   ```typescript
   import * as random from "@pulumi/random";

   const myPassword = new random.RandomPassword("myPassword", {
     length: 20,
   });

   const myPet = new random.RandomPet("myPet", {
     length: 2,
   });

   export const passwordValue = myPassword.result;
   export const petName = myPet.id;
   ```

   The reason that there are two outputs is that the `.result` output of the `RandomPassword` resource is a secret and the `.id` output of the RandomPet resource is not. This means that you will be able to see what the two different types look like in the console.

5. Run `pulumi up`. You will see that the value of the `petName` output is in plaintext and the `passwordValue` output is `[secret]` as a mask. If you would like to see the plaintext value of this, you can run `pulumi stack output passwordValue --show-secret`. You can see the value of the `petName` output you can run `pulumi stack output petName` and you don't need the `--show-secret` argument.

6. Change to the `read-references` folder: `cd ../read-references`

7. Create a new project: `pulumi new typescript -y`

8. Copy and paste the following into the `index.ts`:

   ```typescript
   import * as pulumi from "@pulumi/pulumi";

   const stackRef = new pulumi.StackReference("{orgname}/{projectname}/dev");

   const petName = stackRef.getOutput("petName");
   const password = stackRef.getOutput("passwordValue");

   export const consumedPetName = petName;
   export const consumedPassword = password;
   ```

   Note the following:

   - `{orgname}` is the organisation or account name that you're using
   - `{projectname}` is the project name. If you didn't use the `-y` flag when creating the project or named the folder something different, this may have a different value

9. Run `pulumi up`

10. Same as before, note that the `consumedPetName` value is plaintext and `consumedPassword` is a secret. You can run `pulumi stack output consumedPetName` or `pulumi stack output consumedPassword --show-secret` to show the values.

11. Run `pulumi destroy` to remove these resources, then change to the other folder and do the same: `cd ../output-references && pulumi destroy` [^2]

[^1]: The `-y` argument here fills out all the responses to the wizard with the default options and creates a `dev` stack.

[^2]: The `Random*` resources are free in terms of that there is no cloud infrastructure to incur cost, but it's always good practice to remove them to tidy up.
