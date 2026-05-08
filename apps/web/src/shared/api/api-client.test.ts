import { apiRequest, ApiClientError } from "./api-client";
import { getAuthToken, setAuthToken } from "./auth-token";

jest.mock("../env", () => ({
  getApiBaseUrl: () => "https://api.example.com"
}));

describe("apiRequest", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("clears the auth token when the API responds with 401", async () => {
    setAuthToken("expired-token");
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({
        error: {
          message: "Invalid authentication token"
        }
      })
    });

    global.fetch = fetchMock;

    await expect(apiRequest("/me")).rejects.toThrow(ApiClientError);
    expect(getAuthToken()).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/me", {
      method: "GET",
      headers: expect.any(Headers),
      body: undefined
    });
  });
});
