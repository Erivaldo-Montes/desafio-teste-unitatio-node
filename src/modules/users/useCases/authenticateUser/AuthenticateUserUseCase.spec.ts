import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let userRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUseUseCase: CreateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();

    createUseUseCase = new CreateUserUseCase(userRepositoryInMemory);

    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepositoryInMemory
    );
  });

  it("Should be able to log in with a user", async () => {
    const user = {
      name: "José Morais",
      password: "password",
      email: "jose@email.com",
    };

    await createUseUseCase.execute(user);

    const userAuthenticate = await authenticateUserUseCase.execute({
      password: user.password,
      email: user.email,
    });

    expect(userAuthenticate).toHaveProperty("token");
  });

  it("Should not be able to log in with a incorrect email", async () => {
    const user = {
      name: "Cristiano Beraldo",
      password: "password",
      email: "beraldo@email.com",
    };

    await createUseUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        password: user.password,
        email: "jungkook@kpop.com",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("Should not be able to log in with a incorrect password", async () => {
    const user = {
      name: "Guto Zacarias",
      password: "password",
      email: "zacarias@email.com",
    };

    await createUseUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        password: "1234",
        email: user.email,
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });
});
