// server.js
import jsonServer from 'json-server';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const productId = req.body.productId || 'temp';
        const uploadDir = path.join(process.cwd(), 'public', 'uploadedImages', 'Products', productId);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Upload endpoint
server.post('/api/upload-images', upload.array('images', 10), (req, res) => {
    const productId = req.body.productId;
    const files = req.files;

    const imageUrls = files.map(file => {
        return `/uploadedImages/Products/${productId}/${file.filename}`;
    });

    res.json({ images: imageUrls });
});

server.use(router);

server.listen(4000, () => {
    console.log('JSON Server is running on http://localhost:4000');
});