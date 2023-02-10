export interface Historic {
  id?: number,
  date: string,
  hourAndMinutes: string,
  amount: number,
  originCoin: string,
  destinationCoin: string,
  result: number,
  rate: number,
  hasShowIcon: boolean
}
