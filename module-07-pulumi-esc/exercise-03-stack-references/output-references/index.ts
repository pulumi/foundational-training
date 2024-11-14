import * as random from "@pulumi/random";

const myPassword = new random.RandomPassword("myPassword", {
  length: 20,
});

const myPet = new random.RandomPet("myPet", {
  length: 2,
});

export const passwordValue = myPassword.result;
export const petName = myPet.id;
