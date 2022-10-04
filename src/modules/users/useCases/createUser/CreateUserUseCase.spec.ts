import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("test", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it("Should be able create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "user",
      password: "password",
      email: "user@email.com",
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able create a new user with same email", async () => {
    await createUserUseCase.execute({
      name: "user1",
      password: "password",
      email: "user1@email.com",
    });

    await expect(
      createUserUseCase.execute({
        name: "user1",
        password: "password",
        email: "user1@email.com",
      })
    ).rejects.toEqual(new CreateUserError());
  });
});
