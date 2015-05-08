var React = require('react'),
    {EventEmitter} = require('events'),
    Chance  = require('chance');
var chance = new Chance()

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
          firstName: chance.first(),
          lastName: chance.last(),
          phone: chance.phone()
        }
    }
    
    sortHandler(key) {
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
    removeHandler(id) {
      this.rows.splice(id, 1);
      this.emit('change');
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
    var removeHandler = this.props.store.removeHandler.bind(this.props.store)
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
          <h2>React</h2>
          <table className={'table'}>
            <thead>
            {headers}
            </thead>
            <tbody>
              {
                rows.map(function(el) {
                  return (
                    <tr key={el.id}>
                      <td scope='row'>{el.id}</td>
                      <td>{el.firstName}</td>
                      <td>{el.lastName}</td>
                      <td>{el.phone}</td>
                      <td><span 
                            onClick={removeHandler.bind(undefined, el.id)}
                            className="btn btn-danger">x</span></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
      </div>
    )
}
}

React.render(
    <Table store={new Storage(10000)}/>,
    document.body
);
