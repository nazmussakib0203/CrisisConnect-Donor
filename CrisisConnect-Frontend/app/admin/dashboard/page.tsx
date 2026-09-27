// Only edit files inside app/admin/ for this role. Don't touch anything
// outside this folder unless the change is genuinely needed for every role.
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function AdminDashboardPage() {
  return (
    <>
      <Header title="Dashboard" />
      <Navigation />
    </>
  );
}
