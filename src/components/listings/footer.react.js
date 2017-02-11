import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { paginate } from '../../actions/user/filters'

function mapStateToProps({
  user: { filters: { page } },
  settings: { listings: { size } },
  content: { listings: { total } }
}) {
  return {
    canPaginate: {
      forward: page !== Math.floor(total / size),
      back: page !== 0
    },
    page
  }
}

@connect(mapStateToProps, { paginate })
export default class ListingsFooter extends PureComponent {
  static propTypes = {
    canPaginate: PropTypes.shape({
      forward: PropTypes.bool.isRequired,
      back: PropTypes.bool.isRequired
    }),
    page: PropTypes.number.isRequired,
    paginate: PropTypes.func.isRequired
  }

  handlePrevPage() {
    const { paginate, page } = this.props
    paginate(page - 1)
  }

  handleNextPage() {
    const { paginate, page } = this.props
    paginate(page + 1)
  }

  render() {
    const { canPaginate: { forward, back } } = this.props
    return (
      <footer className='footer'>
        <div className='navigation'>
          {
            back ? (
              <button className='button button-utility' onClick={::this.handlePrevPage}>
                <i className='icon icon-left ion-chevron-left' />
                Prev
              </button>
            ) : null
          }
          {
            forward ? (
              <button className='button button-utility' onClick={::this.handleNextPage}>
                Next
                <i className='icon icon-right ion-chevron-right' />
              </button>
            ) : null
          }
        </div>
      </footer>
    )
  }
}
