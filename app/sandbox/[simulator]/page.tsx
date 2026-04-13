interface Props {
  params: Promise<{ simulator: string }>
}

export default async function SimulatorPage({ params }: Props) {
  const { simulator } = await params

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Simulator: {simulator}</h1>
    </div>
  )
}
