const express = require('express');
const cors = require('cors');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
const PORT = process.env.PORT || 3002;


app.use(cors());
app.use(express.json());

app.use('/api/loans', loanRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`ce service roule sur le port ${PORT}`);
});