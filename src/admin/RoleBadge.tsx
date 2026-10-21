import { StatusBadge, type BadgeTone } from "@/components/ui";

const ROLES: Record<string, { label: string; tone: BadgeTone }> = {
  super_admin: { label: "Super admin", tone: "info" },
  admin: { label: "Admin", tone: "info" },
  content_editor: { label: "Content editor", tone: "info" },
  user: { label: "Learner", tone: "neutral" },
};

/** A user's role in sentence case. Roles are notable (info), never gold. */
export default function RoleBadge({ role }: { role: string }) {
  const meta = ROLES[role] ?? { label: role.replace(/_/g, " "), tone: "neutral" as const };
  return <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>;
}
