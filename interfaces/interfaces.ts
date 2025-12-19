export interface EventType {
  id: string
  name: string
  color: string
  icon: string
  comment: string
  favorite: boolean
  data: EventDataItemType[]
}

export interface EventDataItemType {
  dateTime: string
  comment: string
}