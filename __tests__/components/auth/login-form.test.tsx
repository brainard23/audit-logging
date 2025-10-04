import { describe, it, expect, jest } from "@jest/globals"
import { render, screen, fireEvent } from "@testing-library/react"
import { LoginForm } from "@/components/auth/login-form"

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock the auth hook
jest.mock("@/lib/hooks/use-auth", () => ({
  useAuth: () => ({
    setAuth: jest.fn(),
  }),
}))

describe("LoginForm", () => {
  it("should render login form", () => {
    render(<LoginForm />)

    expect(screen.getByText("Welcome back")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument()
  })

  it("should update input values", () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })

    expect(emailInput.value).toBe("test@example.com")
    expect(passwordInput.value).toBe("password123")
  })

  it("should show error for empty fields", async () => {
    render(<LoginForm />)

    const submitButton = screen.getByRole("button", { name: /login/i })
    fireEvent.click(submitButton)

    // HTML5 validation will prevent submission
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement
    expect(emailInput.validity.valid).toBe(false)
  })
})
