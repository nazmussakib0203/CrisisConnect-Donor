import Link from "next/link";
import {
  Carousel as UICarousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Carousel(props: {
  crises: { id: number; title: string; category: string; city: string }[];
}) {
  const { crises } = props;

  if (crises.length === 0) {
    return <p>No active crises right now.</p>;
  }

  return (
    <UICarousel className="max-w-sm">
      <CarouselContent>
        {crises.map((crisis, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardHeader>
                <CardTitle>{crisis.title}</CardTitle>
                <CardDescription>{crisis.category} · {crisis.city}</CardDescription>
              </CardHeader>
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
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </UICarousel>
  );
}
