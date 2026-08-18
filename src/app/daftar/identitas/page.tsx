import { ConsentGuard } from '@/consent/ConsentGuard';
import { StepPlaceholder } from '@/components/StepPlaceholder';

export default function Page() {
  return (
    <ConsentGuard>
      <StepPlaceholder titleKey="daftar.identitas.title" workOrder="wo-03-identity-capture" />
    </ConsentGuard>
  );
}
