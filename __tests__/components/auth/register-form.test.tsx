import { describe, it, expect, jest } from "@jest/globals"
import { render, screen, fireEvent } from "@testing-library/react"
import { RegisterForm } from "@/components/auth/register-form"

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

describe("RegisterForm", () => {
  it("should render registration form", () => {
    render(<RegisterForm />)

    expect(screen.getByText("Create an account")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument()
  })

  it("should show error when passwords don't match", async () => {
    render(<RegisterForm />)

    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const confirmPasswordInput = screen.getByLabelText("Confirm Password")
    const submitButton = screen.getByRole("button", { name: /register/i })

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "Password123" } })
    fireEvent.change(confirmPasswordInput, { target: { value: "DifferentPassword123" } })
    fireEvent.click(submitButton)

    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument()
  })
})
