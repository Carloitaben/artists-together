type Params = {
  year: string
  month: string
}

type Props = {
  params: Params
}

export default function Page({ params }: Props) {
  return (
    <div>
      calendar year {params.year} month {params.month}
    </div>
  )
}
