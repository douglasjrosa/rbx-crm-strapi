import { ResponseError } from "./error"
import { ResponseMeta } from "./meta"

// PricingMargin component interface
export interface PricingMargin {
	id?: number
	name?: string
	displayName?: string
	rating?: number
	profitMargin?: number
	comissionMargin?: number
}

// ChangeLog component interface
export interface ChangeLog {
	id?: number
	costMarginName?: "fixedCostMargin" | "assemblyCostMargin" | "treatmentCostMargin" | "averageTaxRateMargin"
	changedAt?: string
	changedTo?: number
}

// AppSetting Interface for Strapi v5
export interface AppSetting {
	id: number
	documentId: string
	pricingMargins?: PricingMargin[]
	fixedCostMargin?: number
	assemblyCostMargin?: number
	treatmentCostMargin?: number
	averageTaxRateMargin?: number
	changeLogs?: ChangeLog[]
	createdAt?: string
	updatedAt?: string
	publishedAt?: string
}

export interface ResponseAppSetting {
	data: AppSetting
	meta?: ResponseMeta
	error?: ResponseError
} 