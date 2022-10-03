import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

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

    console.log(userAuthenticate);

    expect(userAuthenticate).toHaveProperty("token");
  });
});
