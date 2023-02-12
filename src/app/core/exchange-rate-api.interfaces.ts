export interface Coin {
  code: string,
  description: string
}

export interface ResponseSymbols {
  success: boolean,
  symbols: { }
}

export interface ResponseConvert {
  success: boolean,
  query: {
    from: string,
    to: string,
    amount: number
  },
  info: {
    rate: number
  },
  historical: boolean,
  date: string,
  result: number
}

export interface ResponseLatest {
  success: boolean,
  rates: {}
}
