import { Company } from "./company"
import { ResponseError } from "./error"
import { ResponseMeta } from "./meta"

// Product Interface for Strapi v5
export interface Product {
	id: number
	documentId: string
	description: string
	contentName?: string
	customerCode?: string
	internalCode?: string
	externalLength?: number
	externalWidth?: number
	externalHeight?: number
	internalLength?: number
	internalWidth?: number
	internalHeight?: number
	dimensionsUnit?: "mm" | "cm" | "m"
	salesUnit?: "unit" | "kg" | "m" | "m2" | "m3" | "L"
	itemType?: "finished" | "rawMaterial" | "accessory" | "service"
	materials?: any
	weight?: number
	rawMaterialCost?: number
	comissionTable?: any
	currentComissionMargin?: number
	currentComission?: number
	fixedCostMargin?: number
	averageTaxRate?: number
	price: number
	isPriceOutdated?: boolean
	isActive?: boolean
	company?: Company
	createdAt?: string
	updatedAt?: string
	publishedAt?: string
}

export interface ResponseProducts {
	data: Product[]
	meta?: ResponseMeta
	error?: ResponseError
}

export interface ResponseProduct {
	data: Product
	meta?: ResponseMeta
	error?: ResponseError
} 