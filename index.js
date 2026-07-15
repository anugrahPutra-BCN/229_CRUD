const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Konfigurasi Connection Pool ke PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: 'bismillah654',
    port: 5432,
});

app.use(express.json());

// [COMMIT 2] Implementasi rute GET untuk membaca seluruh data tabel biodata
app.get('/biodata', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM biodata');
        res.status(200).json({
            message: "Berhasil mengambil data biodata",
            data: result.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Terjadi kesalahan pada server atau database" });
    }
});

// [COMMIT 3] Implementasi rute POST untuk memasukkan data baru ke tabel biodataapp.post('/biodata', async (req, res) => {
    try {
        const { id, nama, nim, kelas } = req.body;

        const result = await pool.query(
            'INSERT INTO biodata (id, nama, nim, kelas) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, nama, nim, kelas]
        );

        res.status(201).json({
            message: "Berhasil menambahkan data biodata",
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Terjadi kesalahan pada server atau database" });
    }
});

// [COMMIT 4] Implementasi rute PUT dan DELETE berbasis id parameterapp.put('/biodata/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, nim, kelas } = req.body;

        const result = await pool.query(
            'UPDATE biodata SET nama = $1, nim = $2, kelas = $3 WHERE id = $4 RETURNING *',
            [nama, nim, kelas, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Data dengan id tersebut tidak ditemukan" });
        }

        res.status(200).json({
            message: "Berhasil mengupdate data biodata",
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Terjadi kesalahan pada server atau database" });
    }
});

// DELETE - Menghapus data biodata berdasarkan id
app.delete('/biodata/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM biodata WHERE id = $1 RETURNING *',
            [id]
        );

// [COMMIT 5] Handling status code 404 jika id biodata tidak ditemukan
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Data dengan id tersebut tidak ditemukan" });
        }

        res.status(200).json({
            message: "Berhasil menghapus data biodata",
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Terjadi kesalahan pada server atau database" });
    }
});

// Menjalankan Server Express
app.listen(port, () => {
    console.log('Server berjalan di http://localhost:3000');
});