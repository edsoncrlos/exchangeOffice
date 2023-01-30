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
  info: {
    rate: number
  },
  historical: boolean,
  result: number
}
