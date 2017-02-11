import { isNumber, isNaN } from 'lodash'

export function formatPrice(string, previousValue) {
  const number = parseInt(string.replace(/[^\d]/g, ''))
  if (!string.length || string === '$ ') return '$ '
  if (isNaN(number)) return previousValue || '$ '
  if (isNumber(number)) return `$ ${number.toLocaleString()}`
}
