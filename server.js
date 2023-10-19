const express = require('express');
const pool = require('./db');
const app = express();
const PORT = 5000;
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World');

});

// ユーザー情報を全取得する
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) throw error;
    return res.status(200).json(results.rows);
  });
});

// 特定のユーザー情報を全取得する
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) throw error;
    return res.status(200).json(results.rows);
  });
});

// ユーザー情報を追加する
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;
  // ユーザー情報の確認
  pool.query("SELECT s FROM users s WHERE s.email = $1", [email], (error, results) => {
    if (results.rows.length > 0) {
      return res.send('既に登録されているメールアドレスです。');
    }

    pool.query('INSERT INTO users (name, email, age) VALUES ($1, $2, $3)', [name, email, age], (error, results) => {
      if (error) throw error;
      res.status(201).send(`ユーザー作成に成功 ID: ${results.insertId}`);
    });
  });
});

// 特定のユーザー情報を削除する
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) throw error;

    const isUserExist = results.rows.length;
    if (!isUserExist) {
      return res.send('ユーザーが存在しません。');
    }
  });


  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) throw error;
    return res.status(200).send('ユーザー情報を削除しました。');
  });
});

// 特定のユーザー情報を更新する
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const name = req.body.name;

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) throw error;

    const isUserExist = results.rows.length;
    if (!isUserExist) {
      return res.send('ユーザーが存在しません。');
    }
  });

  pool.query(
    'UPDATE users SET name = $1 WHERE id = $2',
    [name, id],
    (error, results) => {
    if (error) throw error;
    return res.status(200).send('更新に成功しました');
  });
});

app.listen(PORT, () => {
  console.log('Server is running on PORT:', PORT);
});