import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let userRepositiryInMemory: InMemoryUsersRepository;

describe("Show user profile", () => {
  beforeEach(() => {
    userRepositiryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositiryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositiryInMemory);
  });

  it("Should be able get user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "João Bettega",
      email: "bettega@email.com",
      password: "30222",
    });

    const userProfile = await showUserProfileUseCase.execute(user.id as string);

    expect(userProfile).toHaveProperty("id");
  });

  it("Should not be able show profile of an unregistered user", async () => {
    await expect(showUserProfileUseCase.execute("123")).rejects.toEqual(
      new ShowUserProfileError()
    );
  });
});
