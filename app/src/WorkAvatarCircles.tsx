// Optimized image strip built from the seven organization logos supplied by the site owner.
// All images are embedded locally, with no external logo service or network dependency.
const logoStrip = "data:image/webp;base64,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";
const organizations = [
  {
    "name": "الهيئة العربية الدولية للإعمار في فلسطين (AIOCP)",
    "shortName": "AIOCP"
  },
  {
    "name": "شركة توزيع كهرباء محافظات غزة",
    "shortName": "GEDCO"
  },
  {
    "name": "سلطة جودة البيئة (شعار فلسطين مؤقتًا)",
    "shortName": "EQA"
  },
  {
    "name": "الكلية الجامعية للعلوم التطبيقية (UCAS)",
    "shortName": "UCAS"
  },
  {
    "name": "مركز خبراء التطوير",
    "shortName": "DEC"
  },
  {
    "name": "مركز الموارد العمالية (LRC) – تطوع",
    "shortName": "LRC"
  },
  {
    "name": "وزارة الزراعة الفلسطينية",
    "shortName": "MOA"
  }
];

export default function WorkAvatarCircles() {
 return <div className="work-avatar-circles" aria-label="الجهات التي عملت معها">
  <span className="work-avatar-title">جهات عملت معها</span>
  <div className="work-avatar-stack" role="group" aria-label="شعارات الجهات والمؤسسات">
   {organizations.map((org,index)=><span key={org.shortName} className="org-avatar" title={org.name} role="img" aria-label={org.name}>
    <span aria-hidden="true" className="org-avatar-image" style={{backgroundImage:`url("${logoStrip}")`,backgroundPosition:`${index/6*100}% 50%`}} />
   </span>)}
  </div>
 </div>;
}
