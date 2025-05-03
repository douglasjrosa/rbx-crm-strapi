import { Company } from "./company"
import { ResponseError } from "./error"
import { Interaction } from "./interaction"
import { ResponseMeta } from "./meta"
import { Order } from "./order"
import { User } from "./user"

// Deal Interface for Strapi v5
export interface Deal {
	id: number
	documentId: string
	reasonForLoss?: string
	interactions?: Interaction[]
	order?: Order
	company?: Company
	seller?: User
	isActive?: boolean
	stage?: "Send proposal" | "Follow up" | "Negotiation" | "Won" | "Lost"
	followUpAt?: string
	negotiationAt?: string
	startedAt?: string
	finishedAt?: string
	expiresAt?: string
	migrationId?: number
	rating?: number
	createdAt?: string
	updatedAt?: string
}

export interface ResponseDeals {
	data: Deal[]
	meta?: ResponseMeta
	error?: ResponseError
}

export interface ResponseDeal {
	data: Deal
	meta?: ResponseMeta
	error?: ResponseError
}
