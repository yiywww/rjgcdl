const express = require('express');
const cors = require('cors');
const loginRouter = require('./routes/login');
const adoptionRouter = require('./routes/adoption');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/login', loginRouter);
app.use('/api/adoption', adoptionRouter);

app.get('/', (req, res) => {
  res.json({ message: '宠物领养网站后端API服务运行中' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});