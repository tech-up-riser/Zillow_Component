import slug from 'slug'
import format from 'string-format'

export function createListingURL({ data: { address }, id }, { variables, detail }) {
  return format(detail, {
    ...variables,
    _ID_: id,
    _ADDRESS_ENCODED_: slug(address, { lower: true, replacement: '-' }),
    _SEARCH_ENCODED_: null
  })
}
