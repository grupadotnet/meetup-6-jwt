const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

const secret = '1234';

app.use(bodyParser.json());

app.get('/', (_, res) => {
  res.send('Hello World!')
});

app.post('/auth', (req, res) => {
  const { login  } = req.body;

  const role = login === 'admin' ? 'ADMIN' : 'USER';

  const token = jwt.sign({
    role,
  }, secret, {
    expiresIn: '1h',
  });

  res.json({ token });
});

app.get('/comments', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.json({ message: 'lack of token' });
  }

  if (jwt.verify(token, secret)) {
    res.json([
      { id: '1', message: 'Test' },
      { id: '2', message: 'Some comment' },
      { id: '3', message: 'Another' },
      { id: '4', message: 'And another one' },
    ])
  } else {
    res.json({
      message: 'invalid token'
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
