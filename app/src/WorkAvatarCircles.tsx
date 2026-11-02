import { useState } from "react";

type OrganizationAvatar = {
  name: string;
  shortName: string;
  imageUrl?: string;
};

const organizations: OrganizationAvatar[] = [
  { name: "الهيئة العربية الدولية للإعمار في فلسطين (AIOCP)", shortName: "AIOCP", imageUrl: "https://www.google.com/s2/favicons?domain=aiocp.org&sz=128" },
  { name: "شركة توزيع كهرباء محافظات غزة", shortName: "GEDCO", imageUrl: "https://www.google.com/s2/favicons?domain=gedco.ps&sz=128" },
  { name: "وزارة الزراعة الفلسطينية", shortName: "MOA", imageUrl: "https://www.google.com/s2/favicons?domain=moa.pna.ps&sz=128" },
  { name: "الكلية الجامعية للعلوم التطبيقية (UCAS)", shortName: "UCAS", imageUrl: "https://www.google.com/s2/favicons?domain=ucas.edu.ps&sz=128" },
  { name: "سلطة جودة البيئة", shortName: "EQA", imageUrl: "https://www.google.com/s2/favicons?domain=eqa.ps&sz=128" },
  { name: "مركز خبراء التطوير", shortName: "DEC" },
  { name: "مركز الموارد العمالية (LRC) – تطوع", shortName: "LRC" },
];

function OrganizationLogo({ org }: { org: OrganizationAvatar }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="org-avatar" title={org.name} aria-label={org.name}>
      {org.imageUrl && !failed ? (
        <img src={org.imageUrl} alt="" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span className="org-avatar-fallback" aria-hidden="true">{org.shortName}</span>
      )}
    </span>
  );
}

export default function WorkAvatarCircles() {
  return (
    <div className="work-avatar-circles" aria-label="الجهات التي عملت معها">
      <span className="work-avatar-title">جهات عملت معها</span>
      <div className="work-avatar-stack" role="group" aria-label="شعارات الجهات والمؤسسات">
        {organizations.map((org) => <OrganizationLogo key={org.shortName} org={org} />)}
      </div>
    </div>
  );
}
