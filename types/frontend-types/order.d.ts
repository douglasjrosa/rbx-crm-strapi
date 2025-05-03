import { Company } from "./company"
import { Deal } from "./deal"
import { ResponseError } from "./error"
import { Issuer } from "./issuer"
import { ResponseMeta } from "./meta"
import { PaymentMethod } from "./payment-method"
import { Product } from "./product"

// Order Item Interface
export interface OrderItem {
	id?: number
	productCode?: string
	description?: string
	qty?: number
	assemblyType: "disassembled" | "openLid" | "openBase" | "openSide" | "openHeadboard" | "screwedOpenLid" | "screwedOpenBase" | "screwedOpenSide" | "screwedOpenHeadboard"
	assemblyCost?: number
	isExportCompliant?: boolean
	treatmentCost?: number
	price?: number
	subtotal?: number
	itemTotalDiscount?: number
	itemTotalRawMaterialCost?: number
	itemTotalContributionMargin?: number
	total?: number
	product?: Product
}

// Order Interface for Strapi v5
export interface Order {
	id: number
	documentId: string
	deal?: Deal
	deliverForecast?: string
	freightType?: string
	orderDiscount?: number
	extraCosts?: number
	orderSubtotalValue?: number
	orderTotalValue?: number
	orderTotalContributionMargin?: number
	orderTotalRawMaterialCost?: number
	clientOrderCode?: string
	observations?: string
	company?: Company
	issuer?: Issuer
	paymentMethod?: PaymentMethod
	freightValue?: number
	items?: OrderItem[]
	isActive?: boolean
	migrationId?: number
	createdAt?: string
	updatedAt?: string
}

export interface ResponseOrders {
	data: Order[]
	meta?: ResponseMeta
	error?: ResponseError
}

export interface ResponseOrder {
	data: Order
	meta?: ResponseMeta
	error?: ResponseError
}