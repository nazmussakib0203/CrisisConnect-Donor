export default function Header(props: { title: string }) {
  return (
    <h1 className="border-b border-border bg-background px-6 py-4 text-2xl font-bold text-foreground">
      {props.title}
    </h1>
  );
}