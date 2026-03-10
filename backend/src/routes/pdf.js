const express = require('express')
const multer = require('multer')
const muhammara = require('muhammara')

function pdfRoutes() {
    const router = express.Router()
    const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } })

    router.post('/encrypt', upload.single('pdf'), (req, res, next) => {
        try {
            const { password } = req.body || {}
            
            if (!password) {
                return res.status(400).json({ message: 'Password is required' })
            }
            if (!req.file) {
                return res.status(400).json({ message: 'PDF file is required' })
            }
            if (password.trim().length === 0) {
                return res.status(400).json({ message: 'Password cannot be empty' })
            }

            let protectedPdfBuffer;

            try {
                const inStream = new muhammara.PDFRStreamForBuffer(req.file.buffer)
                const outStream = new muhammara.PDFWStreamForBuffer()

                // Write an encrypted PDF with user password protection
                // userProtectionFlag: 4 = Restrict printing and copying
                muhammara.recryptPDF(inStream, outStream, {
                    userPassword: password,
                    ownerPassword: password,
                    userProtectionFlag: 4
                })
                protectedPdfBuffer = outStream.buffer
            } catch (err) {
                console.error('PDF encryption error:', err)
                return res.status(500).json({ message: 'Error encrypting PDF. Ensure the file is a valid PDF.' })
            }

            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'attachment; filename="biodata-protected.pdf"')
            res.end(protectedPdfBuffer)
        } catch (err) {
            next(err)
        }
    })

    return router
}

module.exports = { pdfRoutes }
