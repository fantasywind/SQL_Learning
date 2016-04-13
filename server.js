var Sequelize = require('sequelize');
var sequelize = new Sequelize('mariadb://test123:test456@localhost/test123');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Models
var Task = require('./models/Task.js')(sequelize);
var Board = require('./models/Board.js')(sequelize);

Board.hasMany(Task);
Task.belongsTo(Board);

sequelize.sync({
  force: true,
}).then(function () {
  Board.create({
    name: 'Board 1',
  }).then(function (board) {
    Task.create({
      name: 'Task 1',
      finish: false,
    }).then(function (task1) {
      task1.setBoard(board);
    });

    Task.create({
      name: 'Task 2',
      finish: false,
    }).then(function (task2) {
      task2.setBoard(board);
    });
  });
});

app.get('/boards', function (req, res) {
  Board.findAll({
    attributes: [
      'id',
      'name'
    ],
    include: [{
      attributes: [
        'id',
        'name',
        'finish',
      ],
      model: Task,
    }],
  }).then(function (boards) {
    res.json(boards);
  });
});

app.post('/boards', function (req, res) {
  Board.create({
    name: req.body.name,
  }).then(function (board) {
    res.status(201);
    res.json({
      id: board.id,
    });
  });
});

app.post('/boards/:boardId/tasks', function (req, res) {
  Board.findOne({
    where: {
      id: req.params.boardId,
    },
  }).then(function (board) {
    Task.create({
      name: req.body.name,
    }).then(function (task) {
      task.setBoard(board).then(function () {
        res.status(201);
        res.json({
          id: task.id,
        });
      });
    });
  });
});

app.put('/boards/:boardId', function (req, res) {
  Board.findOne({
    where: {
      id: req.params.boardId,
    },
  }).then(function (board) {
    board.name = req.body.name;
    board.save().then(function (board) {
      res.status(204);
      res.end();
    });
  });
});

app.delete('/boards/:boardId', function (req, res) {
  Board.destroy({
    where: {
      id: req.params.boardId,
    },
  }).then(function (board) {
    res.status(204);
    res.end();
  });
});

app.listen(9876);
