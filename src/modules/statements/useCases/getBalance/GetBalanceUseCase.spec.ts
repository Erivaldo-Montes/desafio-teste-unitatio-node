import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get balance", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();

    statementsRepositoryInMemory = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
  });

  it("Should be able get balance of a user", async () => {
    const user = await createUserUseCase.execute({
      email: "amanda@vettorazzo.com.br",
      name: "Amanda Vettorazzo",
      password: "44333",
    });

    const amount = {
      deposit: 1200,
      withdraw: 500,
    };

    await statementsRepositoryInMemory.create({
      amount: amount.deposit,
      description: "",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    await statementsRepositoryInMemory.create({
      amount: amount.withdraw,
      description: "",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

    const { balance } = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance).toEqual(amount.deposit - amount.withdraw);
  });

  it("Should not be able get balance of a unregistred user", async () => {
    await expect(getBalanceUseCase.execute({ user_id: "123" })).rejects.toEqual(
      new GetBalanceError()
    );
  });
});
