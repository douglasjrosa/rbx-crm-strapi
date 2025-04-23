---
description: Detailed business context of the current project. This content must to be considered whenever some architectural decision has to be made.
globs: 
alwaysApply: false
---

# RBX CRM STRAPI - Business Context [BC]

## Documentation Consultation Guidelines

For AI Agent consumption:

1. **Only use this document when specific business context information is needed**
2. **Use direct section references**: When referencing sections of this document, use section identifiers (e.g., [BC-4.2]) to locate specific information
3. **Avoid scanning entire document**: Target only the specific sections you need information from

## Quick Reference Index

* [BC-1] [Business Overview](mdc:#bc-1-business-overview)
* [BC-2] [Industry-Specific Requirements](mdc:#bc-2-industry-specific-requirements)
* [BC-3] [Data Architecture](mdc:#bc-3-data-architecture)
* [BC-4] [Key Business Workflows](mdc:#bc-4-key-business-workflows)
* [BC-5] [User Roles & Permissions](mdc:#bc-5-user-roles--permissions)
* [BC-6] [Key Performance Indicators](mdc:#bc-6-key-performance-indicators)
* [BC-7] [Integration Requirements](mdc:#bc-7-integration-requirements)
* [BC-8] [Reporting Needs](mdc:#bc-8-reporting-needs)
* [BC-9] [Market Differentiation](mdc:#bc-9-market-differentiation)

## [BC-1] Business Overview

RBX CRM STRAPI is a specialized CRM system designed for wooden packaging factories, with a focus on:
* Real-time cost calculation for wooden packaging products
* Generating SVG component designs for packaging projects on the front-end (not in this environment, as this is the back-end)
* Customer and negotiation management
* WhatsApp integration via n8n for seller support and conversation summary
* AI-powered conversation analysis for sales insights and strategic decisions for managers (via n8n as well)
* Bling ERP integration for finance and inventory (front-end only)

## [BC-2] Industry-Specific Requirements

1. **Wooden Packaging Industry**
   + Custom wooden crates, pallets, and boxes for industrial shipments
   + Products made primarily from pine, eucalyptus, and OSB materials
   + Dimensions-based pricing and material calculations
   + Structural engineering considerations for load capacity
   + Treatment requirements for export (ISPM-15 standards)

2. **Brazilian Market Considerations**
   + Tax regulations: different state taxes (ICMS, IPI)
   + "Simples Nacional" classification affects tax calculation
   + Local regulations for wood treatment and certified wood sources
   + Regional variations in material costs and availability

## [BC-3] Data Architecture

1. **Main Models**
   + Company: `{ id, displayName, corporateReason, cnpj, ie, state, companySize, simplesNacional, address, addressNumber, addressComplement, neighborhood, postalCode, city, countryCode, country, phone, email, nfeEmail, website, logoUrl, isActive, creditLimit, maximumPaymentTerm, seasonality, icmsTaxpayer, cnae, expiresAt, seller }`

   + Contact: `{ id, name, email, phone, decisionRole, companyId, isActive, interactions }`

   + Deal: `{ id, company, seller, stage, isActive, reasonForLoss, interactions, order, followUpAt, negotiationAt, startedAt, finishedAt, expiresAt, migrationId }`

   + Order: `{ id, deal, company, issuer, payment_method, deliverForecast, freightType, freightValue, orderDiscount, extraCosts, orderSubtotalValue, orderTotalValue, clientOrderCode, observations, items, isActive, migrationId }`

   + Interaction: `{ id, type, content, deal, contact }`

   + Issuer: `{ id, blingAccessToken, blingRefreshToken, blingClientId, blingClientSecret, blingExpiresIn, payment_methods, isActive, company }`

   + PaymentMethod: `{ id, description, conditions, blingAccountCnpj, blingAccountName, blingPaymentMethodId }`

   + OrderItems (Component): `{ productCode, description, qty, mounted, export, price, subtotal }`

## [BC-4] Key Business Workflows

1. **Company Management**
   + Company registration and profile management
   + Contact management within companies
   + Classification by size, region, and sales potential
   + Document management and history

2. **Sales Process**
   + Lead registration and qualification
   + Deal creation and negotiation tracking
   + Price quotation generation
   + WhatsApp communication tracking
   + Conversion metrics and analysis

3. **Product Management**
   + Packaging type catalog
   + Custom package design with SVG generation
   + Material cost calculation
   + Production scheduling
   + Inventory management

4. **Order Fulfillment**
   + Order creation from approved deals
   + Production tracking
   + Delivery scheduling
   + Invoice generation via Bling ERP
   + Payment tracking

## [BC-5] User Roles & Permissions

1. **Sales Representatives**
   + Company and contact management
   + Deal creation and negotiation
   + Basic quotation creation
   + Communication with clients via WhatsApp

2. **Sales Managers**
   + Sales team oversight
   + Deal approval above certain value thresholds
   + Sales performance analytics
   + Custom pricing approvals

3. **Production Managers**
   + Order scheduling
   + Material allocation
   + Production tracking
   + Quality control

4. **Administrators**
   + User management
   + System configuration
   + Integration settings
   + Advanced reporting

## [BC-6] Key Performance Indicators

1. **Sales KPIs**
   + Conversion rate: Leads → Deals → Orders
   + Sales cycle duration
   + Average order value
   + Customer acquisition cost
   + Customer lifetime value

2. **Operational KPIs**
   + Production time per order
   + Material waste percentage
   + On-time delivery rate
   + Order accuracy rate
   + Production capacity utilization

## [BC-7] Integration Requirements

1. **WhatsApp Integration (via n8n)**
   + Automated message sending for quotations
   + Lead qualification conversations
   + Order status updates
   + Delivery notifications
   + AI analysis of conversation sentiment

2. **Bling ERP Integration (front-end only)**
   + Customer data synchronization
   + Order creation in ERP
   + Invoice generation
   + Inventory management
   + Financial reporting

## [BC-8] Reporting Needs

1. **Sales Reports**
   + Pipeline status and forecasting
   + Sales by representative
   + Sales by region
   + Deal conversion rates by stage
   + Customer acquisition trends

2. **Operational Reports**
   + Production capacity planning
   + Material usage and inventory
   + Delivery performance
   + Quality metrics
   + Cost analysis

## [BC-9] Market Differentiation

The system aims to differentiate from competitors through:
* Specialized wooden packaging knowledge embedded in calculations
* Real-time SVG design visualization with structural validation
* Integrated WhatsApp communication with AI analysis
* Seamless ERP integration for financial operations
* Industry-specific workflows optimized for wooden packaging manufacturers 
