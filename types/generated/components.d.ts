import type { Schema, Attribute } from '@strapi/strapi';

export interface OrderComponentsItems extends Schema.Component {
  collectionName: 'components_order_components_items';
  info: {
    displayName: 'items';
    icon: 'layer';
  };
  attributes: {
    productCode: Attribute.String;
    description: Attribute.String;
    qty: Attribute.Integer;
    mounted: Attribute.Boolean & Attribute.DefaultTo<false>;
    export: Attribute.Boolean & Attribute.DefaultTo<false>;
    price: Attribute.Decimal;
    subtotal: Attribute.Decimal;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'order-components.items': OrderComponentsItems;
    }
  }
}
