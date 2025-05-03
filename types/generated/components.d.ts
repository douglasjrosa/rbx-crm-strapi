import type { Schema, Struct } from '@strapi/strapi';

export interface AppSettingComponentsChangeLogs extends Struct.ComponentSchema {
  collectionName: 'components_app_setting_components_change_logs';
  info: {
    description: '';
    displayName: 'changeLogs';
  };
  attributes: {
    changedAt: Schema.Attribute.DateTime;
    changedTo: Schema.Attribute.Decimal;
    costMarginName: Schema.Attribute.Enumeration<
      [
        'fixedCostMargin',
        'assemblyCostMargin',
        'treatmentCostMargin',
        'averageTaxRateMargin',
      ]
    >;
  };
}

export interface AppSettingComponentsPricingMargins
  extends Struct.ComponentSchema {
  collectionName: 'components_app_setting_components_pricing_margins';
  info: {
    description: '';
    displayName: 'pricingMargins';
  };
  attributes: {
    comissionMargin: Schema.Attribute.Decimal;
    displayName: Schema.Attribute.String;
    name: Schema.Attribute.String;
    profitMargin: Schema.Attribute.Decimal;
    rating: Schema.Attribute.Integer;
  };
}

export interface OrderComponentsItems extends Struct.ComponentSchema {
  collectionName: 'components_order_components_items';
  info: {
    description: '';
    displayName: 'items';
    icon: 'layer';
  };
  attributes: {
    assemblyCost: Schema.Attribute.Decimal;
    assemblyType: Schema.Attribute.Enumeration<
      [
        'disassembled',
        'openLid',
        'openBase',
        'openSide',
        'openHeadboard',
        'screwedOpenLid',
        'screwedOpenBase',
        'screwedOpenSide',
        'screwedOpenHeadboard',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'disassembled'>;
    description: Schema.Attribute.String;
    isExportCompliant: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    itemTotalContributionMargin: Schema.Attribute.Decimal;
    itemTotalDiscount: Schema.Attribute.Decimal;
    itemTotalRawMaterialCost: Schema.Attribute.Decimal;
    price: Schema.Attribute.Decimal;
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    productCode: Schema.Attribute.String;
    qty: Schema.Attribute.Integer;
    subtotal: Schema.Attribute.Decimal;
    total: Schema.Attribute.Decimal;
    treatmentCost: Schema.Attribute.Decimal;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'app-setting-components.change-logs': AppSettingComponentsChangeLogs;
      'app-setting-components.pricing-margins': AppSettingComponentsPricingMargins;
      'order-components.items': OrderComponentsItems;
    }
  }
}
