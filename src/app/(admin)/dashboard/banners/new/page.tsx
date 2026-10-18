import { requireAdmin } from '@/lib/require-admin';
import NewBannerForm from "./NewBannerForm";

export default async function NewBannerPage() {
  await requireAdmin();
  return <NewBannerForm />;
}
