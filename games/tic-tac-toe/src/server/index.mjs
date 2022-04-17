import http from 'http';
import Game from './Game.mjs';

let games = [];

http.createServer(async(req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'POST') {
    let data = '';
    for await (const chunk of req) {
      data += chunk.toString();
    }
    const { gameId, row, cell, turnKey } = JSON.parse(data);
    const game = games.find((g) => g.id === gameId);
    if (!game || turnKey !== game.turnKey) {
      res.end();
      return;
    }
    game.click(row, cell);
    res.end();
  } else {
    res.setHeader('Content-Type', 'text/event-stream');

    const match = req.url.match(/\?gameId=(.*)/);

    let game = match && games.find((g) => g.id === match[1]);
    if (!game) {
      game = new Game();
    }
    game.join((statusFor) => {
      const status = game.getStatus(statusFor);
      res.write(`id:${game.id}\n`);
      res.write(`data:${JSON.stringify(status)}\n\n`);
      if (!status.isActiveGame) {
        games = games.filter((g) => g.id !== game.id);
      }
    });
    games.push(game);
    console.info('Games:', games.length);
  }
}).listen(8080);

console.info('Listen...')

