export interface Task {
  parent?: string
  text: string
  focus: boolean
  owner: string
  uid?: string,
  complete: boolean
}
