import type { Schema, Struct } from '@strapi/strapi';

export interface OrderComponentsItems extends Struct.ComponentSchema {
  collectionName: 'components_order_components_items';
  info: {
    displayName: 'items';
    icon: 'layer';
  };
  attributes: {
    description: Schema.Attribute.String;
    export: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    mounted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    price: Schema.Attribute.Decimal;
    productCode: Schema.Attribute.String;
    qty: Schema.Attribute.Integer;
    subtotal: Schema.Attribute.Decimal;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'order-components.items': OrderComponentsItems;
    }
  }
}
