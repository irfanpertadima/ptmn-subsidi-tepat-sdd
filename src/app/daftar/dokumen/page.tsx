import { ConsentGuard } from '@/consent/ConsentGuard';
import { StepPlaceholder } from '@/components/StepPlaceholder';

export default function Page() {
  return (
    <ConsentGuard>
      <StepPlaceholder titleKey="daftar.dokumen.title" workOrder="wo-05-document-capture" />
    </ConsentGuard>
  );
}
