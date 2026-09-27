import Link from "next/link";
import Header from "@/components/Header";

export default function CrisisNotFound() {
  return (
    <>
      <Header title="Crisis Not Found" />
      <Link href="/ngo/crises" className="text-blue-600">Back to crises</Link>
    </>
  );
}
