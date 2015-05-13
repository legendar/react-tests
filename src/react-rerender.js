var React = require('react'),
    {EventEmitter} = require('events'),
    _ = require('underscore'),
    Chance  = require('chance');
var chance = new Chance();
React.addons = window.addons = require('react-addons');
window.React = React;

var debug = window.logs = require('debug'),
    log = debug('main'),
    rlog = debug('render'),
    slog = debug('storage');

class Storage extends EventEmitter {
    constructor(size){
        super()
        this.rows = Array.apply(null, {length: size}).map(this.generateRow.bind(this));
        this.sortBy = {
          key: 'firstName',
          isAsc: true
        }
        slog('constructor')

        // there should be separate dispatcher class (FLUX-way)
        this.addListener('remove-item', (i)=> this.removeHandler(i))
    }
    getState() {
      slog('get state cloned')
      return { rows: JSON.parse(JSON.stringify(this.rows)), sortBy: this.sortBy}
    }

    generateRow(el, i){
        return {
          id: i,
          firstName: chance.first(),
          lastName: chance.last(),
          phone: chance.phone(),
          //removeHandler: this.removeHandler.bind(this, i)
        }
        slog('generate row')
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
      this.rows = this.rows.sort(
        (l, r) => {
          var {key, isAsc} = this.sortBy,
              res,
              mul = isAsc ? 1 : -1;
          if (l[key] > r[key]) { res = 1; }
          else if (l[key] === r[key]) { res = 0; }
          else { res = -1; }
          return res * mul;
      });
      this.emit('change')
      slog('sort controller')
    }
    removeHandler(id) {
      slog('remove handler start')
      var item = _(this.rows).findWhere({id: id})
      var index = this.rows.indexOf(item)
      if(index >= 0) {
        this.rows.splice(index, 1);
        slog('remove handler before emit')
      }
      this.emit('change');
      slog('remove handler end')
    }
}

class HeadCell extends React.Component {
  render() {
    rlog('head cell render')
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

class Row extends React.Component {
  render() {
    rlog('row render')
    var {number, firstName, lastName, phone, handler} = this.props;
    return (
      <tr>
        <td scope='row'>{number}</td>
        <td>{firstName}</td>
        <td>{lastName}</td>
        <td>{phone}</td>
        <td><span
              onClick={this.handleRemove.bind(this)}
              className="btn btn-danger">x</span></td>
      </tr>
    )
  }

  handleRemove(e) {
    dispatcher.emit('remove-item', this.props.number)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.number != nextProps.number ||
      this.props.firstName != nextProps.firstName ||
      this.props.lastName != nextProps.lastName ||
      this.props.phone != nextProps.phone
    )
  }
}
class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.store.getState()
    window.store = props.store;
  }

  _onChange() {
    rlog('onChange start')
    var {store} = this.props
    this.setState(store.getState())
    rlog('onChange end')
  }

  componentDidMount() {
    this.props.store.addListener('change', this._onChange.bind(this));
  }
  componentWillUnmount() {
    this.props.store.removeListener('change', this._onChange.bind(this));
  }

  render() {
    rlog('main render')
    var {sortBy, rows} = this.state;
    var sortHandler = this.props.store.sortHandler.bind(this.props.store)
    var removeHandler = this.props.store.removeHandler.bind(this.props.store)
    /*var headers = [
        ['id', '#'],
        ['firstName','First Name'],
        ['lastName', 'Last Name'],
        ['phone', 'Phone'],
      ].map(function([id, name]){
        return (
          <HeadCell sortBy={sortBy} handler={sortHandler.bind(undefined, id)} key={id} keyId={id}>{name}</HeadCell>
        )
      })*/
    return (
      <div className={'container'}>
          <h2>React</h2>
          <table className={'table'}>
            <thead>
            </thead>
            <tbody>
              {
                rows.map(function(el) {
                  return <Row phone={el.phone} firstName={el.firstName} lastName={el.lastName} number={el.id} key={el.id} />
                })
              }
            </tbody>
          </table>
      </div>
    )
}
}

var storage = new Storage(10000);
var dispatcher = storage;

React.render(
    <Table store={storage}/>,
    document.body
);
