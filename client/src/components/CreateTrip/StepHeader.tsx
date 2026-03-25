interface StepHeaderProps {
  title: string;
  description: string;
}

export function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <div>
      <h2 className="font-['Lato'] font-bold text-2xl text-text-[#00b70d] mb-2">
        {title}
      </h2>
      <p className="text-text-[#ff5900]">{description}</p>
    </div>
  );
}


