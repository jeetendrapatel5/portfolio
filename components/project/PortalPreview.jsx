import Image from "next/image";

export default function PortalPreview({ title }) {
  return (
    <div className="preview-flow" aria-hidden="true">
      <Image
        src="/projects/opprine/hero.png"  
        height={500}
        width={500}                               
        alt={`${title} project preview`}
        className="preview-flow__image"
        style={{ objectFit: "cover" }}   
      />
    </div>
  );
}