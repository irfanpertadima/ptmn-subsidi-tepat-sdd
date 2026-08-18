import { ConsentGuard } from '@/consent/ConsentGuard';
import { StepPlaceholder } from '@/components/StepPlaceholder';

export default function Page() {
  return (
    <ConsentGuard>
      <StepPlaceholder titleKey="daftar.kendaraan.title" workOrder="wo-04-vehicle-data-entry" />
    </ConsentGuard>
  );
}
