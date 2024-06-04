type Params = {
  year: string
}

type Props = {
  params: Params
}

export default function Page({ params }: Props) {
  return <div>calendar year {params.year}</div>
}
