import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
