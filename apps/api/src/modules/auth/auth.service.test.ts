import type { AuthRepository } from "./auth.repository";
import { buildUserItem } from "./auth.repository";
import { createAuthService } from "./auth.service";

jest.mock("../../shared/auth", () => ({
  hashPassword: jest.fn(async () => "hashed-password"),
  signAuthToken: jest.fn(() => "signed-token"),
  verifyPassword: jest.fn(async (password: string) => password === "password123")
}));

const createRepositoryMock = (): jest.Mocked<AuthRepository> => ({
  findUserByEmail: jest.fn(),
  createUserWithCategories: jest.fn()
});

describe("auth service", () => {
  it("signs up users with predefined categories", async () => {
    const repository = createRepositoryMock();
    repository.findUserByEmail.mockResolvedValue(undefined);
    const service = createAuthService(repository);

    const session = await service.signup({
      name: "Edgar",
      email: "edgar@example.com",
      password: "password123"
    });

    expect(repository.createUserWithCategories).toHaveBeenCalledTimes(1);
    expect(repository.createUserWithCategories.mock.calls[0]?.[1]).toHaveLength(
      7
    );
    expect(session).toMatchObject({
      user: {
        name: "Edgar",
        email: "edgar@example.com"
      },
      token: "signed-token"
    });
  });

  it("rejects duplicate signup emails", async () => {
    const repository = createRepositoryMock();
    repository.findUserByEmail.mockResolvedValue(
      buildUserItem(
        {
          userId: "user_123",
          name: "Edgar",
          email: "edgar@example.com",
          passwordHash: "hash"
        },
        "2026-05-05T00:00:00.000Z"
      )
    );
    const service = createAuthService(repository);

    await expect(
      service.signup({
        name: "Edgar",
        email: "edgar@example.com",
        password: "password123"
      })
    ).rejects.toThrow("A user with this email already exists");
  });

  it("logs in valid users", async () => {
    const repository = createRepositoryMock();
    repository.findUserByEmail.mockResolvedValue(
      buildUserItem(
        {
          userId: "user_123",
          name: "Edgar",
          email: "edgar@example.com",
          passwordHash: "hash"
        },
        "2026-05-05T00:00:00.000Z"
      )
    );
    const service = createAuthService(repository);

    await expect(
      service.login({
        email: "edgar@example.com",
        password: "password123"
      })
    ).resolves.toMatchObject({
      token: "signed-token",
      user: {
        userId: "user_123",
        email: "edgar@example.com"
      }
    });
  });

  it("rejects invalid login credentials", async () => {
    const repository = createRepositoryMock();
    repository.findUserByEmail.mockResolvedValue(undefined);
    const service = createAuthService(repository);

    await expect(
      service.login({
        email: "edgar@example.com",
        password: "password123"
      })
    ).rejects.toThrow("Invalid email or password");
  });
});
