import {
  Role,
  ProductTab,
  CartItemDetail,
  OrderTab,
  ProductCategory,
  ShipmentStatus,
} from '../types'

export const isAdmin = (role: Role | null) =>
  role === 'ADMIN' || role === 'SUPER_ADMIN'

export const isClient = (role: Role | null) => role === 'CLIENT'

export const formatAmount = (amount: number) =>
  amount.toLocaleString('en', { minimumFractionDigits: 2 })

export const calculateCartQuantity = (cart: CartItemDetail[]) =>
  cart.reduce((qty, item) => qty + item.quantity, 0)

export const calculateCartAmount = (cart: CartItemDetail[]) =>
  cart.reduce((amount, item) => amount + item.quantity * item.price, 0)

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    // weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export const calculateTotalPages = (totalItems: number, perPage: number) =>
  Math.ceil(totalItems / perPage)

export const productTabs: ProductTab[] = [
  'All',
  'Clothing',
  'Shoes',
  'Watches',
  'Accessories',
]

export const orderTabs: OrderTab[] = [
  'New',
  'Preparing',
  'Shipped',
  'Delivered',
  'Canceled',
  'All',
]

export const categories: ProductCategory[] = [
  'Clothing',
  'Shoes',
  'Watches',
  'Accessories',
]

export const shipmentStatuses: ShipmentStatus[] = [
  'New',
  'Preparing',
  'Shipped',
  'Delivered',
  'Canceled',
]

export const createHeaders = (type: 'json' | 'form-data', token: string) => {
  return type === 'json'
    ? {
        'Content-Type': 'application/json; charset=UTF-8',
        authorization: `Bearer ${token}`,
      }
    : {
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${token}`,
      }
}
