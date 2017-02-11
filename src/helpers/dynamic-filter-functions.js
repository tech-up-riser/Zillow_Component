export default {
  keywords: {
    parser: (str = '') => str.split('|').map(value => ({
      value, label: value
    })),
    formatter: (array = []) => array.join('|')
  },
  property_types: {
    apiFormatter: ({ key, doc_count }) => ({ value: doc_count.toString(), label: key }),
    parser: (array = []) => array.map((value) => ({
      value, label: value
    })),
  },
  keywords_excluded: {
    parser: (str = '') => str.split('|').map(value => ({
      value, label: value
    })),
    formatter: (array = []) => array.join('|')
  }
}
