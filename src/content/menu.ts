export type ItemStatus = "on" | "off";

export type Dish = {
  name: string;
  detail?: string;
  price: string;
  nuts?: boolean;
  status?: ItemStatus;
};

export const allergyNote =
  "contains nuts. please tell your server about any allergies. we take steps to limit cross-contact, and we cannot guarantee that any item is completely free of allergens.";

export type Wine = {
  name: string;
  meta: string;
  note: string;
  glass: number;
  bottle: number;
  status?: ItemStatus;
};

export type Pour = {
  name: string;
  detail: string;
  price: string;
  status?: ItemStatus;
};
