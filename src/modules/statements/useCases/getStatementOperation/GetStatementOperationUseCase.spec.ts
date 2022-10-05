import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get statement operation", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();

    statementRepositoryInMemory = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      userRepositoryInMemory,
      statementRepositoryInMemory
    );

    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      userRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("Should be able get statement user`s", async () => {
    const user = await createUserUseCase.execute({
      name: "Renan Santos",
      email: "renan@email.com",
      password: "3333",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 2000,
      type: OperationType.DEPOSIT,
      description: "alli",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 1300,
      type: OperationType.WITHDRAW,
      description: "boleto",
    });

    const statementResponse = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(statementResponse.id).toEqual(statement.id);
  });

  it("Should not be able to get the statement from a non-existing user", async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: "123",
        statement_id: "123",
      })
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it("Should not be able to get non-existing statement", async () => {
    const user = await createUserUseCase.execute({
      name: "Arthur Moledo",
      email: "arthurgalego@email.com",
      password: "ukraine",
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "123",
      })
    ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });
});
