import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {richTablePlugin} from 'sanity-plugin-rich-table'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'webpit',

  projectId: 'pddoyk9z',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), codeInput(), richTablePlugin({})],

  schema: {
    types: schemaTypes,
  },
})
