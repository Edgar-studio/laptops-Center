// server.js
import jsonServer from 'json-server';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import cors from 'cors';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// CORS ավելացնել
server.use(cors({
    origin: 'http://localhost:5173', // Փոխել ձեր frontend URL-ին
    credentials: true
}));

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'public', 'uploadedImages', 'Products', 'temp');

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

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Միայն նկարներ են թույլատրվում (jpeg, jpg, png, webp)'));
        }
    }
});

// Upload endpoint
server.post('/api/upload-images', upload.array('images', 10), (req, res) => {
    try {
        console.log('📤 Upload request received');
        console.log('Body:', req.body);
        console.log('Files:', req.files?.length);

        const productId = req.body.productId;
        const files = req.files;

        if (!files || files.length === 0) {
            console.log('❌ No files uploaded');
            return res.status(400).json({ error: 'Նկարներ չեն ուղարկվել' });
        }

        if (productId) {
            console.log(`✅ ProductId exists: ${productId}`);
            const productDir = path.join(process.cwd(), 'public', 'uploadedImages', 'Products', productId);

            if (!fs.existsSync(productDir)) {
                fs.mkdirSync(productDir, { recursive: true });
                console.log(`📁 Created directory: ${productDir}`);
            }

            const imageUrls = files.map(file => {
                const oldPath = file.path;
                const newPath = path.join(productDir, file.filename);

                fs.renameSync(oldPath, newPath);
                console.log(`✅ Moved: ${file.filename}`);

                return `/uploadedImages/Products/${productId}/${file.filename}`;
            });

            console.log('✅ Upload successful:', imageUrls);
            return res.json({ images: imageUrls, productId });
        } else {
            console.log('⚠️ No productId - saving to temp');
            const imageUrls = files.map(file => {
                return `/uploadedImages/Products/temp/${file.filename}`;
            });

            return res.json({ images: imageUrls, productId: null });
        }
    } catch (error) {
        console.error('❌ Upload error:', error);
        return res.status(500).json({ error: 'Սխալ վերբեռնելիս: ' + error.message });
    }
});

// Move images endpoint
server.post('/api/move-images', (req, res) => {
    try {
        console.log('🔄 Move images request:', req.body);

        const { productId, tempImages } = req.body;

        if (!productId || !tempImages || tempImages.length === 0) {
            return res.status(400).json({ error: 'ProductId և tempImages պարտադիր են' });
        }

        const tempDir = path.join(process.cwd(), 'public', 'uploadedImages', 'Products', 'temp');
        const productDir = path.join(process.cwd(), 'public', 'uploadedImages', 'Products', productId);

        if (!fs.existsSync(productDir)) {
            fs.mkdirSync(productDir, { recursive: true });
        }

        const movedImages = [];

        tempImages.forEach(imagePath => {
            const filename = path.basename(imagePath);
            const oldPath = path.join(tempDir, filename);
            const newPath = path.join(productDir, filename);

            if (fs.existsSync(oldPath)) {
                fs.renameSync(oldPath, newPath);
                movedImages.push(`/uploadedImages/Products/${productId}/${filename}`);
                console.log(`✅ Moved: ${filename}`);
            } else {
                console.log(`⚠️ File not found: ${oldPath}`);
            }
        });

        // Clean temp folder if empty
        try {
            const remainingFiles = fs.readdirSync(tempDir);
            if (remainingFiles.length === 0) {
                fs.rmdirSync(tempDir);
                console.log('✅ Temp folder deleted');
            }
        } catch (err) {
            console.log('⚠️ Could not delete temp folder:', err.message);
        }

        console.log('✅ Move successful:', movedImages);
        res.json({ images: movedImages });
    } catch (error) {
        console.error('❌ Move error:', error);
        res.status(500).json({ error: 'Սխալ տեղափոխելիս: ' + error.message });
    }
});

// Use json-server router
server.use(router);

server.listen(4000, () => {
    console.log('🚀 JSON Server is running on http://localhost:4000');
    console.log('📁 Upload directory: public/uploadedImages/Products');
});