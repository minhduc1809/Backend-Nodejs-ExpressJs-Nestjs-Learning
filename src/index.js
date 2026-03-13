const express = require('express');
const app = express();
const PORT = 3000;

const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost:27017/backend';

mongoose.connect(DB_URL)
    .then(() => console.log('Kết nối thành công'))
    .catch((err) => console.log(err));

const cors = require('cors');
app.use(cors());

const helmet = require('helmet');
app.use(helmet());

const morgan = require('morgan');
app.use(morgan('dev'));

const productRouter = require('./routes/productRouter');

app.use(express.json());
const myLogger = (req, res, next) => {
    const time = new Date().toLocaleTimeString();
    console.log( `[${time}] Có request mới: ${req.method} ${req.url}`);
    next();
};
app.use(myLogger);

app.use('/products', productRouter);

app.post('/register', (req, res) => {
    console.log("Dữ liệu client gửi lên là: ", req.body);

    res.json({
        message: "Đã nhận được request!" ,
        data: req.body
    });

});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Đã có lỗi phía Server!', 
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(` Server đang chạy tại http://localhost:${PORT}`);
});
