 const multer =require ("multer") ;

/*const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

export default multerConfig({
    storage: diskStorage({
        destination: (req, file, callback) => {
            const __dirname = dirname(fileURLToPath(
                import.meta.url)); 
            callback(null, join(__dirname, "../public/images")); 
        },
  
        filename: (req, file, callback) => {
            const name = file.originalname.split(" ").join("_");
            const extension = MIME_TYPES[file.mimetype];
            callback(null, name + Date.now() + "." + extension);
        },
    }),
    limits: 10 * 1024 * 1024,
}).single("profilePic"); */

const storagePost = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public');
      },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'_' + file.originalname);
    } 
});

const uploadPost = multer({storage:storagePost}).single('image');

module.exports =  uploadPost;