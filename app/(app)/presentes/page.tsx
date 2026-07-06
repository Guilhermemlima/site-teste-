import { GiftBoard } from "@/components/GiftBoard";
import { GiftForm } from "@/components/GiftForm";
import { PageHeader } from "@/components/PageHeader";
import { listGifts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PresentesPage() {
  const gifts = await listGifts();

  return (
    <div>
      <PageHeader title="Ideias de Presentes" subtitle="O que ela gostaria de ganhar, organizado por prioridade e status." />

      <div className="mb-8">
        <GiftForm />
      </div>

      <GiftBoard gifts={gifts} />
    </div>
  );
}
