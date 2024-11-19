import * as pulumi from "@pulumi/pulumi";

const stackRef = new pulumi.StackReference("{orgname}/{projectname}/dev");

const petName = stackRef.getOutput("petName");
const password = stackRef.getOutput("passwordValue");

export const consumedPetName = petName;
export const consumedPassword = password;
