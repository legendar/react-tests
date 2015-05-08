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
        this.sortBy = {
          key: 'firstName',
          isAsc: true
        }
    }
    getState() {
      return { rows: this.rows, sortBy: this.sortBy}
    }

    generateRow(el, i){
        return {
            id: i,
            firstName: `Name${guid()}`,
            lastName: `Last${guid()}`,
            phone: `${guid()}`
        };
    }
    
    sortHandler(key) {
      alert(key);
      if (this.sortBy.key === key) {
        this.sortBy.isAsc = !this.sortBy.isAsc;
      } else {
        this.sortBy = {
          key: key,
          isAsc: true
        }
      }
      this.emit('change')
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
      <th onClick={handler}>
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
    this.setState(store.getState())
  }

  componentDidMount() {
    this.props.store.addListener('change', this._onChange.bind(this));
  }
  componentWillUnmount() {
    this.props.store.removeListener('change', this._onChange.bind(this));
  } 

  render() {
    var {sortBy, rows} = this.state;
    var sortHandler = this.props.store.sortHandler.bind(this.props.store)
    var headers = [
        ['id', '#'],
        ['firstName','First Name'],
        ['lastName', 'Last Name'],
        ['phone', 'Phone'],
      ].map(function([id, name]){
        return (
          <HeadCell sortBy={sortBy} handler={sortHandler.bind(undefined, id)} key={id} keyId={id}>{name}</HeadCell>
        )
      })
    rows = rows.sort(
      (l, r) => {
        var {key, isAsc} = sortBy,
            res,
            mul = isAsc ? 1 : -1;
        if (l[key] > r[key]) { res = 1; }
        else if (l[key] === r[key]) { res = 0; }
        else { res = -1; }
        return res * mul;
      }
    );
    return (
      <div className={'container'}>
        <div className={'col-lg-offset-3 col-lg-6'}>
          <table className={'table'}>
            <thead>
            {headers}
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
    <Table store={new Storage(10)}/>,
    document.body
);
