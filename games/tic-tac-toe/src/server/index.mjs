import http from 'http';
import url from 'url';
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
    const { gameId, userId, ai } = url.parse(req.url, true).query;
    let game = games.find((g) => g.id === gameId);
    let isNewGame = false;
    if (!game) {
      isNewGame = true;
      game = new Game();
    }
    game.join(userId, (statusFor) => {
      const status = game.getStatus(statusFor);
      res.write(`id:${game.id}\n`);
      res.write(`data:${JSON.stringify(status)}\n\n`);
      if (!status.isActiveGame) {
        games = games.filter((g) => g.id !== game.id);
      }
    });
    if (isNewGame && ai === '1') {
      console.info('join ai')
      game.joinAI();
    }
    games.push(game);
    console.info('Games:', games.length);
  }
}).listen(8080);

console.info('Listen...')

