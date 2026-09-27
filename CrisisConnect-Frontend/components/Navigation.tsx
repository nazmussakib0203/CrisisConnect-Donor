import Link from "next/link";

export default function Navigation() {
  return (
    <div className="flex items-center gap-6 border-b border-border bg-background px-6 py-4">
  <Link href="/" className="font-semibold text-foreground hover:text-primary">
    Home
  </Link>

  <Link href="/login" className="text-muted-foreground hover:text-primary">
    Login
  </Link>

  <Link href="/register" className="text-muted-foreground hover:text-primary">
    Register
  </Link>
</div>
  );
}