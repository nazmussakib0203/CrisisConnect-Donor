import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { statusColor } from "./statusColor";

export default function CrisisCard(props: {
  crisis: {
    id: number;
    title: string;
    category: string;
    severity: string;
    status: string;
    city: string;
  };
}) {
  const { crisis } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{crisis.title}</CardTitle>
        <CardDescription>{crisis.category} · {crisis.city}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Badge className={statusColor(crisis.severity)}>{crisis.severity}</Badge>
        <Badge className={statusColor(crisis.status)}>{crisis.status}</Badge>
      </CardContent>
      <CardFooter>
        <Button
          variant="link"
          className="px-0"
          nativeButton={false}
          render={<Link href={"/ngo/crises/" + crisis.id} />}
        >
          View details
        </Button>
      </CardFooter>
    </Card>
  );
}
