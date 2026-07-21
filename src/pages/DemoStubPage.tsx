import DemoUnavailablePanel from "@/components/DemoUnavailablePanel";

interface DemoStubPageProps {
  title: string;
}

export default function DemoStubPage({ title }: DemoStubPageProps) {
  return <DemoUnavailablePanel title={title} />;
}
