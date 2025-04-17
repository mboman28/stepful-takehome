export type Student = {pk: number, name: string, phone: string }
export type Coach = {pk: number, name: string, phone: string }
export type TimeSlot = {pk: number, startTime: string, registered: Student | null, owner: Coach}
export type Notes = {pk: number, notes: string, rating: number}

export type UserType = "coach" | "student"