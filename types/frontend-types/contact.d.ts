import { ResponseError } from "./error"
import { Interaction } from "./interaction"
import { ResponseMeta } from "./meta"

// Contact Interface for Strapi v5
export interface Contact {
	id: number
	documentId: string
	name?: string
	phone?: number
	email?: string
	decisionRole?: string
	interactions?: Interaction[]
	isActive?: boolean
	companyId: string
	createdAt?: string
	updatedAt?: string
}

export interface ResponseContacts {
	data: Contact[]
	meta?: ResponseMeta
	error?: ResponseError
}

export interface ResponseContact {
	data: Contact
	meta?: ResponseMeta
	error?: ResponseError
}