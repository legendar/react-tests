var react = require('React'),
    {EventEmiter} = require('event');

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
        this.state = Array.apply(null, {length: size}).map(this.generateRow);
    }

    generateRow(el, i){
        return {
            id: i,
            firstName: `Name${guid()}`,
            lastName: `Last${guid()},
            phone: `${guid()}`
    }
}

class Table extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var {items, changeSortingHandler, sortBy, removeHandler} = this.props;
      var getHeadCell = (key, name) => {
        var span;
        if(key === sortBy.get('key')) {
          var direction = sortBy.get('isAsc') ? 'down' : 'up';
          span = D.span({
            className: `glyphicon glyphicon-chevron-${direction}`
          });
        }
        return D.th({onClick: _.partial(changeSortingHandler, key)}, name, span);
      };
      // TODO: refactor
      var sorted = this.props.items.map(
        (el, i) => _.extend(el.toObject(), {id: i})
      ).sort(
        (l, r) => {
          var {key, isAsc} = sortBy.toObject(),
              res,
              mul = isAsc ? 1 : -1;
          if (l[key] > r[key]) { res = 1; }
          else if (l[key] === r[key]) { res = 0; }
          else { res = -1; }
          return res * mul;
        }
      );
      var rows = sorted.map((el) => {
          return D.tr(
            {key: el.id},
            D.th({scope: 'row'}, el.id),
            D.td(null, el.firstName),
            D.td(null, el.lastName),
            D.td(null, el.phone),
            D.td(
              null,
              D.span({
                onClick: _.partial(removeHandler, el.id),
                className: 'glyphicon glyphicon-remove-sign'
              })
            )
          );
      });
      return D.table(
        {className: 'table'},
        D.thead(
          null,
          D.tr(
            null,
            getHeadCell('id', '#'),
            getHeadCell('firstName', 'First Name'),
            getHeadCell('lastName', 'Last Name'),
            getHeadCell('phone', 'Phone'),
            D.th(null, '')
          )
        ),
        D.tbody(
          null,
          rows
        )
      );
    }
}
