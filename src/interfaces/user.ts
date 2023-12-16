export interface User {
    _id: string,
    firstName: string,
    lastName: string
    email: string
    password: string
    lastLogin?: string | Date
    createdAt: string | Date
    updatedAt: string | Date
    __v: number
}

export interface CreateUser extends Omit<User,
    | '_id'
    | 'createdAt'
    | 'updatedAt'
> { }

export type UpdateUser = Partial<Omit<CreateUser, 'email' | 'password'>>