const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const { Biodata } = require('../models/Biodata')
const { BiodataVersion } = require('../models/BiodataVersion')

function ensureUploadsDir(uploadDir) {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
}

function biodataRoutes({ uploadDir }) {
  ensureUploadsDir(uploadDir)

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '').toLowerCase() || '.png'
      const safeExt = ['.png', '.jpg', '.jpeg', '.webp'].includes(ext) ? ext : '.png'
      const name = `${Date.now()}-${Math.random().toString(16).slice(2)}${safeExt}`
      cb(null, name)
    },
  })

  const upload = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  })

  const router = express.Router()

  function readPayload(req) {
    if (req.body?.payload) {
      return JSON.parse(req.body.payload)
    }
    return req.body || {}
  }

  router.post('/biodata', upload.single('profilePhoto'), async (req, res) => {
    const payload = readPayload(req)
    const profilePhoto = req.file ? `/uploads/${req.file.filename}` : payload.profilePhoto || ''

    const doc = await Biodata.create({
      userId: req.user.id,
      personalDetails: payload.personalDetails || {},
      familyDetails: payload.familyDetails || {},
      educationDetails: payload.educationDetails || {},
      horoscope: payload.horoscope || {},
      template: payload.template || 'classic',
      profilePhoto,
      privacy: payload.privacy || {},
      theme: payload.theme || {},
    })

    res.status(201).json(doc)
  })

  router.get('/biodata', async (req, res) => {
    const docs = await Biodata.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(docs)
  })

  router.put('/biodata/:id', upload.single('profilePhoto'), async (req, res) => {
    const payload = readPayload(req)
    const existing = await Biodata.findOne({ _id: req.params.id, userId: req.user.id })
    if (!existing) return res.status(404).json({ message: 'Biodata not found' })

    const nextPhoto = req.file ? `/uploads/${req.file.filename}` : payload.profilePhoto

    existing.personalDetails = payload.personalDetails ?? existing.personalDetails
    existing.familyDetails = payload.familyDetails ?? existing.familyDetails
    existing.educationDetails = payload.educationDetails ?? existing.educationDetails
    existing.horoscope = payload.horoscope ?? existing.horoscope
    existing.template = payload.template ?? existing.template
    existing.privacy = payload.privacy ?? existing.privacy
    existing.theme = payload.theme ?? existing.theme
    if (typeof nextPhoto === 'string') existing.profilePhoto = nextPhoto

    await existing.save()
    res.json(existing)
  })

  router.delete('/biodata/:id', async (req, res) => {
    const deleted = await Biodata.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!deleted) return res.status(404).json({ message: 'Biodata not found' })
    res.json({ ok: true })
  })

  router.get('/biodata/:id/versions', async (req, res) => {
    const biodata = await Biodata.findOne({ _id: req.params.id, userId: req.user.id })
    if (!biodata) return res.status(404).json({ message: 'Biodata not found' })
    const versions = await BiodataVersion.find({
      biodataId: biodata._id,
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .lean()
    res.json(versions)
  })

  router.post('/biodata/:id/versions', async (req, res) => {
    const payload = readPayload(req)
    const biodata = await Biodata.findOne({ _id: req.params.id, userId: req.user.id })
    if (!biodata) return res.status(404).json({ message: 'Biodata not found' })

    const snapshot = {
      personalDetails: payload.personalDetails || biodata.personalDetails,
      familyDetails: payload.familyDetails || biodata.familyDetails,
      educationDetails: payload.educationDetails || biodata.educationDetails,
      horoscope: payload.horoscope || biodata.horoscope,
      profilePhoto: payload.profilePhoto || biodata.profilePhoto,
      template: payload.template || biodata.template,
      privacy: payload.privacy || biodata.privacy,
      theme: payload.theme || biodata.theme,
    }

    const version = await BiodataVersion.create({
      biodataId: biodata._id,
      userId: req.user.id,
      snapshot,
      label: payload.label || '',
    })

    res.status(201).json(version)
  })

  router.post('/biodata/:id/restore', async (req, res) => {
    const { versionId } = readPayload(req)
    if (!versionId) return res.status(400).json({ message: 'versionId is required' })

    const biodata = await Biodata.findOne({ _id: req.params.id, userId: req.user.id })
    if (!biodata) return res.status(404).json({ message: 'Biodata not found' })

    const version = await BiodataVersion.findOne({
      _id: versionId,
      biodataId: biodata._id,
      userId: req.user.id,
    })
    if (!version) return res.status(404).json({ message: 'Version not found' })

    const snap = version.snapshot
    biodata.personalDetails = snap.personalDetails
    biodata.familyDetails = snap.familyDetails
    biodata.educationDetails = snap.educationDetails
    biodata.horoscope = snap.horoscope
    biodata.profilePhoto = snap.profilePhoto
    biodata.template = snap.template
    biodata.privacy = snap.privacy
    biodata.theme = snap.theme

    await biodata.save()
    res.json(biodata)
  })

  return router
}

module.exports = { biodataRoutes }

