import { Contact } from "./contact"
import { Deal } from "./deal"
import { ResponseError } from "./error"
import { ResponseMeta } from "./meta"

// Interaction Interface for Strapi v5
export interface Interaction {
	id: number
	documentId: string
	type?: string
	content?: string
	deal?: Deal
	contact?: Contact
	createdAt?: string
	updatedAt?: string
}

export interface ResponseInteractions {
	data: Interaction[]
	meta?: ResponseMeta
	error?: ResponseError
}

export interface ResponseInteraction {
	data: Interaction
	meta?: ResponseMeta
	error?: ResponseError
}