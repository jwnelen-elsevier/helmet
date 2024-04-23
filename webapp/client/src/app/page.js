import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Link,
} from "@nextui-org/card";

const links = [
  {
    href: "/projects",
    title: "Projects",
    description: "Here, you can see all existing projects and choose one.",
  },
  {
    href: "/runs",
    title: "Runs",
    description: "Here, you can see all the experiments you've done.",
  },
  {
    href: "/resources",
    title: "Resources",
    description: "Here, you can find all the resources needed.",
  },
];

const CardProvider = ({ cardInfo }) => {
  const { title, description, href } = cardInfo;
  return (
    <Card className="max-w-80 min-w-80">
      <CardHeader className="font-bold text-lg">{title}</CardHeader>
      <Divider />
      <CardBody>{description}</CardBody>
      <CardFooter className="justify-end">
        <Link href={href}>To {title}</Link>
      </CardFooter>
    </Card>
  );
};

export default async function Page() {
  const j = links[0];
  return (
    <div className="container text-center mx-auto">
      <h1 className="h1">Welcome at the HELMET⛑️ platform</h1>
      <div className="flex flex-row gap-8 justify-center p-2 mt-10">
        {links.map((j) => (
          <CardProvider cardInfo={j} />
        ))}
      </div>
    </div>
  );
}
