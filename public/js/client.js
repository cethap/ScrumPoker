!(function($, io, ko, bootbox) {
  
  /*client side class here..*/
  var Client = function(ko, io) {
    this.__ko = ko;
    this.__io = io;
    this._cards = this.__ko.observableArray([0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, "Coffee"]);
    this._people = this.__ko.observableArray([]);
  };
  Client.prototype.init = function(name, room) {
    this._name = this.__ko.observable(name);
    this._room = this.__ko.observable(room);
    this._subj = this.__ko.observable("Task to estimate");
    this._vote = this.__ko.observable(null);
    this.__ko.applyBindings(this);
    this.__socket = this.__io.connect();
    this.__socket.emit('join', this.state());
    this.__socket.on('update', this.update);
    // console.log(this.__socket);
  };
  Client.prototype.update = function(data) {
    /*data:{subj, name, vote}*/
    if (data.subj != this._subj()) {
      //subject has changed, reset all
      return;
    }

  };
  Client.prototype.vote = function(val) {
    this._vote(val);
    this.__socket.emit('vote', this.state());
  };
  Client.prototype.state = function() {
    return {
      'name':this._name(),
      'room':this._room(),
      'subj':this._subj(),
      'vote':this._vote()
    };
  };

  /*on load code below*/
  $(function() {

    var room = window.location.hash.substring(1);
    var name = "Bob"; 
    var client = new Client(ko, io);
    debug = client; /*REMOVE*/ 


    // we first ask for their name
    bootbox.prompt("What is your name?", function(n) {
      if (n) {
        name = n;
        if (!room) {
          bootbox.prompt("Setup a room for Planning Pocker session:", function(r) {
            if (r !== null) {
              room = r;
              window.location.hash = "#" + room;
              client.init(name, room);
            }
          });
        } else { /*has room name*/
          client.init(name, room); /*!DRY*/
        }
      }
    });

  });

})(jQuery, io, ko, bootbox);