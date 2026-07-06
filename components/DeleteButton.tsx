"use client";

export function DeleteButton({
  action,
  confirmMessage = "Tem certeza que deseja excluir? Essa ação não pode ser desfeita.",
  className,
  label = "Excluir",
  hiddenFields,
}: {
  action: (formData: FormData) => void;
  confirmMessage?: string;
  className?: string;
  label?: React.ReactNode;
  hiddenFields?: React.ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {hiddenFields}
      <button type="submit" className={className ?? "btn-danger"}>
        {label}
      </button>
    </form>
  );
}
