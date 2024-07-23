import type { Schema, Attribute } from '@strapi/strapi';

export interface CompanyComponentsCompanyData extends Schema.Component {
  collectionName: 'components_company_components_company_data';
  info: {
    displayName: 'companyData';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    corporateReason: Attribute.String;
    email: Attribute.String;
    ie: Attribute.BigInteger;
    country: Attribute.String;
    address: Attribute.String;
    countryCode: Attribute.Integer;
    addressNumber: Attribute.Integer;
    addressComplement: Attribute.String;
    neighborhood: Attribute.String;
    postalCode: Attribute.BigInteger;
    city: Attribute.String;
    state: Attribute.String;
    website: Attribute.String;
    nfeEmail: Attribute.String;
    phone: Attribute.BigInteger;
    icmsTaxpayer: Attribute.Integer;
    cnae: Attribute.BigInteger;
    logo: Attribute.Media<'images'>;
    companySize: Attribute.String;
    simplesNacional: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

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
      'company-components.company-data': CompanyComponentsCompanyData;
      'order-components.items': OrderComponentsItems;
    }
  }
}
