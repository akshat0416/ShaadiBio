const express = require('express')
const { User } = require('../models/User')
const { Biodata } = require('../models/Biodata')
const { TemplateConfig } = require('../models/TemplateConfig')

function ensureDefaultTemplates() {
  const defaults = [
    {
      templateId: 'classic',
      defaultTheme: { primaryColor: '#7c3aed', accentColor: '#0f172a', fontFamily: 'serif' },
    },
    {
      templateId: 'modern',
      defaultTheme: { primaryColor: '#7c3aed', accentColor: '#0f172a', fontFamily: 'sans' },
    },
  ]

  return Promise.all(
    defaults.map(async (d) => {
      const existing = await TemplateConfig.findOne({ templateId: d.templateId })
      if (existing) return existing
      return TemplateConfig.create({ templateId: d.templateId, defaultTheme: d.defaultTheme })
    }),
  )
}

function adminRoutes() {
  const router = express.Router()

  router.get('/stats', async (_req, res) => {
    const [userCount, biodataCount] = await Promise.all([
      User.countDocuments(),
      Biodata.countDocuments(),
    ])
    res.json({ userCount, biodataCount })
  })

  router.get('/users', async (_req, res) => {
    const users = await User.find({}, 'name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()
    res.json(users)
  })

  router.get('/biodata', async (_req, res) => {
    const docs = await Biodata.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('userId', 'name email')
      .lean()

    const mapped = docs.map((d) => ({
      id: d._id,
      userName: d.userId?.name || 'Unknown',
      userEmail: d.userId?.email || '',
      template: d.template,
      createdAt: d.createdAt,
    }))

    res.json(mapped)
  })

  router.get('/templates', async (_req, res) => {
    await ensureDefaultTemplates()
    const templates = await TemplateConfig.find({}).lean()
    res.json(templates)
  })

  router.put('/templates/:id', async (req, res) => {
    const { enabled, defaultTheme } = req.body || {}
    const tpl = await TemplateConfig.findById(req.params.id)
    if (!tpl) return res.status(404).json({ message: 'Template config not found' })

    if (typeof enabled === 'boolean') tpl.enabled = enabled
    if (defaultTheme && typeof defaultTheme === 'object') {
      tpl.defaultTheme = {
        ...tpl.defaultTheme?.toObject?.(),
        ...defaultTheme,
      }
    }

    await tpl.save()
    res.json(tpl)
  })

  return router
}

module.exports = { adminRoutes }

