import { ConsentGuard } from '@/consent/ConsentGuard';
import { StepPlaceholder } from '@/components/StepPlaceholder';

export default function Page() {
  return (
    <ConsentGuard>
      <StepPlaceholder titleKey="daftar.ringkasan.title" workOrder="wo-06-review-submit" />
    </ConsentGuard>
  );
}
