import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();

    statementsRepositoryInMemory = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it("Should be able to create a new deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "Renato Batistta",
      email: "renato@email.com",
      password: "pass",
    });

    const statement = await createStatementUseCase.execute({
      amount: 5000,
      description: "wage",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should be able to create a new withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "Kim Kataguiri",
      email: "kim@email.com",
      password: "pass123",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 10000,
      type: OperationType.DEPOSIT,
      description: "description",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 300,
      type: OperationType.WITHDRAW,
      description: "description",
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should not be able make a deposit whose value is greater than the user's balance", async () => {
    const user = await createUserUseCase.execute({
      name: "Samuca shang",
      email: "shang@email.com",
      password: "pass111",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 100,
      type: OperationType.DEPOSIT,
      description: "description",
    });

    await expect(
      createStatementUseCase.execute({
        user_id: user.id as string,
        amount: 101,
        type: OperationType.WITHDRAW,
        description: "description",
      })
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  });

  it("Should not be able make an operation if a user is not registered", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: "1234556",
        amount: 100,
        type: OperationType.DEPOSIT,
        description: "description",
      })
    ).rejects.toEqual(new CreateStatementError.UserNotFound());
  });
});
