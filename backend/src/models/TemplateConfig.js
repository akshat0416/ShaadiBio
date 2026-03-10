const mongoose = require('mongoose')
const { themeSchema } = require('./Biodata')

const templateConfigSchema = new mongoose.Schema(
  {
    templateId: { type: String, enum: ['classic', 'modern'], required: true, unique: true },
    enabled: { type: Boolean, default: true },
    defaultTheme: { type: themeSchema, default: {} },
  },
  { timestamps: true },
)

const TemplateConfig = mongoose.model('TemplateConfig', templateConfigSchema)

module.exports = { TemplateConfig }

