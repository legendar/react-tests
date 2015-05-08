var React = require('react'),
    {EventEmitter} = require('events');

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

class Storage extends EventEmitter {
    constructor(size){
        super()
        this.rows = Array.apply(null, {length: size}).map(this.generateRow);
    }
    getState() {
      return {
        rows: this.rows,
        sortBy: {
          key: 'firstName',
          isAsc: true
        }
      }
    }

    generateRow(el, i){
        return {
            id: i,
            firstName: `Name${guid()}`,
            lastName: `Last${guid()}`,
            phone: `${guid()}`
        };
    }
    
}

class HeadCell extends React.Component {
  render() {
    var span, direction,
        {children, name, handler, sortBy, keyId} = this.props;
    if(keyId === sortBy.key) {
        direction = sortBy.isAsc ? 'down' : 'up';
        span = <span className={`glyphicon glyphicon-chevron-${direction}`}/>
    }
    return (
      <th>
        {children}
        {span}
      </th>
    )
  }
}

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.store.getState()
  }

  _onChange() {
    var {store} = this.props
    this.setState = store.getState()
  }

  componentDidMount() {
    this.props.store.addListener('change', this._onChange.bind(this));
  }
  componentWillUnmount() {
    this.props.store.removeListener('change', this._onChange.bind(this));
  } 

  render() {
    var {sortBy, rows} = this.state;
    return (
      <div className={'container'}>
        <div className={'col-lg-offset-3 col-lg-6'}>
          <table className={'table'}>
            <thead>
              <HeadCell sortBy={sortBy} keyId={'id'}>#</HeadCell>
              <HeadCell sortBy={sortBy} keyId={'firstName'}>First Name</HeadCell>
              <HeadCell sortBy={sortBy} keyId={'lastName'}>Last Name</HeadCell>
              <HeadCell sortBy={sortBy} keyId={'phone'}>Phone</HeadCell>
            </thead>
            <tbody>
              {
                rows.map(function(el) {
                  return (
                    <tr>
                      <th scope='row'>{el.id}</th>
                      <th>{el.firstName}</th>
                      <th>{el.lastName}</th>
                      <th>{el.phone}</th>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
}
}

React.render(
    <Table store={new Storage(10000)}/>,
    document.body
);
