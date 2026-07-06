import { ChangeMainPasswordForm, ChangePrivatePinForm } from "@/components/ChangePasswordForm";
import { PageHeader } from "@/components/PageHeader";

export default function ConfiguracoesPage() {
  return (
    <div>
      <PageHeader title="Configurações" subtitle="Gerencie a senha de acesso e o PIN da área privada." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChangeMainPasswordForm />
        <ChangePrivatePinForm />
      </div>
    </div>
  );
}
