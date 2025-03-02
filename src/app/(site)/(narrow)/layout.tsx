type Props = Readonly<{ children: React.ReactNode }>;

export default function NarrowLayout({ children }: Props) {
  return <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-12">{children}</div>;
}
