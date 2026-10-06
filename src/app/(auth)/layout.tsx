import { AuthFormColumn } from "./auth-form-column";
import { AuthPanel } from "./auth-panel";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-svh flex-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <AuthPanel />
      <AuthFormColumn>{children}</AuthFormColumn>
    </div>
  );
}
