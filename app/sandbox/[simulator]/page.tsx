interface Props {
  params: Promise<{ simulator: string }>
}

export default async function SimulatorPage({ params }: Props) {
  const { simulator } = await params

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold">Simulator: {simulator}</h1>
    </div>
  )
}
